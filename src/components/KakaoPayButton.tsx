import React, { useState, useCallback } from 'react';
import { requestKakaoPayReady } from '../api/kakaoPay';
import { TransactionRequestDto } from '../types/kakaoPay';
import { useAuthStore } from '../store/auth'; // Import useAuthStore

interface KakaoPayButtonProps {
  amount: number;
  merchantId?: number;
  latitude?: number;
  longitude?: number;
  onInitiateKakaoPay?: () => void; // New prop
}

const KakaoPayButton: React.FC<KakaoPayButtonProps> = ({ amount, merchantId, latitude, longitude, onInitiateKakaoPay }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken); // Get accessToken from store

  const handleKakaoPay = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!accessToken) {
      setError("로그인이 필요합니다. (No access token found)");
      setLoading(false);
      return;
    }

    const transactionData: TransactionRequestDto = {
      transactionAmount: amount, // Use amount from props
      txTime: new Date().toISOString(),
      source: "KAKAOPAY",
      itemName: "카카오페이 결제", // 기본값 설정
      quantity: 1, // 기본값 설정
    };

    if (merchantId) {
      transactionData.merchantId = merchantId;
    }
    if (latitude && longitude) {
      transactionData.geo = { lat: latitude, lng: longitude };
    } else {
      // merchantId나 geo 정보가 없을 경우 기본값 설정 (백엔드에서 처리 가능하도록)
      transactionData.geo = { lat: 0, lng: 0 }; // 또는 아예 geo 필드를 제거
    }

    try {
      const response = await requestKakaoPayReady(transactionData, accessToken); // Use actual accessToken
      if (response.next_redirect_pc_url) {
        if (onInitiateKakaoPay) {
          onInitiateKakaoPay(); // Call the callback before redirection
        }
        window.location.href = response.next_redirect_pc_url;
      } else {
        setError("Failed to get KakaoPay redirect URL.");
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during KakaoPay initiation.");
    } finally {
      setLoading(false);
    }
  }, [amount, accessToken, onInitiateKakaoPay]); // Add onInitiateKakaoPay to dependency array

  return (
    <div>
      <button onClick={handleKakaoPay} disabled={loading || amount <= 0}>
        {loading ? '결제 준비 중...' : '카카오페이로 결제하기'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default KakaoPayButton;

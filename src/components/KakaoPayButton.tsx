import React, { useState, useCallback } from 'react';
import { requestKakaoPayReady } from '../api/kakaoPay';
import { TransactionRequestDto } from '../types/kakaoPay';
import { useAuthStore } from '../store/auth'; // Import useAuthStore

interface KakaoPayButtonProps {
  amount: number;
}

const KakaoPayButton: React.FC<KakaoPayButtonProps> = ({ amount }) => {
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

    // Dummy transaction data for demonstration
    const transactionData: TransactionRequestDto = {
      transactionAmount: amount, // Use amount from props
      txTime: new Date().toISOString(),
      geo: { lat: 37.55, lng: 126.98 },
      merchantId: 45,
      source: "KAKAOPAY", // Changed source to KAKAOPAY to match backend enum
      itemName: "초코파이", // Added back itemName
      quantity: 1, // Added back quantity
    };

    try {
      const response = await requestKakaoPayReady(transactionData, accessToken); // Use actual accessToken
      if (response.next_redirect_pc_url) {
        window.location.href = response.next_redirect_pc_url;
      } else {
        setError("Failed to get KakaoPay redirect URL.");
      }
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during KakaoPay initiation.");
    } finally {
      setLoading(false);
    }
  }, [amount, accessToken]); // Add accessToken to dependency array

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

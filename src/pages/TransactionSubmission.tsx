import React, { useState, useEffect } from 'react';
import api, { getMerchantNames } from '@/api';
import { requestKakaoPayReady } from '@/api/kakaoPay'; // Import requestKakaoPayReady
import { useAuthStore } from '@/store/auth'; // Import useAuthStore
import { TransactionRequestDto } from '@/types/kakaoPay'; // Import TransactionRequestDto

interface Merchant {
  id: number;
  name: string;
}

interface TransactionRequest {
  merchantId: number;
  merchantCategory: string;
  transactionAmount: number;
  transactionDate: string;
  latitude?: number;
  longitude?: number;
  source: string;
}

const TransactionSubmission = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchantId, setSelectedMerchantId] = useState<number | ''>('');
  const [formData, setFormData] = useState<Omit<TransactionRequest, 'merchantId'>>({
    merchantCategory: '',
    transactionAmount: 0,
    transactionDate: new Date().toISOString().slice(0, 16),
    source: 'KAKAOPAY', // Default source to KAKAOPAY
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission loading
  const accessToken = useAuthStore((state) => state.accessToken); // Get accessToken from store

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const data = await getMerchantNames();
        setMerchants(data);
        if (data.length > 0) {
          setSelectedMerchantId(data[0].id); // Select the first merchant by default
        }
      } catch (error) {
        console.error('Failed to fetch merchant names:', error);
        alert('가맹점 목록을 불러오는데 실패했습니다.');
      }
    };
    fetchMerchants();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'selectedMerchantId') {
      setSelectedMerchantId(Number(value));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      setIsSubmitting(false);
      return;
    }

    // Basic validation
    if (!selectedMerchantId || !formData.merchantCategory || formData.transactionAmount <= 0) {
      alert('모든 필수 항목을 올바르게 입력해주세요.');
      setIsSubmitting(false);
      return;
    }

    const amount = Number(formData.transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('거래 금액은 0보다 큰 유효한 숫자여야 합니다.');
      setIsSubmitting(false);
      return;
    }

    const transactionDate = new Date(formData.transactionDate);
    if (isNaN(transactionDate.getTime())) {
      alert('거래 일시가 유효하지 않습니다.');
      setIsSubmitting(false);
      return;
    }

    const transactionData: TransactionRequestDto = {
      transactionAmount: amount,
      txTime: transactionDate.toISOString(),
      source: "KAKAOPAY",
      itemName: `${merchants.find(m => m.id === Number(selectedMerchantId))?.name || '결제'} - ${formData.merchantCategory}`,
      quantity: 1,
      merchantId: Number(selectedMerchantId),
      geo: { lat: 37.5665, lng: 126.9780 }, // Dummy data for now
    };

    try {
      const response = await requestKakaoPayReady(transactionData, accessToken);
      if (response.next_redirect_pc_url) {
        window.location.href = response.next_redirect_pc_url;
      } else {
        alert("카카오페이 결제 준비에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("카카오페이 결제 준비 실패:", err);
      alert(`카카오페이 결제 준비 실패: ${err.message || "알 수 없는 오류"}`);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <main style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#333', marginBottom: '30px', textAlign: 'center' }}>카카오페이 결제 요청</h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>가맹점 이름</label>
              <select
                name="selectedMerchantId"
                value={selectedMerchantId}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              >
                <option value="" disabled>가맹점을 선택하세요</option>
                {merchants.map((merchant) => (
                  <option key={merchant.id} value={merchant.id}>
                    {merchant.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>카테고리</label>
              <input type="text" name="merchantCategory" value={formData.merchantCategory} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>거래 금액 (원)</label>
              <input type="number" name="transactionAmount" value={formData.transactionAmount} onChange={handleChange} required min="1" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>거래 일시</label>
              <input type="datetime-local" name="transactionDate" value={formData.transactionDate} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
            </div>
            <button type="submit" disabled={isSubmitting} style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em' }}>
              {isSubmitting ? '결제 준비 중...' : '카카오페이 결제 요청'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TransactionSubmission;

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/api';
import { Link } from 'react-router-dom';
import KakaoPayButton from '@/components/KakaoPayButton';

interface TransactionRequest {
  merchantName: string;
  merchantCategory: string;
  transactionAmount: number;
  transactionDate: string;
  latitude?: number;
  longitude?: number;
  source: string; // Added source field
}

// ...

const TransactionSubmission = () => {
  const [formData, setFormData] = useState<TransactionRequest>({
    merchantName: '',
    merchantCategory: '',
    transactionAmount: 0,
    transactionDate: new Date().toISOString().slice(0, 16),
    source: 'MOCK', // Changed source to MOCK to match backend enum
  });
  const [submissionResult, setSubmissionResult] = useState<TransactionResponse | null>(null);

  const { mutate, isPending } = useMutation<TransactionResponse, Error, TransactionRequest>({
    mutationFn: async (transactionData) => {
      const response = await api.post<TransactionResponse>('/transactions', transactionData);
      return response.data;
    },
    onSuccess: (data) => {
      setSubmissionResult(data);
    },
    onError: (error) => {
      alert(`제출 실패: ${error.message}`);
      setSubmissionResult(null);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.merchantName || !formData.merchantCategory || formData.transactionAmount <= 0) {
      alert('모든 필수 항목을 올바르게 입력해주세요.');
      return;
    }

    const amount = Number(formData.transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('거래 금액은 0보다 큰 유효한 숫자여야 합니다.');
      return;
    }

    const transactionDate = new Date(formData.transactionDate);
    if (isNaN(transactionDate.getTime())) {
      alert('거래 일시가 유효하지 않습니다.');
      return;
    }

    mutate({
      ...formData,
      transactionAmount: amount,
      transactionDate: transactionDate.toISOString(), // Ensure full ISO format
      // Add dummy coordinates as they are required by DTO but not collected from user
      latitude: 37.5665,
      longitude: 126.9780,
    });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <main style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#333', marginBottom: '30px', textAlign: 'center' }}>거래 내역 직접 제출</h2>
          
          {!submissionResult ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>가맹점 이름</label>
                <input type="text" name="merchantName" value={formData.merchantName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
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
              <button type="submit" disabled={isPending} style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em' }}>
                {isPending ? '제출 중...' : '포인트 적립 요청'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#28a745' }}>{submissionResult.message}</h3>
              <p><strong>ESG 점수:</strong> {submissionResult.esgScore}점</p>
              <p><strong>적립된 포인트:</strong> <span style={{ fontWeight: 'bold', color: '#28a745' }}>{submissionResult.pointsEarned} P</span></p>
              <button onClick={() => setSubmissionResult(null)} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                다른 내역 제출하기
              </button>
            </div>
          )}

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '20px' }}>카카오페이로 결제하기</h3>
            <KakaoPayButton amount={Number(formData.transactionAmount)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransactionSubmission;

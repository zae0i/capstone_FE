import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { RewardDetails } from '@/types';
import { Link } from 'react-router-dom';

interface HistoryResponse {
  content: RewardDetails[];
  totalPages: number;
  number: number;
  size: number;
}

const TransactionHistory = () => {
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 7) + '-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const { data, isLoading, isError, error } = useQuery<HistoryResponse, Error>({
    queryKey: ['transactionHistory', startDate, endDate, page, size],
    queryFn: async () => {
      const response = await api.get<HistoryResponse>(
        `/rewards/history?from=${startDate}&to=${endDate}&page=${page}&size=${size}`
      );
      return response.data;
    },
    enabled: !!startDate && !!endDate,
  });

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(parseInt(e.target.value, 10));
    setPage(0); // Reset to the first page when size changes
  }

  const transactions = data?.content || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <main style={{
        flexGrow: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '900px',
        }}>
          <h2 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>포인트 적립/사용 내역</h2>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
            <div>
              <label htmlFor="startDate" style={{ marginRight: '5px' }}>시작일:</label>
              <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label htmlFor="endDate" style={{ marginRight: '5px' }}>종료일:</label>
              <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
             <div>
              <label htmlFor="size" style={{ marginRight: '5px' }}>개수:</label>
              <select id="size" value={size} onChange={handleSizeChange} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value={10}>10개씩</option>
                <option value={20}>20개씩</option>
                <option value={50}>50개씩</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>내역 로딩 중...</div>
          ) : isError ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>에러 발생: {error?.message}</div>
          ) : transactions && transactions.length > 0 ? (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>날짜</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>가맹점</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>카테고리</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>금액</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>포인트</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                      <td style={{ padding: '12px' }}>{transaction.merchant}</td>
                      <td style={{ padding: '12px' }}>{transaction.category}</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{transaction.amount?.toLocaleString()}원</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: transaction.type === 'EARN' ? '#28a745' : '#dc3545' }}>
                        {transaction.type === 'EARN' ? '+' : '-'} {transaction.pointsEarned || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', gap: '10px' }}>
                <button onClick={() => setPage(p => Math.max(p - 1, 0))} disabled={page === 0} style={{ padding: '8px 12px' }}>이전</button>
                <span>Page {page + 1} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))} disabled={page >= totalPages - 1} style={{ padding: '8px 12px' }}>다음</button>
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px', color: '#777' }}>선택된 기간에 내역이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionHistory;
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRewardTransactionHistory } from '@/api';
import { RewardTransactionHistoryDto } from '@/types';
import { Link } from 'react-router-dom';

const TransactionHistory = () => {
  const { data, isLoading, isError, error } = useQuery<RewardTransactionHistoryDto[], Error>({
    queryKey: ['rewardTransactionHistory'],
    queryFn: getRewardTransactionHistory,
  });

  const transactions = data || [];

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
          <h2 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>최근 거래 내역 (최대 10개)</h2>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>내역 로딩 중...</div>
          ) : isError ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>에러 발생: {error?.message}</div>
          ) : transactions && transactions.length > 0 ? (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>거래 시간</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>가맹점</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>거래 금액</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>거래 출처</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>거래 상태</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>포인트</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>ESG 점수</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>
                        {new Date(transaction.transactionTime).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px' }}>{transaction.merchantName}</td>
                      <td style={{ padding: '12px', textAlign: 'left' }}>{transaction.transactionAmount?.toLocaleString()}원</td>
                      <td style={{ padding: '12px', textAlign: 'left' }}>{transaction.transactionSource}</td>
                      <td style={{ padding: '12px', textAlign: 'left' }}>{transaction.transactionStatus}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: transaction.points > 0 ? '#28a745' : '#dc3545' }}>
                        {transaction.points > 0 ? '+' : ''}{transaction.points}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{transaction.esgScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px', color: '#777' }}>거래 내역이 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionHistory;
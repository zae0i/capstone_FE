import React from 'react';
import { Link, useParams } from 'react-router-dom';

const KakaoPaySuccess: React.FC = () => {
  const { txId } = useParams<{ txId: string }>();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <main style={{ padding: '30px', maxWidth: '800px', margin: '40px auto' }}>
        <div style={{ backgroundColor: '#fff', padding: '50px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h2 style={{ color: '#28a745', fontSize: '2em', marginBottom: '20px' }}>🎉 결제 성공</h2>
          <p style={{ fontSize: '1.2em', color: '#333', marginBottom: '30px' }}>카카오페이 결제가 성공적으로 완료되었습니다.</p>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '40px' }}>
            <p style={{ margin: 0, color: '#555' }}>
              <strong>거래 ID:</strong> {txId}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <Link to="/transactions" style={{ padding: '12px 25px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px', fontSize: '1em', transition: 'background-color 0.2s' }}>
              거래 내역 확인하기
            </Link>
            <Link to="/dashboard" style={{ padding: '12px 25px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px', fontSize: '1em', transition: 'background-color 0.2s' }}>
              대시보드로 이동
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KakaoPaySuccess;

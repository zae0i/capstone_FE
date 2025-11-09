import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const Header = () => {
  const { accessToken, clearTokens } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: '#fff',
      padding: '0 40px',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: '#1a73e8', fontSize: '22px', fontWeight: 'bold' }}>
          GreenPoint
        </Link>
        <nav style={{ marginLeft: '40px', display: 'flex', gap: '25px' }}>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#5f6368', fontWeight: 500 }}>대시보드</Link>
          <Link to="/transactions" style={{ textDecoration: 'none', color: '#5f6368', fontWeight: 500 }}>거래내역</Link>
          <Link to="/submission" style={{ textDecoration: 'none', color: '#5f6368', fontWeight: 500 }}>거래내역 제출</Link>
          <Link to="/report" style={{ textDecoration: 'none', color: '#5f6368', fontWeight: 500 }}>리포트</Link>
          <Link to="/ranking" style={{ textDecoration: 'none', color: '#5f6368', fontWeight: 500 }}>랭킹</Link>
        </nav>
      </div>
      <div>
        {accessToken ? (
          <>
            <Link to="/mypage" style={{ textDecoration: 'none', color: '#5f6368', marginRight: '20px', fontWeight: 500 }}>마이페이지</Link>
            <button onClick={handleLogout} style={{
              border: 'none',
              background: 'transparent',
              color: '#1a73e8',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '15px'
            }}>
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login" style={{ textDecoration: 'none', color: '#1a73e8', fontWeight: 500 }}>로그인</Link>
        )}
      </div>
    </header>
  );
};

export default Header;

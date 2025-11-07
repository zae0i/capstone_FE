import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#e0ffe0', // Light green background
      padding: '20px',
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '50px',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '3em',
          color: '#28a745',
          marginBottom: '20px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          GreenPoint에 오신 것을 환영합니다!
        </h1>
        <p style={{
          fontSize: '1.2em',
          color: '#555',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          탄소 발자국을 줄이고 지구를 위한 착한 소비로 리워드를 받으세요.
        </p>
        <nav style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center'
        }}>
          <Link to="/login" style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1.1em',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#45a049';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#4CAF50';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            로그인
          </Link>
          <Link to="/signup" style={{
            backgroundColor: '#6c757d', // Grey color
            color: 'white',
            padding: '15px 30px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '1.1em',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#5a6268';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#6c757d';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            회원가입
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Home;

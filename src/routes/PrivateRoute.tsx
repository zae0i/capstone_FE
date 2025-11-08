import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#28a745', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.6em' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>GreenPoint</Link>
        </h1>
        <nav>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: '25px' }}>
            <li><Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>대시보드</Link></li>
            <li><Link to="/transactions" style={{ color: 'white', textDecoration: 'none' }}>전체 내역</Link></li>
            <li><Link to="/submission" style={{ color: 'white', textDecoration: 'none' }}>거래 제출</Link></li>
            <li><Link to="/ranking" style={{ color: 'white', textDecoration: 'none' }}>랭킹</Link></li>
            <li><Link to="/report" style={{ color: 'white', textDecoration: 'none' }}>리포트</Link></li>
            <li><Link to="/mypage" style={{ color: 'white', textDecoration: 'none' }}>마이페이지</Link></li>
            <li><button onClick={handleLogout} style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9em' }}>로그아웃</button></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

const PrivateRoute = () => {
  const { accessToken } = useAuthStore();

  return accessToken ? <AppLayout /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

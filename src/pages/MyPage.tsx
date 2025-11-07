import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Link } from 'react-router-dom';
import { UserProfile } from '@/types';

const MyPage = () => {
  const { data: userProfile, isLoading, isError, error } = useQuery<UserProfile, Error>({
    queryKey: ['myUserProfile'], // Use a unique key to avoid conflict with other user profile queries
    queryFn: async () => {
      const response = await api.get<UserProfile>('/users/me');
      return response.data;
    },
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#28a745', color: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.6em' }}>GreenPoint</h1>
        <nav>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: '25px' }}>
            <li><Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>대시보드</Link></li>
            <li><Link to="/transactions" style={{ color: 'white', textDecoration: 'none' }}>전체 내역</Link></li>
            <li><Link to="/submission" style={{ color: 'white', textDecoration: 'none' }}>거래 제출</Link></li>
            <li><Link to="/ranking" style={{ color: 'white', textDecoration: 'none' }}>랭킹</Link></li>
            <li><Link to="/report" style={{ color: 'white', textDecoration: 'none' }}>리포트</Link></li>
            <li><Link to="/mypage" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>마이페이지</Link></li>
          </ul>
        </nav>
      </header>

      <main style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#333', marginBottom: '30px', textAlign: 'center' }}>마이페이지</h2>

          {isLoading ? (
            <p style={{ textAlign: 'center' }}>프로필 정보를 불러오는 중...</p>
          ) : isError ? (
            <p style={{ textAlign: 'center', color: 'red' }}>오류 발생: {error.message}</p>
          ) : userProfile && (
            <div>
              <div style={{ borderBottom: '1px solid #eee', paddingBottom: '30px', marginBottom: '30px' }}>
                <h3 style={{ color: '#007bff', marginBottom: '20px' }}>기본 정보</h3>
                <p><strong>이메일:</strong> {userProfile.email}</p>
                <p><strong>닉네임:</strong> {userProfile.nickname}</p>
                <p><strong>지역:</strong> {userProfile.region}</p>
                <p><strong>레벨:</strong> Lv. {userProfile.level}</p>
                <p><strong>포인트:</strong> {userProfile.points.toLocaleString()} P</p>
              </div>

              <div>
                <h3 style={{ color: '#007bff', marginBottom: '20px' }}>보유 배지</h3>
                {userProfile.badges && userProfile.badges.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {userProfile.badges.map((badge, index) => (
                      <div key={index} style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', padding: '20px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{badge.badgeName}</h4>
                        <p style={{ margin: '0 0 10px 0', color: '#555' }}>{badge.badgeDescription}</p>
                        <p style={{ margin: 0, color: '#777', fontSize: '0.9em' }}>
                          획득일: {new Date(badge.acquiredAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>아직 획득한 배지가 없습니다.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyPage;

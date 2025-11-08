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

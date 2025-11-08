import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Link } from 'react-router-dom';
import { RankingResponse } from '@/types';

const Ranking = () => {
  const [region, setRegion] = useState('서울');
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // Default to current month

  const { data: rankingData, isLoading, isError, error } = useQuery<RankingResponse, Error>({
    queryKey: ['ranking', region, period],
    queryFn: async () => {
      const response = await api.get<RankingResponse>(`/rewards/ranking?region=${region}&period=${period}`);
      return response.data;
    },
    enabled: !!region && !!period,
  });

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
          maxWidth: '800px',
        }}>
          <h2 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>지역별 랭킹</h2>

          <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'flex-end' }}>
            <div>
              <label htmlFor="region" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>지역:</label>
              <select id="region" value={region} onChange={(e) => setRegion(e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <option value="서울">서울</option>
                <option value="부산">부산</option>
                <option value="대구">대구</option>
                <option value="인천">인천</option>
                <option value="광주">광주</option>
                <option value="대전">대전</option>
                <option value="울산">울산</option>
                <option value="세종">세종</option>
                <option value="경기">경기</option>
                <option value="강원">강원</option>
                <option value="충북">충북</option>
                <option value="충남">충남</option>
                <option value="전북">전북</option>
                <option value="전남">전남</option>
                <option value="경북">경북</option>
                <option value="경남">경남</option>
                <option value="제주">제주</option>
              </select>
            </div>
            <div>
              <label htmlFor="period" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>기간:</label>
              <input type="month" id="period" value={period} onChange={(e) => setPeriod(e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>랭킹 로딩 중...</div>
          ) : isError ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>랭킹 에러 발생: {error?.message}</div>
          ) : rankingData && (
            <div>
              <div style={{
                backgroundColor: '#e9f7ef',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #d4edda',
                marginBottom: '30px',
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#28a745', margin: '0 0 10px 0' }}>내 순위</h3>
                {rankingData.myRank ? (
                  <p style={{ fontSize: '1.2em', color: '#555' }}>
                    <span style={{ fontWeight: 'bold' }}>{rankingData.myRank.nickname}</span>님 (Lv.{rankingData.myRank.level})은
                    <span style={{ fontWeight: 'bold', color: '#007bff', fontSize: '1.5em', margin: '0 5px' }}>
                      {rankingData.myRank.rank}
                    </span>위
                    (<span style={{ fontWeight: 'bold' }}>{rankingData.myRank.points.toLocaleString()}</span> P)
                  </p>
                ) : (
                  <p style={{ fontSize: '1.2em', color: '#555' }}>선택된 기간의 랭킹 정보가 없습니다.</p>
                )}
              </div>

              <h3 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>상위 10위 랭킹</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'center' }}>순위</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>닉네임</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>레벨</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>포인트</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingData.topRankings?.map((item) => (
                    <tr key={item.userId} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#007bff' }}>{item.rank}</td>
                      <td style={{ padding: '12px', textAlign: 'left' }}>{item.nickname}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{item.level}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{item.points.toLocaleString()} P</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Ranking;
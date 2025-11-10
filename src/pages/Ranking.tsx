import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { Link } from 'react-router-dom';
import { RankingInfo, MyRanking } from '@/types';

const Ranking = () => {
  const { data: topRankingsData, isLoading: isLoadingTopRankings, isError: isErrorTopRankings, error: errorTopRankings } = useQuery<{ topRankings: RankingInfo[] }, Error>({
    queryKey: ['topRankings'],
    queryFn: async () => {
      const response = await api.get<{ topRankings: RankingInfo[] }>('/ranking');
      return response.data;
    },
  });

  const { data: myRank, isLoading: isLoadingMyRank, isError: isErrorMyRank, error: errorMyRank } = useQuery<MyRanking, Error>({
    queryKey: ['myRank'],
    queryFn: async () => {
      const response = await api.get<MyRanking>('/ranking/my-rank');
      return response.data;
    },
  });

  const topRankings = topRankingsData?.topRankings;

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
          <h2 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>전체 랭킹</h2>

          {isLoadingTopRankings || isLoadingMyRank ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>랭킹 로딩 중...</div>
          ) : isErrorTopRankings || isErrorMyRank ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>랭킹 에러 발생: {errorTopRankings?.message || errorMyRank?.message}</div>
          ) : (
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
                {myRank ? (
                  <p style={{ fontSize: '1.2em', color: '#555' }}>
                    <span style={{ fontWeight: 'bold' }}>{myRank.nickname}</span>님 (Lv.{myRank.level})은
                    <span style={{ fontWeight: 'bold', color: '#007bff', fontSize: '1.5em', margin: '0 5px' }}>
                      {myRank.rank}
                    </span>위
                    (<span style={{ fontWeight: 'bold' }}>{myRank.points.toLocaleString()}</span> P)
                  </p>
                ) : (
                  <p style={{ fontSize: '1.2em', color: '#555' }}>Top 10 순위권 밖입니다.</p>
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
                  {topRankings?.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
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
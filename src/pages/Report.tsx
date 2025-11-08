import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '@/store/auth';
import { Link } from 'react-router-dom';
import { ReportResponse } from '@/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666'];

const Report = () => {
  const { user } = useAuthStore();
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  const userId = user?.id; // Assuming user object has an id

  const { data: userReport, isLoading, isError, error } = useQuery<ReportResponse, Error>({
    queryKey: ['userReport', userId, period],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is not available.');
      }
      const response = await api.get<ReportResponse>(`/users/${userId}/report?period=${period}`);
      return response.data;
    },
    enabled: !!userId, // Only fetch if userId is available
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
          maxWidth: '1000px',
        }}>
          <h2 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>월간 리포트</h2>

          <div style={{ marginBottom: '30px', display: 'flex', gap: '15px', justifyContent: 'center', alignItems: 'flex-end' }}>
            <div>
              <label htmlFor="period" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>기간:</label>
              <input type="month" id="period" value={period} onChange={(e) => setPeriod(e.target.value)}
                style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>리포트 로딩 중...</div>
          ) : isError ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>리포트 에러 발생: {error?.message}</div>
          ) : userReport && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <div>
                <h3 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>카테고리별 분포</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userReport.categoryBreakdown || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="totalAmount"
                      nameKey="categoryName"
                      label={({ categoryName, percent }) => `${categoryName}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {(userReport.categoryBreakdown || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 style={{ color: '#333', marginBottom: '15px', textAlign: 'center' }}>TOP 매장</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {(userReport.topMerchants || []).map((merchant, index) => (
                    <li key={index} style={{
                      backgroundColor: '#f9f9f9',
                      border: '1px solid #eee',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      padding: '15px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>{merchant.merchantName}</span>
                      <span style={{ color: '#28a745', fontWeight: 'bold' }}>{merchant.totalAmount?.toLocaleString()} 원</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Report;
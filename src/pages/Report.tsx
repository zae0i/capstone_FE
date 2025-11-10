import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ReportResponse } from '@/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF6666'];

const Report = () => {
  const { data: reportData, isLoading, isError, error } = useQuery<ReportResponse, Error>({
    queryKey: ['report'],
    queryFn: async () => {
      const response = await api.get<ReportResponse>('/report');
      return response.data;
    },
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
          maxWidth: '1200px',
        }}>
          <h2 style={{ color: '#333', marginBottom: '25px', textAlign: 'center' }}>종합 리포트</h2>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>리포트 로딩 중...</div>
          ) : isError ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>리포트 에러 발생: {error?.message}</div>
          ) : reportData && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px', textAlign: 'center' }}>
                <div style={{ backgroundColor: '#e9f7ef', padding: '20px', borderRadius: '8px' }}>
                  <h3 style={{ color: '#28a745' }}>총 ESG 기여도</h3>
                  <p style={{ fontSize: '2em', fontWeight: 'bold', margin: '10px 0' }}>{reportData.totalEsgScore.toLocaleString()}</p>
                </div>
                <div style={{ backgroundColor: '#e8f4fd', padding: '20px', borderRadius: '8px' }}>
                  <h3 style={{ color: '#007bff' }}>총 소비 금액</h3>
                  <p style={{ fontSize: '2em', fontWeight: 'bold', margin: '10px 0' }}>{reportData.totalConsumption.toLocaleString()} 원</p>
                </div>
                <div style={{ backgroundColor: '#fff4e6', padding: '20px', borderRadius: '8px' }}>
                  <h3 style={{ color: '#ff9800' }}>친환경 매장 결제</h3>
                  <p style={{ fontSize: '2em', fontWeight: 'bold', margin: '10px 0' }}>{reportData.ecoFriendlyPaymentsCount} 회</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div>
                  <h3 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>카테고리별 분석</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={reportData.categoryReports} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={80} />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} 원`} />
                      <Legend />
                      <Bar dataKey="totalAmount" name="소비 금액" fill="#8884d8" />
                      <Bar dataKey="esgScore" name="ESG 점수" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>ESG 기여도 높은 매장 TOP 5</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>매장명</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>방문 횟수</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>ESG 점수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.topEsgMerchants.map((merchant) => (
                        <tr key={merchant.merchantName} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>{merchant.merchantName}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>{merchant.visitCount}</td>
                          <td style={{ padding: '12px', textAlign: 'right', color: '#28a745', fontWeight: 'bold' }}>{merchant.esgScore.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Report;
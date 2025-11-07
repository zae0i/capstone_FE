import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RewardDetails } from '@/types';

interface DailyReportChartProps {
  data: RewardDetails[] | undefined;
}

const DailyReportChart = ({ data }: DailyReportChartProps) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const categoryMap = new Map<string, number>();

    data.forEach(transaction => {
      const { category, amount } = transaction;
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category)! + amount);
      } else {
        categoryMap.set(category, amount);
      }
    });

    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, '소비 금액': value }));
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return <p style={{ textAlign: 'center', color: '#777' }}>오늘 소비 내역이 없습니다.</p>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
          <Legend />
          <Bar dataKey="소비 금액" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyReportChart;

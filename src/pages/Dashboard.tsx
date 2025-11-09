import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api";
import { UserProfile, UserBalance, RewardDetails, CreateTransactionRequest } from "@/types";
import DailyReportChart from "@/components/DailyReportChart";
import { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  // 1. Fetch basic user profile to get ID
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery<UserProfile, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await api.get<UserProfile>('/users/me');
      setUser(response.data);
      return response.data;
    },
    staleTime: Infinity, // User profile rarely changes
  });

  const userId = userProfile?.id;

  // 2. Fetch dashboard-specific data (balance, level, recent rewards)
  const { data: userBalance, isLoading: isLoadingBalance } = useQuery<UserBalance, Error>({
    queryKey: ['userBalance', userId],
    queryFn: async () => {
      const response = await api.get<UserBalance>(`/rewards/${userId}/balance`);
      return response.data;
    },
    enabled: !!userId, // Only run this query when userId is available
  });

  // 3. Fetch today's daily report
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const { data: dailyReport, isLoading: isLoadingChartData } = useQuery<ReportResponseDto, Error>({
    queryKey: ['dailyReport', userId, today],
    queryFn: async () => {
      const response = await api.get<ReportResponseDto>(`/users/${userId}/daily-report?date=${today}`);
      return response.data;
    },
    enabled: !!userId, // Only run this query when userId is available
  });

  // 4. Mutation for simulating a transaction
  const { mutate: simulatePayment } = useMutation<any, Error, CreateTransactionRequest>({
    mutationFn: async (transactionData) => {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    },
    onSuccess: () => {
      // Refetch all relevant data after a successful transaction
      queryClient.invalidateQueries({ queryKey: ['userBalance'] });
      queryClient.invalidateQueries({ queryKey: ['todayTransactions'] });
      alert('결제가 성공적으로 모의되었습니다!');
    },
    onError: (err) => {
      alert(`결제 모의 실패: ${err.message}`);
    },
  });

  useEffect(() => {
    const KAKAO_APP_KEY = '4aab6f53cf5d27c047aa3f8b87925f28';
    const KAKAO_MAP_SCRIPT_ID = 'kakao-map-script';

    // Check if Kakao Maps script is already loaded
    if (window.kakao && window.kakao.maps) {
      console.log('Kakao Maps script already loaded.');
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (container) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const locPosition = new window.kakao.maps.LatLng(lat, lon);
                const options = {
                  center: locPosition,
                  level: 3,
                };
                new window.kakao.maps.Map(container, options);
              },
              (error) => {
                console.error("Error getting current location (script already loaded):", error);
                const options = {
                  center: new window.kakao.maps.LatLng(33.450701, 126.570667), // Default to a fixed location
                  level: 3,
                };
                new window.kakao.maps.Map(container, options);
              }
            );
          } else {
            console.log("Geolocation is not supported by this browser.");
            const options = {
              center: new window.kakao.maps.LatLng(33.450701, 126.570667), // Default to a fixed location
              level: 3,
            };
            new window.kakao.maps.Map(container, options);
          }
        }
      });
      return;
    }

    // Check if the script tag already exists (e.g., from a previous render in strict mode)
    if (document.getElementById(KAKAO_MAP_SCRIPT_ID)) {
      console.log('Kakao Maps script tag already exists, waiting for it to load.');
      return;
    }

    // Dynamically create and append the script tag
    const script = document.createElement('script');
    script.id = KAKAO_MAP_SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      console.log('Kakao Maps script loaded successfully.');
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (container) {
          const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667), // Default to a fixed location
            level: 3
          };

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const locPosition = new window.kakao.maps.LatLng(lat, lon);
                const options = {
                  center: locPosition,
                  level: 3,
                };
                new window.kakao.maps.Map(container, options);
              },
              (error) => {
                console.error("Error getting current location:", error);
                // Fallback to default fixed location if geolocation fails
                const options = {
                  center: new window.kakao.maps.LatLng(33.450701, 126.570667), // Default to a fixed location
                  level: 3,
                };
                new window.kakao.maps.Map(container, options);
              }
            );
          } else {
            console.log("Geolocation is not supported by this browser.");
            // Fallback to default fixed location if geolocation is not supported
            const options = {
              center: new window.kakao.maps.LatLng(33.450701, 126.570667), // Default to a fixed location
              level: 3,
            };
            new window.kakao.maps.Map(container, options);
          }
        } else {
          console.error('Map container not found.');
        }
      });
    };

    script.onerror = (error) => {
      console.error('Failed to load Kakao Maps script:', error);
    };

    document.head.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [])

  const handleSimulatePayment = () => {
    const transactionAmount = Math.floor(Math.random() * 20000) + 1000; // 1000 ~ 20999
    const categories = ['대중교통', '친환경 제품', '카페', '식당'];
    const merchants = ['서울교통공사', '그린마트', '스타벅스', '채식식당', 'CU'];
    const merchantCategory = categories[Math.floor(Math.random() * categories.length)];
    const merchantName = merchants[Math.floor(Math.random() * merchants.length)];

    simulatePayment({
      merchant: merchantName,
      category: merchantCategory,
      amount: transactionAmount,
      transactionDate: new Date().toISOString(),
      latitude: 37.5665, // Dummy data
      longitude: 126.9780, // Dummy data
    });
  };

  const isLoading = isLoadingProfile || isLoadingBalance;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <main style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div id="map" style={{width:"100%", height:"500px", marginBottom: '30px'}}></div>

        <h2 style={{ color: '#333', marginBottom: '30px' }}>{userBalance?.nickname || user?.nickname}님, 환영합니다!</h2>
        
        {isLoading && <p>데이터를 불러오는 중...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#555', margin: '0 0 10px 0' }}>현재 포인트</h3>
              <p style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#28a745', margin: 0 }}>{userBalance?.points?.toLocaleString() || 0} P</p>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#555', margin: '0 0 10px 0' }}>레벨</h3>
              <p style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#28a745', margin: 0 }}>Lv. {userBalance?.level || 1}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#333', marginBottom: '20px' }}>일일 소비 리포트</h3>
              {isLoadingChartData ? <p>차트 데이터 로딩 중...</p> : <DailyReportChart data={dailyReport} />}
            </div>
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ color: '#333', marginBottom: '20px' }}>최근 리워드 내역</h3>
              {userBalance?.recentRewards && userBalance.recentRewards.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {userBalance.recentRewards.map((reward, index) => (
                    <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #eee' }}>
                      <span>{reward.description}</span>
                      <span style={{ fontWeight: 'bold', color: '#28a745' }}>+{reward.points} P</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#777', textAlign: 'center' }}>최근 리워드 내역이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={handleSimulatePayment} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '5px', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold' }}>
            거래 내역 제출 (모의)
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

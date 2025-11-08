import { TransactionRequestDto, KakaoPayReadyResponseDto } from '../types/kakaoPay';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Adjust if your API base URL is different

export const requestKakaoPayReady = async (payload: TransactionRequestDto, token: string): Promise<KakaoPayReadyResponseDto> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/kakao/ready`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Assuming JWT token for authorization
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to prepare KakaoPay payment');
    }

    return response.json();
  } catch (error) {
    console.error('Error requesting KakaoPay ready:', error);
    throw error;
  }
};

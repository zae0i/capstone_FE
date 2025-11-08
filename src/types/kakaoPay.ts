export interface TransactionRequestDto {
  transactionAmount: number;
  txTime: string;
  geo: {
    lat: number;
    lng: number;
  };
  merchantId: number;
  source: string;
  itemName: string;
  quantity: number;
}

export interface KakaoPayReadyResponseDto {
  tid: string;
  next_redirect_app_url: string;
  next_redirect_mobile_url: string;
  next_redirect_pc_url: string;
  android_app_scheme: string;
  ios_app_scheme: string;
  created_at: string;
}

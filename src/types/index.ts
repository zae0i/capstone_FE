export interface Badge {
  badgeName: string;
  badgeDescription: string;
  acquiredAt: string;
}

export interface UserProfile {
  id: number;
  email: string;
  nickname: string;
  region: string;
  points: number;
  level: number;
  badges: Badge[];
}

export interface LoginResponse {
  accessToken: string;
}

// For POST /transactions
export interface PaymentTransaction {
  id: number;
  amount: number;
  approvedAt: string;
  merchant: string;
  pointsEarned?: number;
}

export interface CreateTransactionRequest {
  merchant: string;
  category: string;
  amount: number;
  txTime: string;
  latitude: number;
  longitude: number;
}

// For GET /rewards/history
export interface RewardDetails {
  id: number;
  categoryName: string;
  type: 'EARN' | 'USE';
  amount: number;
  pointsEarned: number;
}

export interface RankingInfo {
  userId: number;
  rank: number;
  nickname: string;
  level: number;
  points: number;
}

export interface MyRanking {
  rank: number;
  nickname: string;
  level: number;
  points: number;
}



export interface CategoryReport {
  category: string;
  transactionCount: number;
  totalAmount: number;
  esgScore: number;
}

export interface TopEsgMerchant {
  merchantName: string;
  visitCount: number;
  totalAmount: number;
  esgScore: number;
}

export interface ReportResponse {
  totalEsgScore: number;
  totalConsumption: number;
  ecoFriendlyPaymentsCount: number;
  categoryReports: CategoryReport[];
  topEsgMerchants: TopEsgMerchant[];
}

// For /admin APIs
export interface Merchant {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface EsgRule {
  id: number;
  name: string;
  description: string;
  points: number;
}

export interface RecentReward {
  description: string;
  points: number;
  createdAt: string;
}

export interface UserBalance {
  userId: number;
  nickname: string;
  level: number;
  points: number;
  recentRewards: RecentReward[];
}

export interface RewardTransactionHistoryDto {
  rewardPointId: number;
  points: number;
  esgScore: number;
  rewardReason: string;
  rewardCreatedAt: string;
  transactionId: number;
  transactionAmount: number;
  transactionTime: string;
  merchantName: string;
  transactionSource: string;
  transactionStatus: string;
}


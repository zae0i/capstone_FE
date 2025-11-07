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

// For GET /rewards/history
export interface RewardDetails {
  id: number;
  transactionDate: string;
  merchant: string;
  category: string;
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

export interface RankingResponse {
  topRankings: RankingInfo[];
  myRank: MyRanking;
}

export interface CategoryBreakdown {
  categoryName: string;
  totalAmount: number;
  transactionCount: number;
}

export interface TopMerchant {
  merchantName: string;
  totalAmount: number;
  transactionCount: number;
}

export interface ReportResponse {
  userId: number;
  nickname: string;
  period: string,
  totalPointsEarned: number;
  totalTransactions: number;
  categoryBreakdown: CategoryBreakdown[];
  topMerchants: TopMerchant[];
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

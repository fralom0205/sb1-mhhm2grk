export interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  engagement: number;
  createdAt: string;
  description?: string;
  thumbnail?: string;
}

export interface DashboardStats {
  activePromotions: number;
  totalReach: number;
  scheduledCampaigns: number;
  conversionRate: number;
  totalPurchases: number;
  socialShares: number;
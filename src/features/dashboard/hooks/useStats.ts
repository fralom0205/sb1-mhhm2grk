import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { DashboardStats } from '../types/dashboardTypes';

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);

        // Get promotions
        const promotionsRef = collection(db, 'promotions');
        const promotionsQuery = query(
          promotionsRef, 
          where('userId', '==', user.id),
          orderBy('createdAt', 'desc')
        );
        const promotionsSnap = await getDocs(promotionsQuery);
        const promotions = promotionsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Get content
        const contentRef = collection(db, 'content');
        const contentQuery = query(
          contentRef, 
          where('userId', '==', user.id),
          orderBy('createdAt', 'desc')
        );
        const contentSnap = await getDocs(contentQuery);
        const content = contentSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate stats
        const totalViews = promotions.reduce((sum, p: any) => sum + (p.views || 0), 0);
        const totalEngagement = promotions.reduce((sum, p: any) => sum + (p.engagement || 0), 0);
        const avgEngagement = promotions.length > 0 ? totalEngagement / promotions.length : 0;

        setStats({
          activePromotions: promotions.filter((p: any) => p.status === 'active').length,
          totalReach: totalViews,
          scheduledCampaigns: content.filter((c: any) => c.status === 'draft').length,
          conversionRate: avgEngagement,
          totalPurchases: Math.floor(totalViews * (avgEngagement / 100)),
          socialShares: Math.floor(totalViews * 0.15)
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Initialize with zero values if error occurs
        setStats({
          activePromotions: 0,
          totalReach: 0,
          scheduledCampaigns: 0,
          conversionRate: 0,
          totalPurchases: 0,
          socialShares: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [user?.id]);

  return { stats, isLoading };
}
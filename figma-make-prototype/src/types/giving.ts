/**
 * ChurchAfrica ChMS - Giving/Donations Type Definitions
 * Africa-First giving management with mobile money and offline support
 */

export type PaymentMethod = 
  | 'cash' 
  | 'mobile_money' 
  | 'bank_transfer' 
  | 'card' 
  | 'check' 
  | 'online';

export type MobileMoneyProvider = 
  | 'm_pesa' 
  | 'mtn_mobile_money' 
  | 'airtel_money' 
  | 'orange_money'
  | 'tigopesa'
  | 'vodacom_mpesa';

export type GivingCategory = 
  | 'tithe' 
  | 'offering' 
  | 'special_offering'
  | 'building_fund' 
  | 'missions' 
  | 'special_project'
  | 'first_fruit'
  | 'thanksgiving'
  | 'seed_offering'
  | 'pledge'
  | 'other';

export type DonationStatus = 
  | 'completed' 
  | 'pending' 
  | 'failed' 
  | 'reversed'
  | 'offline_pending_sync';

export type Currency = 'NGN' | 'GHS' | 'KES' | 'USD' | 'ZAR' | 'UGX' | 'TZS';

export interface Donation {
  id: string;
  donor_id: string;
  donor_name: string;
  member_id?: string; // Link to member if donor is a member
  amount: number;
  currency: Currency;
  category: GivingCategory;
  payment_method: PaymentMethod;
  mobile_money_provider?: MobileMoneyProvider;
  transaction_reference?: string;
  receipt_number: string;
  status: DonationStatus;
  notes?: string;
  campaign_id?: string;
  service_id?: string;
  branch_id: string;
  organization_id: string;
  recorded_by: string;
  recorded_at: string;
  synced_to_server: boolean;
  tax_deductible: boolean;
  anonymous: boolean;
  created_at: string;
  updated_at: string;
}

export interface Donor {
  id: string;
  member_id?: string; // Link to member if applicable
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  is_anonymous: boolean;
  organization_id: string;
  branch_id?: string;
  total_giving: number;
  total_giving_ytd: number;
  first_donation_date?: string;
  last_donation_date?: string;
  donation_count: number;
  preferred_payment_method?: PaymentMethod;
  tax_id?: string; // For tax receipts
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  category: GivingCategory;
  goal_amount: number;
  current_amount: number;
  currency: Currency;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
  organization_id: string;
  branch_id?: string; // null = organization-wide
  created_by: string;
  image_url?: string;
  donor_count: number;
  created_at: string;
  updated_at: string;
}

export interface Pledge {
  id: string;
  donor_id: string;
  donor_name: string;
  campaign_id?: string;
  amount: number;
  currency: Currency;
  frequency: 'one_time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date?: string;
  amount_paid: number;
  amount_remaining: number;
  status: 'active' | 'completed' | 'cancelled';
  organization_id: string;
  branch_id: string;
  created_at: string;
  updated_at: string;
}

export interface GivingStats {
  total_today: number;
  total_this_week: number;
  total_this_month: number;
  total_this_year: number;
  total_all_time: number;
  donor_count_total: number;
  donor_count_active: number; // Donated in last 90 days
  average_donation: number;
  largest_donation: number;
  by_category: Record<GivingCategory, number>;
  by_payment_method: Record<PaymentMethod, number>;
  trend_vs_last_month: number; // Percentage change
  currency: Currency;
}

export interface GivingTrend {
  date: string;
  amount: number;
  transaction_count: number;
}

export interface TaxReceipt {
  id: string;
  donor_id: string;
  donor_name: string;
  year: number;
  total_amount: number;
  currency: Currency;
  donation_count: number;
  receipt_number: string;
  generated_at: string;
  generated_by: string;
  organization_id: string;
}

/**
 * Vue Migration Notes:
 * 
 * // Pinia store for giving management
 * // stores/giving.ts
 * import { defineStore } from 'pinia';
 * import { ref, computed } from 'vue';
 * 
 * export const useGivingStore = defineStore('giving', () => {
 *   const donations = ref<Donation[]>([]);
 *   const donors = ref<Donor[]>([]);
 *   const campaigns = ref<Campaign[]>([]);
 *   const stats = ref<GivingStats | null>(null);
 *   const loading = ref(false);
 * 
 *   // Computed
 *   const activeCampaigns = computed(() => 
 *     campaigns.value.filter(c => c.status === 'active')
 *   );
 * 
 *   const topDonors = computed(() => 
 *     [...donors.value]
 *       .sort((a, b) => b.total_giving_ytd - a.total_giving_ytd)
 *       .slice(0, 10)
 *   );
 * 
 *   // Actions
 *   const recordDonation = async (donation: Partial<Donation>) => {
 *     loading.value = true;
 *     try {
 *       // Call Laravel API
 *       const response = await api.post('/api/donations', donation);
 *       donations.value.unshift(response.data);
 *       await fetchStats();
 *       return { success: true, data: response.data };
 *     } catch (error) {
 *       return { success: false, error };
 *     } finally {
 *       loading.value = false;
 *     }
 *   };
 * 
 *   const fetchDonations = async (filters?: any) => {
 *     const response = await api.get('/api/donations', { params: filters });
 *     donations.value = response.data;
 *   };
 * 
 *   const fetchStats = async () => {
 *     const response = await api.get('/api/donations/stats');
 *     stats.value = response.data;
 *   };
 * 
 *   // Offline support with IndexedDB
 *   const recordOfflineDonation = async (donation: Partial<Donation>) => {
 *     const offlineDonation = {
 *       ...donation,
 *       id: `offline_${Date.now()}`,
 *       status: 'offline_pending_sync',
 *       synced_to_server: false,
 *       created_at: new Date().toISOString(),
 *     };
 *     
 *     // Store in IndexedDB
 *     await db.donations.add(offlineDonation);
 *     donations.value.unshift(offlineDonation);
 *   };
 * 
 *   const syncOfflineDonations = async () => {
 *     const offlineDonations = await db.donations
 *       .where('synced_to_server')
 *       .equals(false)
 *       .toArray();
 *     
 *     for (const donation of offlineDonations) {
 *       try {
 *         await recordDonation(donation);
 *         await db.donations.delete(donation.id);
 *       } catch (error) {
 *         console.error('Sync failed for donation:', donation.id);
 *       }
 *     }
 *   };
 * 
 *   return {
 *     donations,
 *     donors,
 *     campaigns,
 *     stats,
 *     loading,
 *     activeCampaigns,
 *     topDonors,
 *     recordDonation,
 *     fetchDonations,
 *     fetchStats,
 *     recordOfflineDonation,
 *     syncOfflineDonations,
 *   };
 * });
 * 
 * // Quasar component usage:
 * <template>
 *   <q-page class="q-pa-md">
 *     <div class="row q-col-gutter-md">
 *       <div class="col-12 col-md-3" v-for="stat in statsCards" :key="stat.label">
 *         <q-card flat bordered>
 *           <q-card-section>
 *             <div class="text-h6">{{ stat.value }}</div>
 *             <div class="text-caption text-grey">{{ stat.label }}</div>
 *           </q-card-section>
 *         </q-card>
 *       </div>
 *     </div>
 *   </q-page>
 * </template>
 * 
 * <script setup lang="ts">
 * import { useGivingStore } from '@/stores/giving';
 * import { onMounted } from 'vue';
 * 
 * const givingStore = useGivingStore();
 * 
 * onMounted(async () => {
 *   await givingStore.fetchStats();
 *   await givingStore.fetchDonations();
 * });
 * </script>
 */

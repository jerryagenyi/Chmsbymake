/**
 * ChurchAfrica ChMS - Reports & Analytics Type Definitions
 * Comprehensive reporting for giving, attendance, and member analytics
 */

import type { Currency, GivingCategory, PaymentMethod } from './giving';

export type ReportType = 
  | 'service_comparison'
  | 'giving_summary'
  | 'donor_statements'
  | 'tax_receipts'
  | 'campaign_performance'
  | 'payment_methods'
  | 'category_analysis'
  | 'branch_comparison'
  | 'monthly_trends'
  | 'annual_summary';

export type ExportFormat = 'pdf' | 'csv' | 'excel' | 'print';

export type DateRangePreset = 
  | 'today'
  | 'yesterday'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'this_quarter'
  | 'last_quarter'
  | 'this_year'
  | 'last_year'
  | 'all_time'
  | 'custom';

export interface DateRange {
  start: string;
  end: string;
  preset?: DateRangePreset;
}

export interface ReportFilters {
  dateRange: DateRange;
  branchIds?: string[];
  categories?: GivingCategory[];
  paymentMethods?: PaymentMethod[];
  minAmount?: number;
  maxAmount?: number;
  donorIds?: string[];
  campaignIds?: string[];
  includeAnonymous?: boolean;
}

export interface GivingSummaryReport {
  period: DateRange;
  total_amount: number;
  transaction_count: number;
  donor_count: number;
  average_donation: number;
  largest_donation: number;
  smallest_donation: number;
  currency: Currency;
  by_category: Record<GivingCategory, {
    amount: number;
    count: number;
    percentage: number;
  }>;
  by_payment_method: Record<PaymentMethod, {
    amount: number;
    count: number;
    percentage: number;
  }>;
  by_branch: Record<string, {
    branch_name: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  top_donors: {
    donor_id: string;
    donor_name: string;
    amount: number;
    donation_count: number;
  }[];
  daily_breakdown: {
    date: string;
    amount: number;
    count: number;
  }[];
}

export interface DonorStatement {
  donor_id: string;
  donor_name: string;
  donor_email?: string;
  donor_phone?: string;
  donor_address?: string;
  statement_period: DateRange;
  generated_at: string;
  total_amount: number;
  transaction_count: number;
  currency: Currency;
  donations: {
    date: string;
    amount: number;
    category: GivingCategory;
    payment_method: PaymentMethod;
    receipt_number: string;
    campaign_name?: string;
  }[];
  by_category: Record<GivingCategory, number>;
  tax_deductible_total: number;
}

export interface TaxReceipt {
  receipt_id: string;
  receipt_number: string;
  donor_id: string;
  donor_name: string;
  donor_address?: string;
  donor_tax_id?: string;
  organization_name: string;
  organization_address?: string;
  organization_tax_id?: string;
  tax_year: number;
  total_amount: number;
  currency: Currency;
  donation_count: number;
  generated_at: string;
  generated_by: string;
  donations: {
    date: string;
    amount: number;
    category: string;
    receipt_number: string;
  }[];
  notes?: string;
}

export interface CampaignReport {
  campaign_id: string;
  campaign_name: string;
  goal_amount: number;
  current_amount: number;
  progress_percentage: number;
  donor_count: number;
  average_donation: number;
  largest_donation: number;
  days_active: number;
  days_remaining: number;
  currency: Currency;
  donations_by_date: {
    date: string;
    amount: number;
    count: number;
  }[];
  top_donors: {
    donor_name: string;
    amount: number;
    is_anonymous: boolean;
  }[];
  payment_method_breakdown: Record<PaymentMethod, number>;
}

export interface BranchComparisonReport {
  period: DateRange;
  branches: {
    branch_id: string;
    branch_name: string;
    total_amount: number;
    donor_count: number;
    transaction_count: number;
    average_donation: number;
    growth_percentage: number;
    top_category: GivingCategory;
  }[];
  total_across_branches: number;
  currency: Currency;
}

export interface MonthlyTrendReport {
  months: {
    month: string; // YYYY-MM
    total_amount: number;
    transaction_count: number;
    donor_count: number;
    average_donation: number;
    growth_vs_previous: number;
  }[];
  overall_trend: 'increasing' | 'decreasing' | 'stable';
  average_monthly: number;
  currency: Currency;
}

export interface ReportMetadata {
  report_id: string;
  report_type: ReportType;
  generated_at: string;
  generated_by: string;
  organization_id: string;
  filters: ReportFilters;
  record_count: number;
}

/**
 * Vue Migration Notes:
 * 
 * // Pinia store for reports
 * // stores/reports.ts
 * import { defineStore } from 'pinia';
 * import { ref, computed } from 'vue';
 * import jsPDF from 'jspdf';
 * import 'jspdf-autotable';
 * 
 * export const useReportsStore = defineStore('reports', () => {
 *   const currentReport = ref<GivingSummaryReport | null>(null);
 *   const loading = ref(false);
 *   const filters = ref<ReportFilters>({
 *     dateRange: { start: '', end: '', preset: 'this_month' }
 *   });
 * 
 *   // Generate giving summary report
 *   const generateGivingSummary = async (filters: ReportFilters) => {
 *     loading.value = true;
 *     try {
 *       const response = await api.post('/api/reports/giving-summary', filters);
 *       currentReport.value = response.data;
 *       return response.data;
 *     } catch (error) {
 *       console.error('Report generation failed:', error);
 *       throw error;
 *     } finally {
 *       loading.value = false;
 *     }
 *   };
 * 
 *   // Export to PDF
 *   const exportToPDF = (report: GivingSummaryReport, filename: string) => {
 *     const doc = new jsPDF();
 *     
 *     // Header
 *     doc.setFontSize(18);
 *     doc.text('Giving Summary Report', 14, 22);
 *     doc.setFontSize(11);
 *     doc.text(`Period: ${report.period.start} to ${report.period.end}`, 14, 30);
 *     
 *     // Summary stats
 *     doc.autoTable({
 *       startY: 40,
 *       head: [['Metric', 'Value']],
 *       body: [
 *         ['Total Amount', formatCurrency(report.total_amount)],
 *         ['Transactions', report.transaction_count],
 *         ['Donors', report.donor_count],
 *         ['Average', formatCurrency(report.average_donation)],
 *       ],
 *     });
 *     
 *     doc.save(filename);
 *   };
 * 
 *   // Export to CSV
 *   const exportToCSV = (data: any[], filename: string) => {
 *     const csv = convertToCSV(data);
 *     const blob = new Blob([csv], { type: 'text/csv' });
 *     const url = window.URL.createObjectURL(blob);
 *     const link = document.createElement('a');
 *     link.href = url;
 *     link.download = filename;
 *     link.click();
 *   };
 * 
 *   return {
 *     currentReport,
 *     loading,
 *     filters,
 *     generateGivingSummary,
 *     exportToPDF,
 *     exportToCSV,
 *   };
 * });
 * 
 * // Quasar component usage:
 * <template>
 *   <q-page class="q-pa-md">
 *     <q-card>
 *       <q-card-section>
 *         <div class="text-h6">Reports & Analytics</div>
 *       </q-card-section>
 *       
 *       <q-card-section>
 *         <q-select
 *           v-model="selectedDateRange"
 *           :options="dateRangeOptions"
 *           label="Date Range"
 *           @update:model-value="generateReport"
 *         />
 *         
 *         <q-btn
 *           label="Export PDF"
 *           icon="picture_as_pdf"
 *           color="primary"
 *           @click="exportPDF"
 *           :loading="loading"
 *         />
 *         
 *         <q-btn
 *           label="Export CSV"
 *           icon="table_view"
 *           color="secondary"
 *           @click="exportCSV"
 *         />
 *       </q-card-section>
 *       
 *       <q-card-section v-if="currentReport">
 *         <div class="row q-col-gutter-md">
 *           <div class="col-3" v-for="stat in stats" :key="stat.label">
 *             <q-card flat bordered>
 *               <q-card-section>
 *                 <div class="text-h4">{{ stat.value }}</div>
 *                 <div class="text-caption text-grey">{{ stat.label }}</div>
 *               </q-card-section>
 *             </q-card>
 *           </div>
 *         </div>
 *       </q-card-section>
 *     </q-card>
 *   </q-page>
 * </template>
 * 
 * <script setup lang="ts">
 * import { useReportsStore } from '@/stores/reports';
 * import { onMounted } from 'vue';
 * 
 * const reportsStore = useReportsStore();
 * 
 * onMounted(() => {
 *   generateReport();
 * });
 * 
 * const generateReport = async () => {
 *   await reportsStore.generateGivingSummary(reportsStore.filters);
 * };
 * </script>
 */
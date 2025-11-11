/**
 * ChurchAfrica ChMS - Mock Report Data
 * Sample data for reports and analytics
 */

import type {
  GivingSummaryReport,
  DonorStatement,
  TaxReceipt,
  CampaignReport,
  BranchComparisonReport,
  MonthlyTrendReport,
} from '../types/reports';
import { mockDonations, mockDonors } from './mock-giving-data';

// Mock Giving Summary Report (This Month)
export const mockGivingSummaryReport: GivingSummaryReport = {
  period: {
    start: '2024-10-01',
    end: '2024-10-31',
    preset: 'this_month',
  },
  total_amount: 892000,
  transaction_count: 127,
  donor_count: 89,
  average_donation: 7023,
  largest_donation: 50000,
  smallest_donation: 500,
  currency: 'NGN',
  by_category: {
    tithe: { amount: 320000, count: 42, percentage: 35.9 },
    offering: { amount: 245000, count: 38, percentage: 27.5 },
    building_fund: { amount: 150000, count: 12, percentage: 16.8 },
    special_offering: { amount: 80000, count: 15, percentage: 9.0 },
    missions: { amount: 45000, count: 8, percentage: 5.0 },
    special_project: { amount: 30000, count: 6, percentage: 3.4 },
    first_fruit: { amount: 12000, count: 3, percentage: 1.3 },
    thanksgiving: { amount: 8000, count: 2, percentage: 0.9 },
    seed_offering: { amount: 2000, count: 1, percentage: 0.2 },
    pledge: { amount: 0, count: 0, percentage: 0 },
    other: { amount: 0, count: 0, percentage: 0 },
  },
  by_payment_method: {
    cash: { amount: 401600, count: 68, percentage: 45.0 },
    mobile_money: { amount: 303280, count: 35, percentage: 34.0 },
    bank_transfer: { amount: 160560, count: 18, percentage: 18.0 },
    card: { amount: 17840, count: 4, percentage: 2.0 },
    check: { amount: 8920, count: 2, percentage: 1.0 },
    online: { amount: 0, count: 0, percentage: 0 },
  },
  by_branch: {
    b1: {
      branch_name: 'Lagos Headquarters',
      amount: 534000,
      count: 76,
      percentage: 59.8,
    },
    b2: {
      branch_name: 'Abuja Branch',
      amount: 267600,
      count: 38,
      percentage: 30.0,
    },
    b3: {
      branch_name: 'Accra Branch',
      amount: 90400,
      count: 13,
      percentage: 10.2,
    },
  },
  top_donors: [
    {
      donor_id: 'don3',
      donor_name: 'Anonymous',
      amount: 85000,
      donation_count: 3,
    },
    {
      donor_id: 'don1',
      donor_name: 'Pastor John Mensah',
      amount: 42000,
      donation_count: 8,
    },
    {
      donor_id: 'don2',
      donor_name: 'Grace Okonkwo',
      amount: 38500,
      donation_count: 7,
    },
    {
      donor_id: 'don5',
      donor_name: 'Esther Kamau',
      amount: 28000,
      donation_count: 6,
    },
    {
      donor_id: 'don4',
      donor_name: 'Samuel Adeyemi',
      amount: 22000,
      donation_count: 9,
    },
  ],
  daily_breakdown: Array.from({ length: 31 }, (_, i) => {
    const date = new Date(2024, 9, i + 1);
    const isSunday = date.getDay() === 0;
    const isWednesday = date.getDay() === 3;
    
    return {
      date: date.toISOString().split('T')[0],
      amount: isSunday ? Math.floor(Math.random() * 80000) + 40000
            : isWednesday ? Math.floor(Math.random() * 30000) + 10000
            : Math.floor(Math.random() * 5000) + 1000,
      count: isSunday ? Math.floor(Math.random() * 40) + 20
           : isWednesday ? Math.floor(Math.random() * 15) + 5
           : Math.floor(Math.random() * 5) + 1,
    };
  }),
};

// Mock Donor Statement
export const mockDonorStatement: DonorStatement = {
  donor_id: 'don1',
  donor_name: 'Pastor John Mensah',
  donor_email: 'john.mensah@email.com',
  donor_phone: '+233244567890',
  donor_address: '123 Cantonments Road, Accra, Ghana',
  statement_period: {
    start: '2024-01-01',
    end: '2024-12-31',
    preset: 'this_year',
  },
  generated_at: '2024-10-25T14:30:00Z',
  total_amount: 32000,
  transaction_count: 48,
  currency: 'GHS',
  donations: [
    {
      date: '2024-10-24',
      amount: 5000,
      category: 'tithe',
      payment_method: 'mobile_money',
      receipt_number: 'RCT-2024-001234',
    },
    {
      date: '2024-10-21',
      amount: 2500,
      category: 'offering',
      payment_method: 'mobile_money',
      receipt_number: 'RCT-2024-001239',
    },
    {
      date: '2024-10-17',
      amount: 3000,
      category: 'tithe',
      payment_method: 'mobile_money',
      receipt_number: 'RCT-2024-001210',
      campaign_name: 'Building Fund Campaign',
    },
    {
      date: '2024-10-10',
      amount: 2000,
      category: 'offering',
      payment_method: 'cash',
      receipt_number: 'RCT-2024-001185',
    },
    {
      date: '2024-10-03',
      amount: 4500,
      category: 'tithe',
      payment_method: 'mobile_money',
      receipt_number: 'RCT-2024-001156',
    },
  ],
  by_category: {
    tithe: 18000,
    offering: 8500,
    building_fund: 3500,
    missions: 1500,
    special_offering: 500,
    special_project: 0,
    first_fruit: 0,
    thanksgiving: 0,
    seed_offering: 0,
    pledge: 0,
    other: 0,
  },
  tax_deductible_total: 32000,
};

// Mock Tax Receipt
export const mockTaxReceipt: TaxReceipt = {
  receipt_id: 'tr2024001',
  receipt_number: 'TAX-2024-001',
  donor_id: 'don1',
  donor_name: 'Pastor John Mensah',
  donor_address: '123 Cantonments Road, Accra, Ghana',
  donor_tax_id: 'TIN-GH-123456789',
  organization_name: 'Victory Chapel Ministry',
  organization_address: '456 Victory Street, Lagos, Nigeria',
  organization_tax_id: 'TIN-NG-987654321',
  tax_year: 2024,
  total_amount: 32000,
  currency: 'GHS',
  donation_count: 48,
  generated_at: '2024-10-25T14:30:00Z',
  generated_by: 'admin',
  donations: [
    {
      date: '2024-10-24',
      amount: 5000,
      category: 'Tithe',
      receipt_number: 'RCT-2024-001234',
    },
    {
      date: '2024-10-21',
      amount: 2500,
      category: 'Offering',
      receipt_number: 'RCT-2024-001239',
    },
    {
      date: '2024-10-17',
      amount: 3000,
      category: 'Tithe',
      receipt_number: 'RCT-2024-001210',
    },
    {
      date: '2024-10-10',
      amount: 2000,
      category: 'Offering',
      receipt_number: 'RCT-2024-001185',
    },
    {
      date: '2024-10-03',
      amount: 4500,
      category: 'Tithe',
      receipt_number: 'RCT-2024-001156',
    },
  ],
  notes: 'Thank you for your faithful giving throughout 2024. May God bless you abundantly.',
};

// Mock Campaign Report
export const mockCampaignReport: CampaignReport = {
  campaign_id: 'camp1',
  campaign_name: 'New Church Building Project',
  goal_amount: 5000000,
  current_amount: 3250000,
  progress_percentage: 65,
  donor_count: 156,
  average_donation: 20833,
  largest_donation: 500000,
  days_active: 298,
  days_remaining: 67,
  currency: 'NGN',
  donations_by_date: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    amount: Math.floor(Math.random() * 150000) + 20000,
    count: Math.floor(Math.random() * 8) + 2,
  })),
  top_donors: [
    { donor_name: 'Anonymous', amount: 500000, is_anonymous: true },
    { donor_name: 'Chief Emmanuel Okafor', amount: 350000, is_anonymous: false },
    { donor_name: 'Mrs. Blessing Adeleke', amount: 250000, is_anonymous: false },
    { donor_name: 'Pastor David Mensah', amount: 200000, is_anonymous: false },
    { donor_name: 'Anonymous', amount: 150000, is_anonymous: true },
  ],
  payment_method_breakdown: {
    cash: 1462500,
    mobile_money: 975000,
    bank_transfer: 650000,
    card: 130000,
    check: 32500,
    online: 0,
  },
};

// Mock Branch Comparison Report
export const mockBranchComparisonReport: BranchComparisonReport = {
  period: {
    start: '2024-10-01',
    end: '2024-10-31',
    preset: 'this_month',
  },
  branches: [
    {
      branch_id: 'b1',
      branch_name: 'Lagos Headquarters',
      total_amount: 534000,
      donor_count: 98,
      transaction_count: 76,
      average_donation: 7026,
      growth_percentage: 15.3,
      top_category: 'tithe',
    },
    {
      branch_id: 'b2',
      branch_name: 'Abuja Branch',
      total_amount: 267600,
      donor_count: 54,
      transaction_count: 38,
      average_donation: 7042,
      growth_percentage: 8.7,
      top_category: 'offering',
    },
    {
      branch_id: 'b3',
      branch_name: 'Accra Branch',
      total_amount: 90400,
      donor_count: 32,
      transaction_count: 13,
      average_donation: 6954,
      growth_percentage: 22.1,
      top_category: 'building_fund',
    },
  ],
  total_across_branches: 892000,
  currency: 'NGN',
};

// Mock Monthly Trend Report (Last 12 months)
export const mockMonthlyTrendReport: MonthlyTrendReport = {
  months: [
    {
      month: '2023-11',
      total_amount: 650000,
      transaction_count: 98,
      donor_count: 72,
      average_donation: 6633,
      growth_vs_previous: 5.2,
    },
    {
      month: '2023-12',
      total_amount: 920000,
      transaction_count: 156,
      donor_count: 98,
      average_donation: 5897,
      growth_vs_previous: 41.5,
    },
    {
      month: '2024-01',
      total_amount: 780000,
      transaction_count: 112,
      donor_count: 82,
      average_donation: 6964,
      growth_vs_previous: -15.2,
    },
    {
      month: '2024-02',
      total_amount: 720000,
      transaction_count: 105,
      donor_count: 78,
      average_donation: 6857,
      growth_vs_previous: -7.7,
    },
    {
      month: '2024-03',
      total_amount: 850000,
      transaction_count: 128,
      donor_count: 89,
      average_donation: 6641,
      growth_vs_previous: 18.1,
    },
    {
      month: '2024-04',
      total_amount: 790000,
      transaction_count: 118,
      donor_count: 85,
      average_donation: 6695,
      growth_vs_previous: -7.1,
    },
    {
      month: '2024-05',
      total_amount: 880000,
      transaction_count: 135,
      donor_count: 92,
      average_donation: 6519,
      growth_vs_previous: 11.4,
    },
    {
      month: '2024-06',
      total_amount: 820000,
      transaction_count: 122,
      donor_count: 87,
      average_donation: 6721,
      growth_vs_previous: -6.8,
    },
    {
      month: '2024-07',
      total_amount: 910000,
      transaction_count: 141,
      donor_count: 95,
      average_donation: 6454,
      growth_vs_previous: 11.0,
    },
    {
      month: '2024-08',
      total_amount: 865000,
      transaction_count: 132,
      donor_count: 91,
      average_donation: 6553,
      growth_vs_previous: -4.9,
    },
    {
      month: '2024-09',
      total_amount: 793000,
      transaction_count: 119,
      donor_count: 84,
      average_donation: 6664,
      growth_vs_previous: -8.3,
    },
    {
      month: '2024-10',
      total_amount: 892000,
      transaction_count: 127,
      donor_count: 89,
      average_donation: 7023,
      growth_vs_previous: 12.5,
    },
  ],
  overall_trend: 'increasing',
  average_monthly: 822500,
  currency: 'NGN',
};

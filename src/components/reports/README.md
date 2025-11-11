# Reports & Analytics Components

Comprehensive reporting system with PDF export, tax receipts, donor statements, and advanced analytics for the ChurchAfrica ChMS giving system.

## Components

### ReportsHub
Central dashboard for accessing all report types.

**Features:**
- 8+ report type cards with descriptions
- Quick stats overview
- Recent reports list
- Export format badges

**Props:**
```typescript
interface ReportsHubProps {
  onSelectReport: (reportId: string) => void;
}
```

### GivingReports
Comprehensive giving summary reports with advanced filtering.

**Features:**
- 4 summary KPI cards (total, donors, largest, period)
- Advanced filters (date range, branch, category, payment method)
- Daily trend bar chart (last 14 days)
- Category breakdown pie chart
- Top donors leaderboard
- Branch performance comparison
- Payment method distribution
- PDF, CSV, and Print export
- Print-optimized layout

**Props:**
```typescript
interface GivingReportsProps {
  report: GivingSummaryReport;
  onBack: () => void;
}
```

**Filters:**
- Date Range: Today, This Week, Last Week, This Month, Last Month, This Quarter, This Year, Last Year, All Time
- Branch: All Branches or specific branch
- Category: All Categories or specific category
- Payment Method: All Methods or specific method

### DonorStatements
Individual donor giving statements with transaction history.

**Features:**
- Donor search by name, email, phone
- Donor card grid view
- Statement period selection
- Donor information display
- 3 summary stats (total, count, tax deductible)
- Category breakdown pie chart
- Category amounts table
- Complete transaction history table
- Email delivery button
- PDF download
- Print-ready format

**Props:**
```typescript
interface DonorStatementsProps {
  donors: Donor[];
  onBack: () => void;
}
```

**Statement Includes:**
- Donor personal information
- Total contributions for period
- Transaction count
- Tax deductible amount
- Category-wise breakdown
- Full transaction list with receipt numbers
- Official disclaimer text

### TaxReceiptGenerator
Official tax receipt generator for annual donor contributions.

**Features:**
- Tax year selection (2020-2024+)
- Eligible donor grid view
- Official receipt format with organization details
- Donor information and tax ID
- Large featured total amount
- Detailed donation breakdown table
- Official declaration text
- Computer-generated disclaimer
- Print-ready professional layout
- Bulk actions (generate all, print all, export list)

**Props:**
```typescript
interface TaxReceiptGeneratorProps {
  donors: Donor[];
  onBack: () => void;
}
```

**Receipt Format:**
- Organization header with logo placeholder
- Receipt number and tax year
- Organization and donor details
- Featured total eligible amount
- Transaction table with categories
- Official declaration
- Important notes and instructions

## Data Types

### GivingSummaryReport
```typescript
interface GivingSummaryReport {
  period: DateRange;
  total_amount: number;
  transaction_count: number;
  donor_count: number;
  average_donation: number;
  largest_donation: number;
  smallest_donation: number;
  currency: Currency;
  by_category: Record<GivingCategory, { amount, count, percentage }>;
  by_payment_method: Record<PaymentMethod, { amount, count }>;
  by_branch: Record<string, { branch_name, amount, count, percentage }>;
  top_donors: { donor_id, donor_name, amount, donation_count }[];
  daily_breakdown: { date, amount, count }[];
}
```

### DonorStatement
```typescript
interface DonorStatement {
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
  donations: { date, amount, category, payment_method, receipt_number }[];
  by_category: Record<GivingCategory, number>;
  tax_deductible_total: number;
}
```

### TaxReceipt
```typescript
interface TaxReceipt {
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
  donations: { date, amount, category, receipt_number }[];
  notes?: string;
}
```

## Export Utilities

### formatCurrency(amount, currency)
Format numbers as currency with proper symbols and formatting.

### formatDate(date)
Format dates in long format (e.g., "October 24, 2024").

### formatDateShort(date)
Format dates in short format (e.g., "Oct 24, 2024").

### convertToCSV(data, headers?)
Convert array of objects to CSV string with proper escaping.

### downloadCSV(csv, filename)
Trigger browser download of CSV file.

### exportDonationsToCSV(donations, filename)
Export donations array to CSV with proper columns.

### exportGivingSummaryToCSV(report, filename)
Export summary report metrics to CSV.

### printReport()
Open browser print dialog for current report.

### generatePDF(elementId, filename)
Generate PDF using browser print (production: use jsPDF).

### generateDonorStatementHTML(statement)
Generate HTML string for donor statement printing.

### generateTaxReceiptHTML(receipt)
Generate HTML string for tax receipt printing.

### getDateRangePresets()
Get date range objects for common periods (today, this week, this month, etc.).

## Usage Examples

### Reports Hub
```tsx
import { ReportsHub } from './components/reports';

function ReportsPage() {
  const handleSelectReport = (reportId: string) => {
    console.log('Selected report:', reportId);
    // Navigate to specific report
  };

  return <ReportsHub onSelectReport={handleSelectReport} />;
}
```

### Giving Reports
```tsx
import { GivingReports } from './components/reports';
import { mockGivingSummaryReport } from './lib/mock-report-data';

function GivingSummaryPage() {
  return (
    <GivingReports
      report={mockGivingSummaryReport}
      onBack={() => console.log('Back to hub')}
    />
  );
}
```

### Donor Statements
```tsx
import { DonorStatements } from './components/reports';
import { mockDonors } from './lib/mock-giving-data';

function DonorStatementsPage() {
  return (
    <DonorStatements
      donors={mockDonors}
      onBack={() => console.log('Back to hub')}
    />
  );
}
```

### Tax Receipts
```tsx
import { TaxReceiptGenerator } from './components/reports';
import { mockDonors } from './lib/mock-giving-data';

function TaxReceiptsPage() {
  return (
    <TaxReceiptGenerator
      donors={mockDonors}
      onBack={() => console.log('Back to hub')}
    />
  );
}
```

## Vue/Quasar Migration

### Pinia Store
```typescript
// stores/reports.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const useReportsStore = defineStore('reports', () => {
  const currentReport = ref<GivingSummaryReport | null>(null);
  const loading = ref(false);

  const generateGivingSummary = async (filters: ReportFilters) => {
    loading.value = true;
    try {
      const response = await api.post('/api/reports/giving-summary', filters);
      currentReport.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  };

  const exportToPDF = (report: GivingSummaryReport) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Giving Summary Report', 14, 22);
    // Add content...
    doc.save(`giving-report-${report.period.start}.pdf`);
  };

  const exportToCSV = (data: any[], filename: string) => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return {
    currentReport,
    loading,
    generateGivingSummary,
    exportToPDF,
    exportToCSV,
  };
});
```

### Laravel API Endpoints
```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    // Reports
    Route::post('/reports/giving-summary', [ReportController::class, 'givingSummary']);
    Route::get('/reports/donor-statement/{donorId}', [ReportController::class, 'donorStatement']);
    Route::get('/reports/tax-receipt/{donorId}/{year}', [ReportController::class, 'taxReceipt']);
    Route::get('/reports/campaign-performance/{campaignId}', [ReportController::class, 'campaignPerformance']);
    Route::get('/reports/branch-comparison', [ReportController::class, 'branchComparison']);
    Route::get('/reports/monthly-trends', [ReportController::class, 'monthlyTrends']);
    
    // Bulk operations
    Route::post('/reports/bulk-tax-receipts', [ReportController::class, 'bulkTaxReceipts']);
    Route::post('/reports/bulk-donor-statements', [ReportController::class, 'bulkDonorStatements']);
});
```

### Quasar Components
```vue
<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Giving Summary Report</div>
        <div class="text-caption text-grey">
          {{ formatDate(report.period.start) }} - {{ formatDate(report.period.end) }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-3" v-for="stat in stats" :key="stat.label">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h4">{{ stat.value }}</div>
                <div class="text-caption text-grey">{{ stat.label }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Print"
          icon="print"
          @click="handlePrint"
        />
        <q-btn
          flat
          label="Export CSV"
          icon="table_view"
          @click="handleExportCSV"
        />
        <q-btn
          unelevated
          label="Download PDF"
          icon="picture_as_pdf"
          color="primary"
          @click="handleExportPDF"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useReportsStore } from '@/stores/reports';
import { onMounted } from 'vue';

const reportsStore = useReportsStore();

onMounted(async () => {
  await reportsStore.generateGivingSummary({
    dateRange: { start: '2024-10-01', end: '2024-10-31' }
  });
});

const handleExportPDF = () => {
  reportsStore.exportToPDF(reportsStore.currentReport);
};
</script>
```

## Print Styling

All reports include print-optimized CSS:

```css
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white;
    color: black;
  }
  
  .print-only {
    display: block !important;
  }
}
```

## Best Practices

1. **Always validate date ranges** before generating reports
2. **Cache report data** to avoid re-fetching
3. **Use proper currency formatting** based on organization settings
4. **Include organization branding** in official receipts
5. **Log all report generations** for audit trails
6. **Respect data privacy** settings (anonymous donors)
7. **Include disclaimers** on tax documents
8. **Use proper tax year** for receipts (not calendar year necessarily)
9. **Batch process** bulk operations to avoid timeout
10. **Compress PDF files** for email delivery

## Future Enhancements

- Real-time report scheduling
- Automated email delivery
- Custom report builder
- Advanced filtering UI
- Multi-year comparisons
- Projected giving trends
- Donor retention metrics
- Campaign ROI analysis
- Attendance correlation reports
- Member engagement scoring

## Testing

Test with various scenarios:
- Empty data sets
- Single transaction
- Large data sets (1000+ donations)
- Multiple currencies
- Anonymous donations
- Date range edge cases
- Leap year handling
- Timezone considerations

/**
 * ChurchAfrica ChMS - Export Utilities
 * PDF and CSV export helpers for reports
 */

import type { Donation } from '../types/giving';
import type { GivingSummaryReport, DonorStatement, TaxReceipt } from '../types/reports';

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date short
 */
export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Convert array of objects to CSV
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) return '';

  const keys = headers || Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(keys.join(','));

  // Add data rows
  for (const row of data) {
    const values = keys.map(key => {
      const value = row[key];
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export donations to CSV
 */
export function exportDonationsToCSV(donations: Donation[], filename: string = 'donations.csv'): void {
  const data = donations.map(d => ({
    Date: formatDateShort(d.created_at),
    'Receipt Number': d.receipt_number,
    'Donor Name': d.anonymous ? 'Anonymous' : d.donor_name,
    Amount: d.amount,
    Currency: d.currency,
    Category: d.category,
    'Payment Method': d.payment_method,
    Status: d.status,
    Branch: d.branch_id,
  }));

  const csv = convertToCSV(data);
  downloadCSV(csv, filename);
}

/**
 * Export giving summary to CSV
 */
export function exportGivingSummaryToCSV(report: GivingSummaryReport, filename: string = 'giving-summary.csv'): void {
  const summaryData = [
    { Metric: 'Total Amount', Value: report.total_amount },
    { Metric: 'Transaction Count', Value: report.transaction_count },
    { Metric: 'Donor Count', Value: report.donor_count },
    { Metric: 'Average Donation', Value: report.average_donation },
    { Metric: 'Largest Donation', Value: report.largest_donation },
    { Metric: 'Smallest Donation', Value: report.smallest_donation },
  ];

  const csv = convertToCSV(summaryData);
  downloadCSV(csv, filename);
}

/**
 * Print report (opens print dialog)
 */
export function printReport(): void {
  window.print();
}

/**
 * Generate simple PDF using browser print
 * Note: For production, use jsPDF or similar library
 */
export function generatePDF(elementId: string, filename: string = 'report.pdf'): void {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF generation');
    return;
  }

  // Use browser's print-to-PDF functionality
  // In production, integrate jsPDF or puppeteer for server-side PDF generation
  const printWindow = window.open('', '', 'height=800,width=800');
  if (!printWindow) return;

  printWindow.document.write('<html><head><title>' + filename + '</title>');
  printWindow.document.write('<style>');
  printWindow.document.write(`
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px;
      color: #000;
      background: #fff;
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px 0;
    }
    th, td { 
      border: 1px solid #ddd; 
      padding: 8px; 
      text-align: left;
    }
    th { 
      background-color: #f2f2f2; 
      font-weight: bold;
    }
    .header {
      margin-bottom: 30px;
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    .stat-card {
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 5px;
    }
    @media print {
      .no-print { display: none; }
    }
  `);
  printWindow.document.write('</style></head><body>');
  printWindow.document.write(element.innerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 250);
}

/**
 * Generate donor statement HTML for print/PDF
 */
export function generateDonorStatementHTML(statement: DonorStatement): string {
  return `
    <div class="donor-statement">
      <div class="header">
        <h1>Donor Giving Statement</h1>
        <p><strong>Period:</strong> ${formatDate(statement.statement_period.start)} - ${formatDate(statement.statement_period.end)}</p>
        <p><strong>Generated:</strong> ${formatDate(statement.generated_at)}</p>
      </div>

      <div class="donor-info">
        <h2>Donor Information</h2>
        <p><strong>Name:</strong> ${statement.donor_name}</p>
        ${statement.donor_email ? `<p><strong>Email:</strong> ${statement.donor_email}</p>` : ''}
        ${statement.donor_phone ? `<p><strong>Phone:</strong> ${statement.donor_phone}</p>` : ''}
        ${statement.donor_address ? `<p><strong>Address:</strong> ${statement.donor_address}</p>` : ''}
      </div>

      <div class="summary">
        <h2>Summary</h2>
        <p><strong>Total Amount:</strong> ${formatCurrency(statement.total_amount, statement.currency)}</p>
        <p><strong>Total Transactions:</strong> ${statement.transaction_count}</p>
        <p><strong>Tax Deductible Total:</strong> ${formatCurrency(statement.tax_deductible_total, statement.currency)}</p>
      </div>

      <div class="transactions">
        <h2>Transaction Details</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Receipt Number</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            ${statement.donations.map(d => `
              <tr>
                <td>${formatDateShort(d.date)}</td>
                <td>${d.receipt_number}</td>
                <td>${d.category}</td>
                <td>${formatCurrency(d.amount, statement.currency)}</td>
                <td>${d.payment_method}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd;">
          This statement is for informational purposes only. Please consult with your tax advisor regarding deductibility.
        </p>
      </div>
    </div>
  `;
}

/**
 * Generate tax receipt HTML for print/PDF
 */
export function generateTaxReceiptHTML(receipt: TaxReceipt): string {
  return `
    <div class="tax-receipt">
      <div class="header">
        <h1>Official Tax Receipt</h1>
        <p><strong>Receipt Number:</strong> ${receipt.receipt_number}</p>
        <p><strong>Tax Year:</strong> ${receipt.tax_year}</p>
        <p><strong>Date Issued:</strong> ${formatDate(receipt.generated_at)}</p>
      </div>

      <div class="organization-info">
        <h2>${receipt.organization_name}</h2>
        ${receipt.organization_address ? `<p>${receipt.organization_address}</p>` : ''}
        ${receipt.organization_tax_id ? `<p><strong>Tax ID:</strong> ${receipt.organization_tax_id}</p>` : ''}
      </div>

      <div class="donor-info">
        <h2>Issued To</h2>
        <p><strong>${receipt.donor_name}</strong></p>
        ${receipt.donor_address ? `<p>${receipt.donor_address}</p>` : ''}
        ${receipt.donor_tax_id ? `<p><strong>Tax ID:</strong> ${receipt.donor_tax_id}</p>` : ''}
      </div>

      <div class="summary">
        <h2 style="margin-top: 30px;">Total Eligible Amount</h2>
        <p style="font-size: 24px; font-weight: bold; color: #1CE479;">
          ${formatCurrency(receipt.total_amount, receipt.currency)}
        </p>
        <p>Based on ${receipt.donation_count} donation(s) made during ${receipt.tax_year}</p>
      </div>

      <div class="transactions">
        <h2>Donation Details</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Receipt Number</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${receipt.donations.map(d => `
              <tr>
                <td>${formatDateShort(d.date)}</td>
                <td>${d.receipt_number}</td>
                <td>${d.category}</td>
                <td>${formatCurrency(d.amount, receipt.currency)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      ${receipt.notes ? `
        <div class="notes">
          <h3>Notes</h3>
          <p>${receipt.notes}</p>
        </div>
      ` : ''}

      <div class="footer">
        <p style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #000;">
          <strong>Official Receipt for Income Tax Purposes</strong><br>
          This receipt acknowledges that no goods or services were provided in exchange for this donation.<br>
          Please retain this receipt for your tax records.
        </p>
      </div>
    </div>
  `;
}

/**
 * Helper to calculate date ranges
 */
export function getDateRangePresets() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return {
    today: {
      start: today.toISOString(),
      end: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    },
    this_week: {
      start: new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date(today.getTime() + (7 - today.getDay()) * 24 * 60 * 60 * 1000).toISOString(),
    },
    this_month: {
      start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
    },
    last_month: {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
      end: new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString(),
    },
    this_quarter: {
      start: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString(),
      end: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0, 23, 59, 59).toISOString(),
    },
    this_year: {
      start: new Date(now.getFullYear(), 0, 1).toISOString(),
      end: new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString(),
    },
    last_year: {
      start: new Date(now.getFullYear() - 1, 0, 1).toISOString(),
      end: new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59).toISOString(),
    },
  };
}

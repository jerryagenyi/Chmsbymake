/**
 * ChurchAfrica ChMS - Tax Receipt Generator
 * Generate official tax receipts for donors
 */

import React, { useState } from 'react';
import {
  Download,
  Printer,
  Receipt,
  Check,
  Calendar,
  Building2,
  User,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { TaxReceipt } from '../../types/reports';
import type { Donor } from '../../types/giving';
import { formatCurrency, formatDate } from '../../lib/export-utils';

interface TaxReceiptGeneratorProps {
  donors: Donor[];
  onBack: () => void;
}

export function TaxReceiptGenerator({ donors, onBack }: TaxReceiptGeneratorProps) {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  // Mock receipt data (in production, fetch from API)
  const mockReceipt: TaxReceipt = {
    receipt_id: 'tr2024001',
    receipt_number: `TAX-${selectedYear}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    donor_id: selectedDonor?.id || '',
    donor_name: selectedDonor?.name || '',
    donor_address: selectedDonor?.address,
    donor_tax_id: selectedDonor?.tax_id,
    organization_name: 'Victory Chapel',
    organization_address: 'Kubwa, Abuja, Nigeria',
    organization_tax_id: 'TIN-NG-VC-2024',
    tax_year: parseInt(selectedYear),
    total_amount: selectedDonor?.total_giving_ytd || 0,
    currency: 'NGN',
    donation_count: selectedDonor?.donation_count || 0,
    generated_at: new Date().toISOString(),
    generated_by: 'admin',
    donations: [
      {
        date: `${selectedYear}-10-24`,
        amount: 5000,
        category: 'Tithe',
        receipt_number: 'RCT-2024-001234',
      },
      {
        date: `${selectedYear}-10-17`,
        amount: 3000,
        category: 'Offering',
        receipt_number: 'RCT-2024-001210',
      },
      {
        date: `${selectedYear}-10-10`,
        amount: 2500,
        category: 'Building Fund',
        receipt_number: 'RCT-2024-001185',
      },
    ],
    notes: 'Thank you for your faithful giving. May God bless you abundantly.',
  };

  const handleGenerateReceipt = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download - In production, this would generate an official tax receipt PDF');
  };

  const years = ['2024', '2023', '2022', '2021', '2020'];

  if (showReceipt && selectedDonor) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto" id="tax-receipt">
        {/* Actions */}
        <div className="flex items-center justify-between no-print">
          <Button variant="ghost" onClick={() => setShowReceipt(false)}>
            ← Back to Donor List
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button onClick={handleDownloadPDF} className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Official Tax Receipt */}
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-8 pb-8 px-8">
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-primary/20">
              <div className="mb-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{mockReceipt.organization_name}</h1>
              <p className="text-sm text-muted-foreground mb-1">{mockReceipt.organization_address}</p>
              <p className="text-sm text-muted-foreground">Tax ID: {mockReceipt.organization_tax_id}</p>
            </div>

            {/* Receipt Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                <Receipt className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">Official Tax Receipt</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Receipt for Income Tax Purposes</h2>
              <p className="text-lg font-mono text-muted-foreground">{mockReceipt.receipt_number}</p>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Issued To:</p>
                <div className="p-4 bg-[#1A1A20] rounded-lg">
                  <p className="font-semibold mb-2">{mockReceipt.donor_name}</p>
                  {mockReceipt.donor_address && (
                    <p className="text-sm text-muted-foreground mb-1">{mockReceipt.donor_address}</p>
                  )}
                  {mockReceipt.donor_tax_id && (
                    <p className="text-sm text-muted-foreground">Tax ID: {mockReceipt.donor_tax_id}</p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Receipt Information:</p>
                <div className="p-4 bg-[#1A1A20] rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tax Year:</span>
                    <span className="text-sm font-medium">{mockReceipt.tax_year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Date Issued:</span>
                    <span className="text-sm font-medium">{formatDate(mockReceipt.generated_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Donations:</span>
                    <span className="text-sm font-medium">{mockReceipt.donation_count}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount - Featured */}
            <div className="mb-8 p-6 bg-primary/5 border-2 border-primary/20 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Total Eligible Amount for Tax Deduction</p>
              <p className="text-5xl font-bold text-primary mb-2">
                {formatCurrency(mockReceipt.total_amount, mockReceipt.currency)}
              </p>
              <p className="text-sm text-muted-foreground">
                Based on {mockReceipt.donation_count} eligible donation(s) made during {mockReceipt.tax_year}
              </p>
            </div>

            {/* Donation Details Table */}
            <div className="mb-8">
              <h3 className="font-semibold mb-4">Donation Details</h3>
              <div className="border border-[#1A1A20] rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#1A1A20]">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm">Date</th>
                      <th className="text-left py-3 px-4 text-sm">Receipt Number</th>
                      <th className="text-left py-3 px-4 text-sm">Category</th>
                      <th className="text-right py-3 px-4 text-sm">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReceipt.donations.map((donation, index) => (
                      <tr key={index} className="border-t border-[#1A1A20]">
                        <td className="py-3 px-4 text-sm">{formatDate(donation.date)}</td>
                        <td className="py-3 px-4 text-sm font-mono text-xs">{donation.receipt_number}</td>
                        <td className="py-3 px-4 text-sm">{donation.category}</td>
                        <td className="py-3 px-4 text-sm text-right">
                          {formatCurrency(donation.amount, mockReceipt.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#1A1A20] border-t-2 border-primary">
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-sm font-semibold">Total</td>
                      <td className="py-3 px-4 text-sm text-right font-bold">
                        {formatCurrency(mockReceipt.total_amount, mockReceipt.currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Declaration */}
            <div className="mb-8 p-6 bg-[#1A1A20] rounded-lg">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Official Declaration</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is to certify that {mockReceipt.organization_name} received the above donation(s) 
                    from {mockReceipt.donor_name}. No goods or services were provided in exchange for these contributions. 
                    This receipt is issued for income tax purposes only and should be retained for your records.
                  </p>
                </div>
              </div>
              {mockReceipt.notes && (
                <div className="pt-4 border-t border-muted-foreground/20">
                  <p className="text-sm italic text-muted-foreground">{mockReceipt.notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-6 border-t-2 border-primary/20 text-center">
              <p className="text-xs text-muted-foreground mb-2">
                This receipt was computer-generated and is valid without signature.
              </p>
              <p className="text-xs text-muted-foreground">
                Generated on {formatDate(mockReceipt.generated_at)} | Receipt ID: {mockReceipt.receipt_id}
              </p>
              <div className="mt-4 pt-4 border-t border-muted-foreground/20">
                <p className="text-xs text-muted-foreground">
                  For questions about this receipt, please contact our finance department.<br />
                  {mockReceipt.organization_name} is a registered religious organization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Print Instructions */}
        <Card className="no-print bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2 text-blue-400">Important Information</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>This official tax receipt should be retained for your tax records</li>
                  <li>Please consult with your tax advisor regarding deductibility in your jurisdiction</li>
                  <li>For corrections or reissuance, contact the finance department</li>
                  <li>This receipt is valid for tax year {mockReceipt.tax_year}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-2">
            ← Back to Reports
          </Button>
          <h1 className="text-2xl mb-1">Tax Receipt Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate official tax receipts for donors
          </p>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>Tax Year {year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="mb-1">Official Tax Receipts</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Generate official tax receipts for donors who have made eligible contributions during the selected tax year. 
                These receipts comply with tax authority requirements and include all necessary information for tax filing.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">PDF Download</Badge>
                <Badge variant="outline">Print Ready</Badge>
                <Badge variant="outline">Email Delivery</Badge>
                <Badge variant="outline">Official Format</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eligible Donors */}
      <Card>
        <CardHeader>
          <CardTitle>Eligible Donors for {selectedYear}</CardTitle>
          <CardDescription>
            Donors who made tax-deductible contributions during {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donors.filter(d => d.total_giving_ytd > 0).map((donor) => (
              <div
                key={donor.id}
                className="p-4 bg-[#1A1A20] rounded-lg hover:bg-[#1A1A20]/70 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium mb-1">{donor.name}</p>
                    <p className="text-xs text-muted-foreground">{donor.email}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {donor.donation_count} gifts
                  </Badge>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground mb-1">Eligible Amount</p>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(donor.total_giving_ytd, 'NGN')}
                  </p>
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="sm"
                  onClick={() => handleGenerateReceipt(donor)}
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate Receipt
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>Generate receipts for multiple donors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Generate All Receipts (PDF)
            </Button>
            <Button variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print All Receipts
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="h-4 w-4 mr-2" />
              Export Receipt List (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
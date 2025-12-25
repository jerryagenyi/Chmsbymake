/**
 * ChurchAfrica ChMS - Donor Statements
 * Generate individual donor giving statements
 */

import React, { useState } from 'react';
import {
  Download,
  Printer,
  Mail,
  Search,
  FileText,
  Calendar,
  DollarSign,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { DonorStatement, DateRangePreset } from '../../types/reports';
import type { Donor } from '../../types/giving';
import { formatCurrency, formatDate } from '../../lib/export-utils';

interface DonorStatementsProps {
  donors: Donor[];
  onBack: () => void;
}

const COLORS = ['#1CE479', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

export function DonorStatements({ donors, onBack }: DonorStatementsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [dateRange, setDateRange] = useState<DateRangePreset>('this_year');
  const [showStatement, setShowStatement] = useState(false);

  // Filter donors
  const filteredDonors = donors.filter(donor =>
    donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donor.phone?.includes(searchQuery)
  );

  // Mock statement data (in production, fetch from API)
  const mockStatement: DonorStatement = {
    donor_id: selectedDonor?.id || '',
    donor_name: selectedDonor?.name || '',
    donor_email: selectedDonor?.email,
    donor_phone: selectedDonor?.phone,
    donor_address: selectedDonor?.address,
    statement_period: {
      start: '2024-01-01',
      end: '2024-12-31',
      preset: 'this_year',
    },
    generated_at: new Date().toISOString(),
    total_amount: selectedDonor?.total_giving_ytd || 0,
    transaction_count: selectedDonor?.donation_count || 0,
    currency: 'NGN',
    donations: [
      {
        date: '2024-10-24',
        amount: 5000,
        category: 'tithe',
        payment_method: 'mobile_money',
        receipt_number: 'RCT-2024-001234',
      },
      {
        date: '2024-10-17',
        amount: 3000,
        category: 'offering',
        payment_method: 'cash',
        receipt_number: 'RCT-2024-001210',
      },
      {
        date: '2024-10-10',
        amount: 2500,
        category: 'building_fund',
        payment_method: 'mobile_money',
        receipt_number: 'RCT-2024-001185',
        campaign_name: 'New Church Building',
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
    tax_deductible_total: selectedDonor?.total_giving_ytd || 0,
  };

  // Prepare category chart data
  const categoryChartData = Object.entries(mockStatement.by_category)
    .filter(([_, amount]) => amount > 0)
    .map(([name, amount]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: amount,
    }));

  const handleGenerateStatement = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowStatement(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download - In production, this would generate a PDF using jsPDF');
  };

  const handleEmailStatement = () => {
    alert(`Email statement to ${selectedDonor?.email || 'donor'}`);
  };

  if (showStatement && selectedDonor) {
    return (
      <div className="space-y-6" id="donor-statement">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
          <div>
            <Button variant="ghost" onClick={() => setShowStatement(false)} className="mb-2 -ml-2">
              ← Back to Donor List
            </Button>
            <h1 className="text-2xl mb-1">Donor Giving Statement</h1>
            <p className="text-sm text-muted-foreground">
              {selectedDonor.name} - {formatDate(mockStatement.statement_period.start)} to {formatDate(mockStatement.statement_period.end)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            {selectedDonor.email && (
              <Button variant="outline" onClick={handleEmailStatement}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            )}
            <Button onClick={handleDownloadPDF} className="bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Statement Header (Print) */}
        <Card className="print-only" style={{ display: 'none' }}>
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Victory Chapel</h1>
              <p className="text-sm text-muted-foreground">Annual Donor Giving Statement</p>
            </div>
          </CardContent>
        </Card>

        {/* Donor Info */}
        <Card>
          <CardHeader>
            <CardTitle>Donor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{selectedDonor.name}</p>
              </div>
              {selectedDonor.email && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{selectedDonor.email}</p>
                </div>
              )}
              {selectedDonor.phone && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{selectedDonor.phone}</p>
                </div>
              )}
              {selectedDonor.address && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Address</p>
                  <p className="font-medium">{selectedDonor.address}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl mb-1">{formatCurrency(mockStatement.total_amount, mockStatement.currency)}</h3>
              <p className="text-sm text-muted-foreground">Total Contributions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-blue-400/10">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl mb-1">{mockStatement.transaction_count}</h3>
              <p className="text-sm text-muted-foreground">Total Donations</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-green-400/10">
                  <Calendar className="h-5 w-5 text-green-400" />
                </div>
              </div>
              <h3 className="text-2xl mb-1">{formatCurrency(mockStatement.tax_deductible_total, mockStatement.currency)}</h3>
              <p className="text-sm text-muted-foreground">Tax Deductible</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Giving by Category</CardTitle>
              <CardDescription>Distribution across giving categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatCurrency(value, mockStatement.currency)}`}
                    labelLine={false}
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1A1A20',
                      border: '1px solid #2A2A30',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value, mockStatement.currency)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Detailed amounts by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryChartData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#1A1A20] rounded-lg">
                    <span className="text-sm">{category.name}</span>
                    <span className="text-sm font-medium">{formatCurrency(category.value, mockStatement.currency)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All donations during this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1A1A20]">
                    <th className="text-left py-3 px-2 text-sm">Date</th>
                    <th className="text-left py-3 px-2 text-sm">Receipt #</th>
                    <th className="text-left py-3 px-2 text-sm">Category</th>
                    <th className="text-left py-3 px-2 text-sm">Payment</th>
                    <th className="text-right py-3 px-2 text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {mockStatement.donations.map((donation, index) => (
                    <tr key={index} className="border-b border-[#1A1A20] hover:bg-[#1A1A20]/50">
                      <td className="py-3 px-2 text-sm">{formatDate(donation.date)}</td>
                      <td className="py-3 px-2 text-sm font-mono text-xs">{donation.receipt_number}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-xs">
                          {donation.category.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm">{donation.payment_method.replace(/_/g, ' ')}</td>
                      <td className="py-3 px-2 text-sm text-right font-medium">
                        {formatCurrency(donation.amount, mockStatement.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-primary">
                    <td colSpan={4} className="py-3 px-2 text-sm font-medium">Total</td>
                    <td className="py-3 px-2 text-sm text-right font-bold">
                      {formatCurrency(mockStatement.total_amount, mockStatement.currency)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This statement is for your records. All donations were made to Victory Chapel Ministry, 
              a registered religious organisation. Please consult with your tax adviser regarding the deductibility of these contributions.
              For questions about this statement, please contact our finance department.
            </p>
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
          <h1 className="text-2xl mb-1">Donor Statements</h1>
          <p className="text-sm text-muted-foreground">
            Generate individual giving statements for donors
          </p>
        </div>
        <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRangePreset)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_month">This Month</SelectItem>
            <SelectItem value="this_quarter">This Quarter</SelectItem>
            <SelectItem value="this_year">This Year</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search donors by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Donor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonors.map((donor) => (
          <Card
            key={donor.id}
            className="hover:border-primary/40 transition-colors cursor-pointer"
            onClick={() => handleGenerateStatement(donor)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{donor.name}</CardTitle>
              {donor.email && (
                <CardDescription className="text-xs">{donor.email}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">YTD Giving</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(donor.total_giving_ytd, 'NGN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Donations</span>
                  <span className="text-sm">{donor.donation_count}</span>
                </div>
                <Button
                  className="w-full mt-3 bg-primary hover:bg-primary/90"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateStatement(donor);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Statement
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDonors.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">No Donors Found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'No donors available'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
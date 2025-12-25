/**
 * ChurchAfrica ChMS - Donation Recording Form
 * Africa-First donation entry with mobile money and offline support
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  User, 
  Smartphone, 
  Banknote, 
  CreditCard,
  Save,
  X,
  WifiOff,
  Receipt,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import type { 
  Donation, 
  Donor, 
  GivingCategory, 
  PaymentMethod,
  MobileMoneyProvider,
  Currency,
} from '../../types/giving';

interface DonationFormProps {
  donors: Donor[];
  onSubmit: (donation: Partial<Donation>) => void;
  onCancel: () => void;
  isOffline?: boolean;
}

export function DonationForm({ donors, onSubmit, onCancel, isOffline = false }: DonationFormProps) {
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<GivingCategory>('offering');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<MobileMoneyProvider>('m_pesa');
  const [transactionRef, setTransactionRef] = useState('');
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [notes, setNotes] = useState('');
  const [donorSearch, setDonorSearch] = useState('');

  // Filter donors based on search
  const filteredDonors = donors.filter(donor =>
    donor.name.toLowerCase().includes(donorSearch.toLowerCase()) ||
    donor.phone?.includes(donorSearch) ||
    donor.email?.toLowerCase().includes(donorSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const donation: Partial<Donation> = {
      donor_id: selectedDonor?.id || 'guest',
      donor_name: isAnonymous ? 'Anonymous' : (selectedDonor?.name || 'Guest Donor'),
      member_id: selectedDonor?.member_id,
      amount: parseFloat(amount),
      currency,
      category,
      payment_method: paymentMethod,
      ...(paymentMethod === 'mobile_money' && { mobile_money_provider: mobileMoneyProvider }),
      ...(transactionRef && { transaction_reference: transactionRef }),
      notes,
      anonymous: isAnonymous,
      tax_deductible: true,
      status: isOffline ? 'offline_pending_sync' : 'completed',
      synced_to_server: !isOffline,
      recorded_at: new Date().toISOString(),
    };

    onSubmit(donation);
  };

  const givingCategories: { value: GivingCategory; label: string; emoji: string }[] = [
    { value: 'tithe', label: 'Tithe (10%)', emoji: '💰' },
    { value: 'offering', label: 'Offering', emoji: '🙏' },
    { value: 'special_offering', label: 'Special Offering', emoji: '✨' },
    { value: 'building_fund', label: 'Building Fund', emoji: '🏗️' },
    { value: 'missions', label: 'Missions', emoji: '🌍' },
    { value: 'special_project', label: 'Special Project', emoji: '🎯' },
    { value: 'first_fruit', label: 'First Fruit', emoji: '🌾' },
    { value: 'thanksgiving', label: 'Thanksgiving', emoji: '🎉' },
    { value: 'seed_offering', label: 'Seed Offering', emoji: '🌱' },
    { value: 'pledge', label: 'Pledge Payment', emoji: '📝' },
    { value: 'other', label: 'Other', emoji: '📌' },
  ];

  const paymentMethods: { value: PaymentMethod; label: string; icon: any }[] = [
    { value: 'cash', label: 'Cash', icon: Banknote },
    { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard },
    { value: 'card', label: 'Card', icon: CreditCard },
    { value: 'check', label: 'Check', icon: Receipt },
    { value: 'online', label: 'Online', icon: Smartphone },
  ];

  const mobileMoneyProviders: { value: MobileMoneyProvider; label: string }[] = [
    { value: 'm_pesa', label: 'M-Pesa (Kenya/Tanzania)' },
    { value: 'mtn_mobile_money', label: 'MTN Mobile Money' },
    { value: 'airtel_money', label: 'Airtel Money' },
    { value: 'orange_money', label: 'Orange Money' },
    { value: 'tigopesa', label: 'TigoPesa' },
    { value: 'vodacom_mpesa', label: 'Vodacom M-Pesa' },
  ];

  const currencies: { value: Currency; label: string; symbol: string }[] = [
    { value: 'NGN', label: 'Nigerian Naira', symbol: '₦' },
    { value: 'GHS', label: 'Ghanaian Cedi', symbol: '₵' },
    { value: 'KES', label: 'Kenyan Shilling', symbol: 'KSh' },
    { value: 'ZAR', label: 'South African Rand', symbol: 'R' },
    { value: 'UGX', label: 'Ugandan Shilling', symbol: 'USh' },
    { value: 'TZS', label: 'Tanzanian Shilling', symbol: 'TSh' },
    { value: 'USD', label: 'US Dollar', symbol: '$' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Record Donation</CardTitle>
              <CardDescription>
                Enter donation details for immediate or offline recording
              </CardDescription>
            </div>
            {isOffline && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <WifiOff className="h-3 w-3" />
                Offline Mode
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Offline Alert */}
          {isOffline && (
            <Alert>
              <WifiOff className="h-4 w-4" />
              <AlertDescription>
                You're offline. This donation will be saved locally and synced when connection is restored.
              </AlertDescription>
            </Alert>
          )}

          {/* Anonymous Toggle */}
          <div className="flex items-center justify-between p-4 bg-[#1A1A20] rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="anonymous" className="cursor-pointer">
                Anonymous Donation
              </Label>
            </div>
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>

          {/* Donor Selection */}
          {!isAnonymous && (
            <div className="space-y-2">
              <Label>Select Donor</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search donors by name, phone, or email..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {donorSearch && (
                <div className="max-h-40 overflow-y-auto border border-[#1A1A20] rounded-lg">
                  {filteredDonors.slice(0, 5).map((donor) => (
                    <button
                      key={donor.id}
                      type="button"
                      onClick={() => {
                        setSelectedDonor(donor);
                        setDonorSearch(donor.name);
                      }}
                      className="w-full p-3 text-left hover:bg-[#1A1A20] transition-colors border-b border-[#1A1A20] last:border-0"
                    >
                      <p className="text-sm mb-1">{donor.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {donor.phone && <span>{donor.phone}</span>}
                        {donor.email && <span>{donor.email}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {selectedDonor && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm mb-1">Selected: <strong>{selectedDonor.name}</strong></p>
                  <p className="text-xs text-muted-foreground">
                    Total YTD: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'NGN' }).format(selectedDonor.total_giving_ytd)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Amount & Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.symbol} {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as GivingCategory)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {givingCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paymentMethod === method.value
                        ? 'border-primary bg-primary/10'
                        : 'border-[#1A1A20] hover:border-primary/40'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mx-auto mb-1 ${
                      paymentMethod === method.value ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <p className="text-xs text-center">{method.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Money Provider */}
          {paymentMethod === 'mobile_money' && (
            <div className="space-y-2">
              <Label htmlFor="mobile-money-provider">Mobile Money Provider *</Label>
              <Select 
                value={mobileMoneyProvider} 
                onValueChange={(v) => setMobileMoneyProvider(v as MobileMoneyProvider)}
              >
                <SelectTrigger id="mobile-money-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mobileMoneyProviders.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Transaction Reference */}
          {(paymentMethod === 'mobile_money' || paymentMethod === 'bank_transfer') && (
            <div className="space-y-2">
              <Label htmlFor="transaction-ref">
                Transaction Reference {paymentMethod === 'mobile_money' && '(Optional)'}
              </Label>
              <Input
                id="transaction-ref"
                placeholder="e.g., MPESA2024102412345"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional information about this donation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1A1A20]">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4 mr-2" />
              {isOffline ? 'Save Offline' : 'Record Donation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

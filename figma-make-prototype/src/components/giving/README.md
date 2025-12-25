# Giving & Donations Components

Africa-First giving management system with mobile money support, offline-first recording, and comprehensive fundraising campaign tracking.

## Components

### GivingDashboard
Main dashboard displaying KPIs, trends, and recent transactions.

**Features:**
- Real-time giving statistics (today, week, month, year)
- Donor metrics (total, active, average donation)
- Giving trend charts (30-day line chart)
- Category breakdown (pie chart)
- Payment method distribution
- Recent transaction feed

**Props:**
```typescript
interface GivingDashboardProps {
  stats: GivingStats;
  trends: GivingTrend[];
  recentDonations: Donation[];
  onRecordDonation: () => void;
  onViewReports: () => void;
}
```

### DonationForm
Comprehensive donation recording form with African payment methods.

**Features:**
- Anonymous donation toggle
- Donor search and selection
- Multi-currency support (NGN, GHS, KES, ZAR, USD, etc.)
- 11 giving categories (tithe, offering, building fund, missions, etc.)
- 6 payment methods (cash, mobile money, bank transfer, card, check, online)
- 6 mobile money providers (M-Pesa, MTN, Airtel, Orange, TigoPesa, Vodacom)
- Transaction reference tracking
- Offline mode with pending sync indicator
- Tax deductible flag

**Props:**
```typescript
interface DonationFormProps {
  donors: Donor[];
  onSubmit: (donation: Partial<Donation>) => void;
  onCancel: () => void;
  isOffline?: boolean;
}
```

### CampaignManager
Fundraising campaign and special project management.

**Features:**
- Active and completed campaign views
- Progress tracking with visual indicators
- Donor count and goal metrics
- Days remaining countdown
- Campaign CRUD operations
- Campaign status badges (active, completed, cancelled)

**Props:**
```typescript
interface CampaignManagerProps {
  campaigns: Campaign[];
  onCreateCampaign: () => void;
  onEditCampaign: (campaign: Campaign) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onViewDetails: (campaign: Campaign) => void;
}
```

## Data Types

### Donation
```typescript
interface Donation {
  id: string;
  donor_id: string;
  donor_name: string;
  member_id?: string;
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
```

### Donor
```typescript
interface Donor {
  id: string;
  member_id?: string;
  name: string;
  email?: string;
  phone?: string;
  is_anonymous: boolean;
  organization_id: string;
  total_giving: number;
  total_giving_ytd: number;
  donation_count: number;
  preferred_payment_method?: PaymentMethod;
}
```

### Campaign
```typescript
interface Campaign {
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
  donor_count: number;
}
```

## Africa-First Features

### Mobile Money Integration
- **6 Major Providers**: M-Pesa, MTN Mobile Money, Airtel Money, Orange Money, TigoPesa, Vodacom M-Pesa
- **Transaction References**: Track mobile money transaction IDs
- **Provider Icons**: Visual identification of payment methods

### Multi-Currency Support
Supports 7 African and international currencies:
- 🇳🇬 Nigerian Naira (NGN)
- 🇬🇭 Ghanaian Cedi (GHS)
- 🇰🇪 Kenyan Shilling (KES)
- 🇿🇦 South African Rand (ZAR)
- 🇺🇬 Ugandan Shilling (UGX)
- 🇹🇿 Tanzanian Shilling (TZS)
- 🇺🇸 US Dollar (USD)

### Offline-First Recording
- **Local Storage**: Save donations when offline
- **Sync Indicator**: Visual badge for pending sync
- **Status Tracking**: `offline_pending_sync` status
- **Auto-sync**: Background sync when connection restored

### Cash-First Workflow
- **Cash as Default**: Most common payment method in African churches
- **Quick Entry**: Streamlined cash recording
- **Bulk Offerings**: Support for collection basket recordings

## Giving Categories

11 categories aligned with African church practices:

1. **Tithe (10%)** 💰 - Regular tithing
2. **Offering** 🙏 - General offerings
3. **Special Offering** ✨ - Special occasions
4. **Building Fund** 🏗️ - Construction projects
5. **Missions** 🌍 - Missionary work
6. **Special Project** 🎯 - Specific initiatives
7. **First Fruit** 🌾 - First fruit offerings
8. **Thanksgiving** 🎉 - Gratitude offerings
9. **Seed Offering** 🌱 - Faith seed planting
10. **Pledge** 📝 - Pledge payments
11. **Other** 📌 - Miscellaneous

## Usage Example

```tsx
import { GivingDashboard, DonationForm, CampaignManager } from './components/giving';
import { mockGivingStats, mockGivingTrends, mockDonations } from './lib/mock-giving-data';

function GivingPage() {
  const [showDonationForm, setShowDonationForm] = useState(false);
  
  const handleRecordDonation = (donation: Partial<Donation>) => {
    // Save to backend
    console.log('Recording donation:', donation);
    setShowDonationForm(false);
  };

  return (
    <div>
      {showDonationForm ? (
        <DonationForm
          donors={mockDonors}
          onSubmit={handleRecordDonation}
          onCancel={() => setShowDonationForm(false)}
          isOffline={!navigator.onLine}
        />
      ) : (
        <GivingDashboard
          stats={mockGivingStats}
          trends={mockGivingTrends}
          recentDonations={mockDonations}
          onRecordDonation={() => setShowDonationForm(true)}
          onViewReports={() => console.log('View reports')}
        />
      )}
      
      <CampaignManager
        campaigns={mockCampaigns}
        onCreateCampaign={() => console.log('Create campaign')}
        onEditCampaign={(c) => console.log('Edit:', c)}
        onDeleteCampaign={(id) => console.log('Delete:', id)}
        onViewDetails={(c) => console.log('View:', c)}
      />
    </div>
  );
}
```

## Vue/Quasar Migration Notes

### Pinia Store Structure
```typescript
// stores/giving.ts
export const useGivingStore = defineStore('giving', () => {
  const donations = ref<Donation[]>([]);
  const donors = ref<Donor[]>([]);
  const campaigns = ref<Campaign[]>([]);
  const stats = ref<GivingStats | null>(null);
  
  // Actions
  const recordDonation = async (donation: Partial<Donation>) => {
    // Call Laravel API
    const response = await api.post('/api/donations', donation);
    donations.value.unshift(response.data);
  };
  
  // Offline support with IndexedDB
  const recordOfflineDonation = async (donation: Partial<Donation>) => {
    const offlineDonation = {
      ...donation,
      status: 'offline_pending_sync',
      synced_to_server: false,
    };
    await db.donations.add(offlineDonation);
  };
  
  return { donations, donors, campaigns, stats, recordDonation };
});
```

### Quasar Components
- Use `q-card` instead of Card
- Use `q-btn` instead of Button
- Use `q-input` for forms
- Use `q-select` for dropdowns
- Use `q-toggle` for switches
- Use Apexcharts or Chart.js for charts

### Laravel API Endpoints
```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/donations', [DonationController::class, 'index']);
    Route::post('/donations', [DonationController::class, 'store']);
    Route::get('/donations/stats', [DonationController::class, 'stats']);
    Route::get('/campaigns', [CampaignController::class, 'index']);
    Route::post('/campaigns', [CampaignController::class, 'store']);
});
```

## Best Practices

1. **Always validate** donation amounts before submission
2. **Generate unique receipt numbers** using organization prefix
3. **Track sync status** for offline donations
4. **Link to members** when possible for better reporting
5. **Respect anonymity** settings in all views
6. **Auto-calculate** campaign progress
7. **Set tax deductible** flag based on local regulations
8. **Log all transactions** for audit trails

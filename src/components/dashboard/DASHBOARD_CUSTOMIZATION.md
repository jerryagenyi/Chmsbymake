# Dashboard Customization System

## Overview

The ChurchAfrica ChMS Dashboard features a highly customizable, drag-and-drop KPI card system with AI-powered recommendations. Administrators can fully personalize their dashboard layout, density, and visible metrics to match their church's unique needs and priorities.

## Features

### 🎯 Core Capabilities

1. **Drag & Drop Reordering**
   - Drag cards to rearrange them in any order
   - Visual feedback during drag operations
   - Smooth animations and hover states
   - Touch-friendly for mobile devices

2. **Flexible Grid Layouts**
   - Choose 2, 3, or 4 cards per row
   - Select 1 or 2 rows of cards
   - Maximum cards: 2-8 depending on configuration
   - Responsive breakpoints for mobile/tablet

3. **Display Density Modes**
   - **Compact**: Minimal spacing, maximum information density
   - **Standard**: Balanced spacing and readability (default)
   - **Comfortable**: Generous spacing, easier on the eyes

4. **Card Management**
   - Add/remove cards from 20+ available KPI metrics
   - Organized by category (Membership, Attendance, Giving, Engagement, Events)
   - Real-time card slot counter
   - AI-recommended cards highlighted with badges

5. **AI-Powered Suggestions**
   - One-click auto-population with recommended cards
   - Context-aware suggestions based on church focus
   - Curated presets for different church sizes and priorities

6. **Persistent Configuration**
   - Settings saved to localStorage
   - Survives browser refresh
   - Per-user customization (when multi-user support is added)

## Available KPI Cards

### Membership (4 cards)
- **Total Members** ⭐ - Active membership count
- **New Members** ⭐ - Monthly new additions
- **Member Retention** - 90-day retention rate
- **Inactive Members** - Members 30+ days inactive

### Attendance (4 cards)
- **Weekly Attendance** ⭐ - Sunday service attendance
- **Attendance Rate** - Average weekly percentage
- **Midweek Service** - Wednesday service count
- **First Timers** ⭐ - New visitor tracking

### Giving & Finance (4 cards)
- **Monthly Giving** ⭐ - Total monthly donations
- **Online Giving** - Digital payment tracking
- **Active Pledges** - Commitment totals
- **Active Donors** - Monthly donor count

### Engagement (4 cards)
- **Active Groups** ⭐ - Fellowship group count
- **Group Participation** - Small group membership
- **Active Volunteers** - Regular volunteer count
- **Prayer Requests** - Pending prayer needs

### Events & Programs (4 cards)
- **Upcoming Events** ⭐ - Next 30 days
- **Event Registrations** - Registration tracking
- **Sunday School** - Children enrollment
- **Ministry Programs** - Active program count

⭐ = AI-Recommended Cards

## Usage

### Opening the Customizer

Click the "Customize Dashboard" button in the top-right corner of the dashboard.

### Layout Configuration

1. **Cards Per Row**: Select visual cards showing 2, 3, or 4 columns
2. **Number of Rows**: Choose between 1 or 2 rows
3. **Display Density**: Pick your preferred spacing (compact/standard/comfortable)

### Managing Cards

1. **Adding Cards**: 
   - Toggle switches next to card names
   - Cannot exceed maximum slots (cards per row × rows)
   - Cards appear at the end of the grid

2. **Removing Cards**:
   - Toggle off the switch
   - Card immediately removed from dashboard
   - Frees up a slot for other cards

3. **Reordering Cards**:
   - Hover over a card to reveal drag handle
   - Click and drag to desired position
   - Drop in place to finalize

### AI Suggestions

Click "Auto-populate with AI Suggestions" to:
- Replace current cards with recommended set
- Optimized for most churches
- Focuses on key growth and engagement metrics

### Reset to Defaults

Click "Reset to Defaults" to restore:
- 3 cards per row, 2 rows (6 total cards)
- Standard density
- Original recommended card set

## Technical Implementation

### Components

1. **Dashboard.tsx** - Main container with DnD context
2. **DashboardCustomizer.tsx** - Settings panel (Sheet component)
3. **DraggableKPICard.tsx** - Drag-enabled card wrapper
4. **KPICard.tsx** - Base card component (unchanged)

### Data Management

```typescript
// Configuration Interface
interface DashboardConfig {
  cardsPerRow: 2 | 3 | 4;
  rowCount: 1 | 2;
  density: 'compact' | 'standard' | 'comfortable';
  visibleCards: string[]; // Array of card IDs
}

// Card Definition
interface KPICardDefinition {
  id: string;
  title: string;
  category: 'membership' | 'attendance' | 'giving' | 'engagement' | 'events';
  recommended?: boolean;
}
```

### State Management

- **Config State**: Dashboard layout and density settings
- **Card Order State**: Drag-and-drop reordering
- **LocalStorage**: Persistent configuration across sessions

### Drag & Drop

Uses `react-dnd` with HTML5 backend:
- Smooth drag animations
- Visual drop indicators
- Boundary detection
- Index-based reordering

## Responsive Behavior

### Desktop (1024px+)
- Full grid layout with chosen cards per row
- All customization options available
- Hover states and drag handles

### Tablet (768px - 1023px)
- 2 columns for 3-4 column layouts
- 1-2 columns for 2 column layout
- Touch-optimized drag interactions

### Mobile (<768px)
- Single column layout
- All cards stacked vertically
- Customizer in full-screen drawer
- Touch-friendly controls

## Best Practices

### For Small Churches (< 200 members)
- Use 3 cards per row, 2 rows
- Focus on: Total Members, Weekly Attendance, First Timers, Monthly Giving, Active Groups, Upcoming Events
- Standard or comfortable density

### For Medium Churches (200-1000 members)
- Use 3-4 cards per row, 2 rows
- Add: New Members, Volunteers, Event Registrations
- Standard density

### For Large Churches (1000+ members)
- Use 4 cards per row, 2 rows
- Add: Attendance Rate, Online Giving, Group Participation
- Compact density for more data

### Focus-Based Recommendations

**Growth-Focused**:
- New Members, First Timers, Member Retention
- Attendance Rate, Event Registrations

**Finance-Focused**:
- Monthly Giving, Online Giving, Active Donors
- Pledges, Total Members

**Engagement-Focused**:
- Active Groups, Group Participation, Volunteers
- Prayer Requests, Ministry Programs

## Vue Migration Notes

### Pinia Store Setup

```typescript
// stores/dashboard.ts
import { defineStore } from 'pinia';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    config: {
      cardsPerRow: 3,
      rowCount: 2,
      density: 'standard',
      visibleCards: [...],
    },
    cardOrder: [...],
  }),
  
  actions: {
    updateConfig(config: DashboardConfig) {
      this.config = config;
      localStorage.setItem('dashboard-config', JSON.stringify(config));
    },
    
    reorderCards(dragIndex: number, hoverIndex: number) {
      const [card] = this.cardOrder.splice(dragIndex, 1);
      this.cardOrder.splice(hoverIndex, 0, card);
    },
  },
  
  getters: {
    visibleKPICards: (state) => {
      return state.cardOrder
        .slice(0, state.config.cardsPerRow * state.config.rowCount)
        .map(id => getCardDataById(id));
    },
  },
});
```

### Drag & Drop with VueDraggable

```vue
<template>
  <draggable 
    v-model="cardOrder"
    :component-data="{ class: 'grid' }"
    item-key="id"
    handle=".drag-handle"
  >
    <template #item="{ element, index }">
      <div class="kpi-card-wrapper">
        <q-icon name="drag_indicator" class="drag-handle" />
        <KPICard v-bind="element.cardProps" />
      </div>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next';
import { useDashboardStore } from '@/stores/dashboard';

const dashboardStore = useDashboardStore();
const cardOrder = computed(() => dashboardStore.cardOrder);
</script>
```

### Quasar Drawer for Customizer

```vue
<template>
  <q-drawer
    v-model="customizerOpen"
    side="right"
    overlay
    bordered
  >
    <q-scroll-area class="fit">
      <!-- AI Suggestions -->
      <q-btn
        label="Auto-populate with AI"
        icon="auto_awesome"
        @click="applyAISuggestions"
      />
      
      <!-- Layout Options -->
      <q-option-group
        v-model="config.cardsPerRow"
        :options="cardsPerRowOptions"
        type="radio"
      />
      
      <!-- Density Options -->
      <q-option-group
        v-model="config.density"
        :options="densityOptions"
        type="radio"
      />
      
      <!-- Card Selection -->
      <div v-for="(cards, category) in groupedCards">
        <q-item-label header>{{ category }}</q-item-label>
        <q-item
          v-for="card in cards"
          :key="card.id"
          tag="label"
        >
          <q-item-section>
            <q-item-label>{{ card.title }}</q-item-label>
            <q-badge v-if="card.recommended">AI Pick</q-badge>
          </q-item-section>
          <q-item-section side>
            <q-toggle
              :model-value="isCardVisible(card.id)"
              @update:model-value="toggleCard(card.id)"
            />
          </q-item-section>
        </q-item>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>
```

## Performance Considerations

1. **Memoization**: Card data lookups are memoized
2. **Lazy Loading**: Cards render only when visible
3. **LocalStorage Throttling**: Debounced saves to prevent excessive writes
4. **Drag Optimization**: Uses transform instead of position for smooth animations
5. **Virtual Scrolling**: Customizer uses scroll area for long card lists

## Future Enhancements

- [ ] Card-level customization (change colors, icons)
- [ ] Custom card creation with formula builder
- [ ] Dashboard templates/presets sharing
- [ ] Multi-dashboard support (create multiple layouts)
- [ ] Real-time collaboration (see other users' customizations)
- [ ] Export/import dashboard configurations
- [ ] Analytics on most-used cards
- [ ] Scheduled automatic card rotation

## Support

For questions or issues with dashboard customization:
- Check the inline help tooltips
- Use "Reset to Defaults" if configuration becomes corrupted
- Clear localStorage key `churchafrica-dashboard-config` for fresh start

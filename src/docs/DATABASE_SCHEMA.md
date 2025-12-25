# ChurchAfrica Database Schema Documentation

**Version:** 1.0  
**Date:** December 25, 2024  
**Database:** PostgreSQL 15+

**Purpose:** This document defines the complete PostgreSQL database schema for the ChurchAfrica church management system. It serves as the authoritative reference for migrating from the React design prototype to the production Laravel backend with PostgreSQL.

---

## Table of Contents

1. [Schema Overview](#1-schema-overview)
2. [Core Tables](#2-core-tables)
3. [Multi-Tenancy Tables](#3-multi-tenancy-tables)
4. [Member Management Tables](#4-member-management-tables)
5. [Attendance Tables](#5-attendance-tables)
6. [Event Management Tables](#6-event-management-tables)
7. [Giving/Donation Tables](#7-givingdonation-tables)
8. [Communication Tables](#8-communication-tables)
9. [Authentication & Authorization Tables](#9-authentication--authorization-tables)
10. [Audit & Activity Log Tables](#10-audit--activity-log-tables)
11. [Indexes & Performance Optimization](#11-indexes--performance-optimization)
12. [Views & Materialized Views](#12-views--materialized-views)
13. [Stored Procedures & Functions](#13-stored-procedures--functions)

---

## 1. Schema Overview

### 1.1 Design Principles

- **Multi-Tenancy:** All primary data tables include `church_id` for tenant isolation
- **Soft Deletes:** Most tables use `deleted_at` timestamp for soft deletion
- **Audit Trail:** All tables include `created_at`, `updated_at`, `created_by`, `updated_by`
- **UUID Primary Keys:** Using UUIDs for better distribution and security
- **JSONB for Flexibility:** Metadata columns use JSONB for extensible attributes
- **Enumerated Types:** Custom ENUM types for consistency and validation

### 1.2 Naming Conventions

- **Tables:** Singular form (e.g., `member`, `event`, not `members`, `events`)
- **Columns:** Snake_case (e.g., `first_name`, `created_at`)
- **Foreign Keys:** `{referenced_table}_id` (e.g., `church_id`, `campus_id`)
- **Indexes:** `idx_{table}_{column(s)}` (e.g., `idx_member_email`)
- **Constraints:** `{table}_{column}_{type}` (e.g., `member_email_unique`)

---

## 2. Core Tables

### 2.1 Custom Enumerated Types

```sql
-- Membership Status
CREATE TYPE membership_status AS ENUM ('New', 'Active', 'Inactive', 'Transferred', 'Deceased');

-- Gender
CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other', 'Prefer Not to Say');

-- Marital Status
CREATE TYPE marital_status AS ENUM ('Single', 'Married', 'Divorced', 'Widowed', 'Separated');

-- Event Status
CREATE TYPE event_status AS ENUM ('Draft', 'Published', 'Cancelled', 'Completed');

-- Event Category
CREATE TYPE event_category AS ENUM ('Service', 'Ministry', 'Outreach', 'Conference', 'Training', 'Social', 'Other');

-- Attendance Status
CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Late', 'Excused');

-- Donation Type
CREATE TYPE donation_type AS ENUM ('Tithe', 'Offering', 'Building Fund', 'Mission', 'Special Offering', 'Pledge', 'Other');

-- Payment Method
CREATE TYPE payment_method AS ENUM ('Cash', 'Bank Transfer', 'Mobile Money', 'Card', 'Cheque', 'Online');

-- User Role
CREATE TYPE user_role AS ENUM ('Super Admin', 'Church Admin', 'Pastor', 'Minister', 'Volunteer', 'Member');

-- Message Status
CREATE TYPE message_status AS ENUM ('Sent', 'Delivered', 'Read', 'Failed');

-- Notification Type
CREATE TYPE notification_type AS ENUM ('System', 'Event', 'Announcement', 'Chat', 'Reminder', 'Alert');
```

---

## 3. Multi-Tenancy Tables

### 3.1 Church Table

```sql
CREATE TABLE church (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(50) NOT NULL,
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Branding
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#7C5CDB', -- Hex color
    secondary_color VARCHAR(7) DEFAULT '#2D3748',
    accent_color VARCHAR(7) DEFAULT '#F59E0B',
    
    -- Settings (JSONB for flexibility)
    settings JSONB DEFAULT '{
        "timezone": "Africa/Lagos",
        "currency": "NGN",
        "language": "en-GB",
        "dateFormat": "DD/MM/YYYY",
        "weekStartsOn": 1
    }'::jsonb,
    
    -- Features (what's enabled for this church)
    features JSONB DEFAULT '{
        "attendance": true,
        "giving": true,
        "events": true,
        "chat": true,
        "sms": false,
        "email": true
    }'::jsonb,
    
    -- Subscription & Billing
    plan VARCHAR(50) DEFAULT 'free', -- free, basic, premium, enterprise
    subscription_status VARCHAR(50) DEFAULT 'active', -- active, suspended, cancelled
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Multi-tenancy isolation
    is_active BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT church_abbreviation_unique UNIQUE (abbreviation),
    CONSTRAINT church_email_unique UNIQUE (email)
);

-- Indexes
CREATE INDEX idx_church_abbreviation ON church(abbreviation);
CREATE INDEX idx_church_is_active ON church(is_active);
CREATE INDEX idx_church_deleted_at ON church(deleted_at);

-- Comments
COMMENT ON TABLE church IS 'Multi-tenant church organizations';
COMMENT ON COLUMN church.settings IS 'Church-specific configuration in JSONB format';
COMMENT ON COLUMN church.features IS 'Feature flags for this church';
```

### 3.2 Campus Table

```sql
CREATE TABLE campus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    
    -- Location data
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Capacity & Service Times
    capacity INTEGER,
    service_times JSONB DEFAULT '[]'::jsonb, -- [{day: "Sunday", time: "08:00", service: "First Service"}]
    
    -- Status
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_campus_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT campus_church_name_unique UNIQUE (church_id, name)
);

-- Indexes
CREATE INDEX idx_campus_church_id ON campus(church_id);
CREATE INDEX idx_campus_is_default ON campus(is_default);
CREATE INDEX idx_campus_is_active ON campus(is_active);
CREATE INDEX idx_campus_location ON campus USING GIST (
    ll_to_earth(latitude, longitude)
); -- For geospatial queries

-- Comments
COMMENT ON TABLE campus IS 'Physical campus locations for multi-site churches';
COMMENT ON COLUMN campus.service_times IS 'Array of service schedule objects';
```

---

## 4. Member Management Tables

### 4.1 Member Table

```sql
CREATE TABLE member (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    campus_id UUID,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    preferred_name VARCHAR(100),
    
    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(50),
    alternate_phone VARCHAR(50),
    
    -- Demographics
    date_of_birth DATE,
    gender gender_type,
    marital_status marital_status,
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    postal_code VARCHAR(20),
    
    -- Membership Details
    membership_status membership_status DEFAULT 'New',
    membership_number VARCHAR(50),
    join_date DATE,
    baptism_date DATE,
    salvation_date DATE,
    
    -- Ministry & Service
    ministry_involvement JSONB DEFAULT '[]'::jsonb, -- ["Choir", "Ushering", "Children Ministry"]
    spiritual_gifts JSONB DEFAULT '[]'::jsonb,
    serving_areas JSONB DEFAULT '[]'::jsonb,
    
    -- Family Relationships
    family_id UUID, -- Links to a family unit
    is_head_of_family BOOLEAN DEFAULT false,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relationship VARCHAR(100),
    
    -- Profile
    avatar_url TEXT,
    bio TEXT,
    occupation VARCHAR(255),
    employer VARCHAR(255),
    
    -- Preferences & Settings
    preferences JSONB DEFAULT '{
        "emailNotifications": true,
        "smsNotifications": false,
        "pushNotifications": true,
        "newsletter": true
    }'::jsonb,
    
    -- Custom Fields (church-specific)
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    -- Notes (private, for admin use)
    notes TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_member_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    CONSTRAINT fk_member_campus FOREIGN KEY (campus_id) 
        REFERENCES campus(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT member_church_email_unique UNIQUE (church_id, email),
    CONSTRAINT member_church_membership_number_unique UNIQUE (church_id, membership_number)
);

-- Indexes
CREATE INDEX idx_member_church_id ON member(church_id);
CREATE INDEX idx_member_campus_id ON member(campus_id);
CREATE INDEX idx_member_email ON member(email);
CREATE INDEX idx_member_phone ON member(phone);
CREATE INDEX idx_member_membership_status ON member(membership_status);
CREATE INDEX idx_member_join_date ON member(join_date);
CREATE INDEX idx_member_family_id ON member(family_id);
CREATE INDEX idx_member_full_name ON member(first_name, last_name);
CREATE INDEX idx_member_deleted_at ON member(deleted_at);

-- Full-text search index
CREATE INDEX idx_member_search ON member USING gin(
    to_tsvector('english', 
        coalesce(first_name, '') || ' ' || 
        coalesce(middle_name, '') || ' ' || 
        coalesce(last_name, '') || ' ' || 
        coalesce(email, '') || ' ' || 
        coalesce(phone, '')
    )
);

-- Comments
COMMENT ON TABLE member IS 'Church members and their profiles';
COMMENT ON COLUMN member.ministry_involvement IS 'Array of ministry names the member is involved in';
COMMENT ON COLUMN member.custom_fields IS 'Church-specific custom attributes';
```

### 4.2 Family Table

```sql
CREATE TABLE family (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g., "The Smith Family"
    
    -- Head of Family (primary contact)
    head_of_family_id UUID,
    
    -- Contact Information (if different from head)
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    postal_code VARCHAR(20),
    
    -- Family Notes
    notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_family_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    CONSTRAINT fk_family_head FOREIGN KEY (head_of_family_id) 
        REFERENCES member(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_family_church_id ON family(church_id);
CREATE INDEX idx_family_head_of_family_id ON family(head_of_family_id);

-- Comments
COMMENT ON TABLE family IS 'Family units grouping related members';
```

---

## 5. Attendance Tables

### 5.1 Attendance Record Table

```sql
CREATE TABLE attendance_record (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    campus_id UUID,
    member_id UUID NOT NULL,
    
    -- Event/Service Details
    event_id UUID, -- If linked to a specific event
    service_id UUID, -- If linked to a recurring service
    service_type VARCHAR(100), -- "Sunday Service", "Midweek Service", "Prayer Meeting"
    
    -- Attendance Details
    attendance_date DATE NOT NULL,
    attendance_time TIME,
    status attendance_status DEFAULT 'Present',
    
    -- Check-in Details
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_in_method VARCHAR(50), -- "Manual", "QR Code", "Mobile App", "Kiosk"
    check_in_location POINT, -- Geographic coordinates
    
    -- Check-out (optional)
    check_out_time TIMESTAMP WITH TIME ZONE,
    
    -- Additional Data
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_attendance_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_campus FOREIGN KEY (campus_id) 
        REFERENCES campus(id) ON DELETE SET NULL,
    CONSTRAINT fk_attendance_member FOREIGN KEY (member_id) 
        REFERENCES member(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_event FOREIGN KEY (event_id) 
        REFERENCES event(id) ON DELETE SET NULL,
    
    -- Constraints (prevent duplicate check-ins)
    CONSTRAINT attendance_member_date_service_unique UNIQUE (
        member_id, attendance_date, service_type
    )
);

-- Indexes
CREATE INDEX idx_attendance_church_id ON attendance_record(church_id);
CREATE INDEX idx_attendance_campus_id ON attendance_record(campus_id);
CREATE INDEX idx_attendance_member_id ON attendance_record(member_id);
CREATE INDEX idx_attendance_event_id ON attendance_record(event_id);
CREATE INDEX idx_attendance_date ON attendance_record(attendance_date);
CREATE INDEX idx_attendance_service_type ON attendance_record(service_type);
CREATE INDEX idx_attendance_status ON attendance_record(status);
CREATE INDEX idx_attendance_check_in_time ON attendance_record(check_in_time);
CREATE INDEX idx_attendance_deleted_at ON attendance_record(deleted_at);

-- Composite index for reporting
CREATE INDEX idx_attendance_church_date_campus ON attendance_record(
    church_id, attendance_date, campus_id
);

-- Comments
COMMENT ON TABLE attendance_record IS 'Individual attendance records for services and events';
COMMENT ON COLUMN attendance_record.check_in_method IS 'How the member checked in';
```

### 5.2 Service Schedule Table

```sql
CREATE TABLE service_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    campus_id UUID,
    
    name VARCHAR(255) NOT NULL, -- "First Service", "Second Service", "Midweek Service"
    description TEXT,
    service_type VARCHAR(100), -- "Sunday Service", "Prayer Meeting", "Bible Study"
    
    -- Timing
    day_of_week INTEGER, -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME,
    duration_minutes INTEGER,
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT true,
    recurrence_pattern VARCHAR(50) DEFAULT 'weekly', -- weekly, biweekly, monthly
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_service_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    CONSTRAINT fk_service_campus FOREIGN KEY (campus_id) 
        REFERENCES campus(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_service_church_id ON service_schedule(church_id);
CREATE INDEX idx_service_campus_id ON service_schedule(campus_id);
CREATE INDEX idx_service_day_of_week ON service_schedule(day_of_week);
CREATE INDEX idx_service_is_active ON service_schedule(is_active);

-- Comments
COMMENT ON TABLE service_schedule IS 'Recurring service schedules for campuses';
```

---

## 6. Event Management Tables

### 6.1 Event Table

```sql
CREATE TABLE event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    campus_id UUID,
    
    -- Basic Information
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255), -- URL-friendly identifier
    description TEXT,
    category event_category DEFAULT 'Other',
    
    -- Timing
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    timezone VARCHAR(50) DEFAULT 'Africa/Lagos',
    is_all_day BOOLEAN DEFAULT false,
    
    -- Location
    location_name VARCHAR(255),
    location_address TEXT,
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    location_coordinates POINT,
    is_online BOOLEAN DEFAULT false,
    online_meeting_url TEXT,
    
    -- Registration & Capacity
    requires_registration BOOLEAN DEFAULT false,
    registration_opens_at TIMESTAMP WITH TIME ZONE,
    registration_closes_at TIMESTAMP WITH TIME ZONE,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    
    -- Pricing (if applicable)
    is_free BOOLEAN DEFAULT true,
    price DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'NGN',
    
    -- Visibility & Status
    status event_status DEFAULT 'Draft',
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true, -- Visible to non-members?
    
    -- Media
    featured_image_url TEXT,
    images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
    
    -- Organizers & Contacts
    organizer_name VARCHAR(255),
    organizer_email VARCHAR(255),
    organizer_phone VARCHAR(50),
    contact_person_id UUID, -- Member who is the contact
    
    -- Ministry/Department
    ministry_department VARCHAR(255),
    
    -- Additional Data
    tags JSONB DEFAULT '[]'::jsonb, -- ["Youth", "Worship", "Outreach"]
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_event_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_campus FOREIGN KEY (campus_id) 
        REFERENCES campus(id) ON DELETE SET NULL,
    CONSTRAINT fk_event_contact FOREIGN KEY (contact_person_id) 
        REFERENCES member(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT event_church_slug_unique UNIQUE (church_id, slug),
    CONSTRAINT event_dates_check CHECK (end_date >= start_date)
);

-- Indexes
CREATE INDEX idx_event_church_id ON event(church_id);
CREATE INDEX idx_event_campus_id ON event(campus_id);
CREATE INDEX idx_event_category ON event(category);
CREATE INDEX idx_event_status ON event(status);
CREATE INDEX idx_event_start_date ON event(start_date);
CREATE INDEX idx_event_end_date ON event(end_date);
CREATE INDEX idx_event_is_featured ON event(is_featured);
CREATE INDEX idx_event_is_public ON event(is_public);
CREATE INDEX idx_event_deleted_at ON event(deleted_at);
CREATE INDEX idx_event_slug ON event(slug);

-- Composite index for event listing
CREATE INDEX idx_event_church_status_start ON event(
    church_id, status, start_date DESC
);

-- Full-text search
CREATE INDEX idx_event_search ON event USING gin(
    to_tsvector('english', 
        coalesce(title, '') || ' ' || 
        coalesce(description, '') || ' ' || 
        coalesce(location_name, '')
    )
);

-- Comments
COMMENT ON TABLE event IS 'Church events, conferences, and special services';
COMMENT ON COLUMN event.tags IS 'Array of tag strings for categorization';
```

### 6.2 Event Registration Table

```sql
CREATE TABLE event_registration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL,
    member_id UUID NOT NULL,
    
    -- Registration Details
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Confirmed', -- Confirmed, Cancelled, Waitlist, Attended
    
    -- Guest Information (if registering for guests)
    number_of_guests INTEGER DEFAULT 0,
    guest_names JSONB DEFAULT '[]'::jsonb,
    
    -- Payment (if event is paid)
    payment_status VARCHAR(50), -- Pending, Paid, Refunded
    payment_amount DECIMAL(10, 2),
    payment_reference VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    
    -- Check-in
    checked_in BOOLEAN DEFAULT false,
    check_in_time TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    registration_notes TEXT,
    admin_notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_event_reg_event FOREIGN KEY (event_id) 
        REFERENCES event(id) ON DELETE CASCADE,
    CONSTRAINT fk_event_reg_member FOREIGN KEY (member_id) 
        REFERENCES member(id) ON DELETE CASCADE,
    
    -- Constraints (prevent duplicate registrations)
    CONSTRAINT event_reg_event_member_unique UNIQUE (event_id, member_id)
);

-- Indexes
CREATE INDEX idx_event_reg_event_id ON event_registration(event_id);
CREATE INDEX idx_event_reg_member_id ON event_registration(member_id);
CREATE INDEX idx_event_reg_status ON event_registration(status);
CREATE INDEX idx_event_reg_payment_status ON event_registration(payment_status);
CREATE INDEX idx_event_reg_checked_in ON event_registration(checked_in);

-- Comments
COMMENT ON TABLE event_registration IS 'Member registrations for events';
```

---

## 7. Giving/Donation Tables

### 7.1 Donation Table

```sql
CREATE TABLE donation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    campus_id UUID,
    member_id UUID,
    
    -- Donation Details
    donation_type donation_type NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    
    -- Date & Time
    donation_date DATE NOT NULL,
    donation_time TIME,
    
    -- Payment Information
    payment_method payment_method NOT NULL,
    transaction_reference VARCHAR(255),
    cheque_number VARCHAR(100),
    bank_name VARCHAR(255),
    
    -- For online payments
    payment_gateway VARCHAR(50), -- "Paystack", "Flutterwave", "Stripe"
    payment_gateway_reference VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'Completed', -- Pending, Completed, Failed, Refunded
    
    -- Recurring Donations
    is_recurring BOOLEAN DEFAULT false,
    recurrence_frequency VARCHAR(50), -- monthly, quarterly, annually
    parent_donation_id UUID, -- Links to original donation if recurring
    
    -- Pledge Tracking
    pledge_id UUID,
    
    -- Purpose & Designation
    fund_name VARCHAR(255), -- Specific fund or project
    campaign_id UUID, -- If part of a fundraising campaign
    
    -- Anonymity
    is_anonymous BOOLEAN DEFAULT false,
    
    -- Tax Receipt
    tax_receipt_number VARCHAR(100),
    tax_receipt_issued_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    donor_note TEXT,
    admin_note TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_donation_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    CONSTRAINT fk_donation_campus FOREIGN KEY (campus_id) 
        REFERENCES campus(id) ON DELETE SET NULL,
    CONSTRAINT fk_donation_member FOREIGN KEY (member_id) 
        REFERENCES member(id) ON DELETE SET NULL,
    CONSTRAINT fk_donation_parent FOREIGN KEY (parent_donation_id) 
        REFERENCES donation(id) ON DELETE SET NULL,
    
    -- Constraints
    CONSTRAINT donation_amount_positive CHECK (amount > 0)
);

-- Indexes
CREATE INDEX idx_donation_church_id ON donation(church_id);
CREATE INDEX idx_donation_campus_id ON donation(campus_id);
CREATE INDEX idx_donation_member_id ON donation(member_id);
CREATE INDEX idx_donation_type ON donation(donation_type);
CREATE INDEX idx_donation_date ON donation(donation_date);
CREATE INDEX idx_donation_payment_method ON donation(payment_method);
CREATE INDEX idx_donation_payment_status ON donation(payment_status);
CREATE INDEX idx_donation_is_anonymous ON donation(is_anonymous);
CREATE INDEX idx_donation_deleted_at ON donation(deleted_at);
CREATE INDEX idx_donation_tax_receipt_number ON donation(tax_receipt_number);

-- Composite indexes for reporting
CREATE INDEX idx_donation_church_date_type ON donation(
    church_id, donation_date DESC, donation_type
);
CREATE INDEX idx_donation_member_date ON donation(
    member_id, donation_date DESC
);

-- Comments
COMMENT ON TABLE donation IS 'Financial donations and giving records';
COMMENT ON COLUMN donation.is_anonymous IS 'Whether donor wants to remain anonymous';
```

### 7.2 Pledge Table

```sql
CREATE TABLE pledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    member_id UUID NOT NULL,
    
    -- Pledge Details
    pledge_type VARCHAR(100), -- "Building Fund", "Missions", "General"
    total_amount DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    remaining_amount DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'NGN',
    
    -- Timing
    pledge_date DATE NOT NULL,
    due_date DATE,
    completed_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'Active', -- Active, Completed, Cancelled, Overdue
    
    -- Payment Plan
    installment_frequency VARCHAR(50), -- weekly, monthly, quarterly
    number_of_installments INTEGER,
    installment_amount DECIMAL(12, 2),
    
    -- Campaign
    campaign_id UUID,
    
    -- Notes
    notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_pledge_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    CONSTRAINT fk_pledge_member FOREIGN KEY (member_id) 
        REFERENCES member(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT pledge_total_amount_positive CHECK (total_amount > 0),
    CONSTRAINT pledge_amounts_valid CHECK (paid_amount <= total_amount)
);

-- Indexes
CREATE INDEX idx_pledge_church_id ON pledge(church_id);
CREATE INDEX idx_pledge_member_id ON pledge(member_id);
CREATE INDEX idx_pledge_status ON pledge(status);
CREATE INDEX idx_pledge_due_date ON pledge(due_date);

-- Comments
COMMENT ON TABLE pledge IS 'Member pledges and commitments';
```

### 7.3 Fundraising Campaign Table

```sql
CREATE TABLE fundraising_campaign (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    goal_amount DECIMAL(12, 2) NOT NULL,
    raised_amount DECIMAL(12, 2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'NGN',
    
    -- Timing
    start_date DATE NOT NULL,
    end_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'Active', -- Active, Completed, Cancelled
    is_active BOOLEAN DEFAULT true,
    
    -- Visibility
    is_public BOOLEAN DEFAULT true,
    
    -- Media
    image_url TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_campaign_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT campaign_goal_positive CHECK (goal_amount > 0)
);

-- Indexes
CREATE INDEX idx_campaign_church_id ON fundraising_campaign(church_id);
CREATE INDEX idx_campaign_status ON fundraising_campaign(status);
CREATE INDEX idx_campaign_dates ON fundraising_campaign(start_date, end_date);

-- Comments
COMMENT ON TABLE fundraising_campaign IS 'Fundraising campaigns and projects';
```

---

## 8. Communication Tables

### 8.1 Conversation Table

```sql
CREATE TABLE conversation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    
    -- Conversation Type
    type VARCHAR(50) NOT NULL, -- "direct", "group", "channel", "announcement"
    name VARCHAR(255), -- For group chats
    description TEXT,
    
    -- Group Chat Settings
    is_group BOOLEAN DEFAULT false,
    max_participants INTEGER,
    
    -- Visibility
    is_private BOOLEAN DEFAULT true,
    
    -- Media
    avatar_url TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    archived_at TIMESTAMP WITH TIME ZONE,
    
    -- Last Activity
    last_message_at TIMESTAMP WITH TIME ZONE,
    last_message_preview TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_conversation_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_conversation_church_id ON conversation(church_id);
CREATE INDEX idx_conversation_type ON conversation(type);
CREATE INDEX idx_conversation_is_active ON conversation(is_active);
CREATE INDEX idx_conversation_last_message_at ON conversation(last_message_at DESC);

-- Comments
COMMENT ON TABLE conversation IS 'Chat conversations (direct and group)';
```

### 8.2 Conversation Participant Table

```sql
CREATE TABLE conversation_participant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    member_id UUID NOT NULL,
    
    -- Role in conversation
    role VARCHAR(50) DEFAULT 'member', -- member, admin, moderator
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    
    -- Read Status
    last_read_at TIMESTAMP WITH TIME ZONE,
    unread_count INTEGER DEFAULT 0,
    
    -- Notifications
    notifications_enabled BOOLEAN DEFAULT true,
    notification_sound VARCHAR(50) DEFAULT 'default',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_participant_conversation FOREIGN KEY (conversation_id) 
        REFERENCES conversation(id) ON DELETE CASCADE,
    CONSTRAINT fk_participant_member FOREIGN KEY (member_id) 
        REFERENCES member(id) ON DELETE CASCADE,
    
    -- Constraints (prevent duplicate participants)
    CONSTRAINT conversation_participant_unique UNIQUE (conversation_id, member_id)
);

-- Indexes
CREATE INDEX idx_participant_conversation_id ON conversation_participant(conversation_id);
CREATE INDEX idx_participant_member_id ON conversation_participant(member_id);
CREATE INDEX idx_participant_is_active ON conversation_participant(is_active);
CREATE INDEX idx_participant_unread_count ON conversation_participant(unread_count);

-- Comments
COMMENT ON TABLE conversation_participant IS 'Members participating in conversations';
```

### 8.3 Message Table

```sql
CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    
    -- Message Content
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'text', -- text, image, video, audio, file, location
    
    -- Reply/Thread
    reply_to_message_id UUID,
    thread_id UUID,
    
    -- Attachments
    attachments JSONB DEFAULT '[]'::jsonb, -- [{url, type, name, size}]
    
    -- Status
    status message_status DEFAULT 'Sent',
    is_edited BOOLEAN DEFAULT false,
    edited_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery & Read Receipts
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id) 
        REFERENCES conversation(id) ON DELETE CASCADE,
    CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) 
        REFERENCES member(id) ON DELETE CASCADE,
    CONSTRAINT fk_message_reply_to FOREIGN KEY (reply_to_message_id) 
        REFERENCES message(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_message_conversation_id ON message(conversation_id);
CREATE INDEX idx_message_sender_id ON message(sender_id);
CREATE INDEX idx_message_created_at ON message(created_at DESC);
CREATE INDEX idx_message_status ON message(status);
CREATE INDEX idx_message_reply_to ON message(reply_to_message_id);
CREATE INDEX idx_message_deleted_at ON message(deleted_at);

-- Composite index for conversation message listing
CREATE INDEX idx_message_conversation_created ON message(
    conversation_id, created_at DESC
);

-- Full-text search for messages
CREATE INDEX idx_message_search ON message USING gin(
    to_tsvector('english', coalesce(content, ''))
);

-- Comments
COMMENT ON TABLE message IS 'Individual chat messages';
COMMENT ON COLUMN message.attachments IS 'Array of attachment objects';
```

### 8.4 Announcement Table

```sql
CREATE TABLE announcement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID NOT NULL,
    campus_id UUID, -- NULL means church-wide
    
    -- Content
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    
    -- Targeting
    target_audience VARCHAR(50) DEFAULT 'all', -- all, campus, ministry, group, role
    target_ids JSONB DEFAULT '[]'::jsonb, -- Array of campus_ids, ministry names, etc.
    
    -- Priority & Visibility
    priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high, urgent
    is_pinned BOOLEAN DEFAULT false,
    
    -- Publishing
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, published, archived
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Media
    featured_image_url TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_by UUID,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_announcement_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    CONSTRAINT fk_announcement_campus FOREIGN KEY (campus_id) 
        REFERENCES campus(id) ON DELETE SET NULL,
    CONSTRAINT fk_announcement_creator FOREIGN KEY (created_by) 
        REFERENCES member(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_announcement_church_id ON announcement(church_id);
CREATE INDEX idx_announcement_campus_id ON announcement(campus_id);
CREATE INDEX idx_announcement_status ON announcement(status);
CREATE INDEX idx_announcement_published_at ON announcement(published_at DESC);
CREATE INDEX idx_announcement_is_pinned ON announcement(is_pinned);
CREATE INDEX idx_announcement_priority ON announcement(priority);

-- Comments
COMMENT ON TABLE announcement IS 'Church-wide and campus-specific announcements';
```

---

## 9. Authentication & Authorization Tables

### 9.1 User Table

```sql
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID UNIQUE, -- Links to member profile
    church_id UUID NOT NULL,
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Account Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    backup_codes JSONB,
    
    -- Password Management
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    last_password_change TIMESTAMP WITH TIME ZONE,
    
    -- Login Tracking
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    
    -- Remember Token (for "Remember Me" functionality)
    remember_token VARCHAR(100),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_user_member FOREIGN KEY (member_id) 
        REFERENCES member(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_member_id ON "user"(member_id);
CREATE INDEX idx_user_church_id ON "user"(church_id);
CREATE INDEX idx_user_is_active ON "user"(is_active);
CREATE INDEX idx_user_password_reset_token ON "user"(password_reset_token);

-- Comments
COMMENT ON TABLE "user" IS 'User authentication and account management';
```

### 9.2 Role Table

```sql
CREATE TABLE role (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID, -- NULL means system-wide role
    
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Hierarchy
    level INTEGER DEFAULT 0, -- Higher number = more privileges
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_system BOOLEAN DEFAULT false, -- System roles can't be deleted
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Foreign keys
    CONSTRAINT fk_role_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT role_name_church_unique UNIQUE (church_id, name)
);

-- Indexes
CREATE INDEX idx_role_church_id ON role(church_id);
CREATE INDEX idx_role_is_active ON role(is_active);

-- Comments
COMMENT ON TABLE role IS 'User roles for authorization';
```

### 9.3 Permission Table

```sql
CREATE TABLE permission (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Grouping
    category VARCHAR(100), -- "members", "events", "giving", "settings"
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_permission_name ON permission(name);
CREATE INDEX idx_permission_category ON permission(category);

-- Comments
COMMENT ON TABLE permission IS 'System-wide permissions';
```

### 9.4 Role Permission Table (Many-to-Many)

```sql
CREATE TABLE role_permission (
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_role_permission_role FOREIGN KEY (role_id) 
        REFERENCES role(id) ON DELETE CASCADE,
    CONSTRAINT fk_role_permission_permission FOREIGN KEY (permission_id) 
        REFERENCES permission(id) ON DELETE CASCADE,
    
    -- Primary key
    PRIMARY KEY (role_id, permission_id)
);

-- Indexes
CREATE INDEX idx_role_permission_role_id ON role_permission(role_id);
CREATE INDEX idx_role_permission_permission_id ON role_permission(permission_id);

-- Comments
COMMENT ON TABLE role_permission IS 'Permissions assigned to roles';
```

### 9.5 User Role Table (Many-to-Many)

```sql
CREATE TABLE user_role (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    
    -- Scope (where this role applies)
    campus_id UUID, -- NULL means all campuses
    
    -- Validity
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    
    -- Foreign keys
    CONSTRAINT fk_user_role_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_role_role FOREIGN KEY (role_id) 
        REFERENCES role(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_role_campus FOREIGN KEY (campus_id) 
        REFERENCES campus(id) ON DELETE CASCADE,
    
    -- Primary key
    PRIMARY KEY (user_id, role_id, COALESCE(campus_id, '00000000-0000-0000-0000-000000000000'::UUID))
);

-- Indexes
CREATE INDEX idx_user_role_user_id ON user_role(user_id);
CREATE INDEX idx_user_role_role_id ON user_role(role_id);
CREATE INDEX idx_user_role_campus_id ON user_role(campus_id);

-- Comments
COMMENT ON TABLE user_role IS 'Roles assigned to users';
```

---

## 10. Audit & Activity Log Tables

### 10.1 Activity Log Table

```sql
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    church_id UUID,
    user_id UUID,
    
    -- Activity Details
    activity_type VARCHAR(100) NOT NULL, -- "created", "updated", "deleted", "login", etc.
    entity_type VARCHAR(100), -- "member", "event", "donation", etc.
    entity_id UUID,
    
    -- Description
    description TEXT,
    
    -- Changes (for audit trail)
    old_values JSONB,
    new_values JSONB,
    
    -- Request Context
    ip_address INET,
    user_agent TEXT,
    request_url TEXT,
    request_method VARCHAR(10),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    CONSTRAINT fk_activity_log_church FOREIGN KEY (church_id) 
        REFERENCES church(id) ON DELETE CASCADE,
    CONSTRAINT fk_activity_log_user FOREIGN KEY (user_id) 
        REFERENCES "user"(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_activity_log_church_id ON activity_log(church_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_activity_type ON activity_log(activity_type);
CREATE INDEX idx_activity_log_entity_type ON activity_log(entity_type);
CREATE INDEX idx_activity_log_entity_id ON activity_log(entity_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- Composite index for entity history
CREATE INDEX idx_activity_log_entity_history ON activity_log(
    entity_type, entity_id, created_at DESC
);

-- Partition by created_at (monthly partitions)
-- This improves query performance and allows easy archival
-- ALTER TABLE activity_log PARTITION BY RANGE (created_at);

-- Comments
COMMENT ON TABLE activity_log IS 'Comprehensive audit trail of all system activities';
COMMENT ON COLUMN activity_log.old_values IS 'Previous values before change';
COMMENT ON COLUMN activity_log.new_values IS 'New values after change';
```

---

## 11. Indexes & Performance Optimization

### 11.1 Additional Performance Indexes

```sql
-- Compound index for member search with filters
CREATE INDEX idx_member_search_filters ON member(
    church_id, 
    membership_status, 
    campus_id, 
    is_active
) WHERE deleted_at IS NULL;

-- Index for birthday reminders (ignore year)
CREATE INDEX idx_member_birthday ON member(
    church_id,
    EXTRACT(MONTH FROM date_of_birth),
    EXTRACT(DAY FROM date_of_birth)
) WHERE deleted_at IS NULL;

-- Index for attendance reports by date range
CREATE INDEX idx_attendance_date_range ON attendance_record(
    church_id,
    attendance_date DESC,
    campus_id
) WHERE deleted_at IS NULL;

-- Index for giving reports by date range
CREATE INDEX idx_donation_date_range ON donation(
    church_id,
    donation_date DESC,
    donation_type
) WHERE deleted_at IS NULL AND payment_status = 'Completed';

-- Index for upcoming events
CREATE INDEX idx_event_upcoming ON event(
    church_id,
    start_date ASC
) WHERE status = 'Published' AND deleted_at IS NULL;

-- Partial index for active conversations
CREATE INDEX idx_conversation_active ON conversation(
    church_id,
    last_message_at DESC
) WHERE is_active = true AND deleted_at IS NULL;
```

### 11.2 Database Functions for Common Calculations

```sql
-- Function to calculate member age
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM AGE(birth_date));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate pledge completion percentage
CREATE OR REPLACE FUNCTION pledge_completion_percentage(
    p_total_amount DECIMAL,
    p_paid_amount DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
    IF p_total_amount = 0 THEN
        RETURN 0;
    END IF;
    RETURN ROUND((p_paid_amount / p_total_amount) * 100, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get member's latest attendance date
CREATE OR REPLACE FUNCTION member_last_attendance_date(p_member_id UUID)
RETURNS DATE AS $$
BEGIN
    RETURN (
        SELECT MAX(attendance_date)
        FROM attendance_record
        WHERE member_id = p_member_id
        AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql STABLE;
```

---

## 12. Views & Materialized Views

### 12.1 Member Summary View

```sql
CREATE VIEW vw_member_summary AS
SELECT 
    m.id,
    m.church_id,
    m.campus_id,
    m.first_name,
    m.last_name,
    m.email,
    m.phone,
    m.membership_status,
    m.join_date,
    c.name AS campus_name,
    
    -- Calculated fields
    calculate_age(m.date_of_birth) AS age,
    
    -- Attendance summary
    (SELECT COUNT(*) 
     FROM attendance_record ar 
     WHERE ar.member_id = m.id 
     AND ar.deleted_at IS NULL) AS total_attendance_count,
    
    (SELECT MAX(attendance_date) 
     FROM attendance_record ar 
     WHERE ar.member_id = m.id 
     AND ar.deleted_at IS NULL) AS last_attendance_date,
    
    -- Giving summary
    (SELECT COALESCE(SUM(amount), 0) 
     FROM donation d 
     WHERE d.member_id = m.id 
     AND d.payment_status = 'Completed'
     AND d.deleted_at IS NULL) AS total_giving_amount,
    
    (SELECT MAX(donation_date) 
     FROM donation d 
     WHERE d.member_id = m.id 
     AND d.payment_status = 'Completed'
     AND d.deleted_at IS NULL) AS last_giving_date,
    
    -- Family info
    f.name AS family_name,
    m.is_head_of_family
    
FROM member m
LEFT JOIN campus c ON m.campus_id = c.id
LEFT JOIN family f ON m.family_id = f.id
WHERE m.deleted_at IS NULL;

-- Comments
COMMENT ON VIEW vw_member_summary IS 'Comprehensive member summary with calculated fields';
```

### 12.2 Attendance Statistics Materialized View

```sql
CREATE MATERIALIZED VIEW mv_attendance_statistics AS
SELECT 
    church_id,
    campus_id,
    attendance_date,
    service_type,
    COUNT(DISTINCT member_id) AS unique_attendees,
    COUNT(*) AS total_check_ins,
    COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_count,
    COUNT(CASE WHEN status = 'Late' THEN 1 END) AS late_count,
    AVG(EXTRACT(EPOCH FROM (check_out_time - check_in_time))/3600) AS avg_duration_hours
FROM attendance_record
WHERE deleted_at IS NULL
GROUP BY church_id, campus_id, attendance_date, service_type;

-- Index on materialized view
CREATE INDEX idx_mv_attendance_stats_church_date ON mv_attendance_statistics(
    church_id, attendance_date DESC
);

-- Comments
COMMENT ON MATERIALIZED VIEW mv_attendance_statistics IS 'Pre-calculated attendance statistics for reporting';

-- Refresh function (should be called nightly or as needed)
CREATE OR REPLACE FUNCTION refresh_attendance_statistics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_attendance_statistics;
END;
$$ LANGUAGE plpgsql;
```

### 12.3 Giving Statistics Materialized View

```sql
CREATE MATERIALIZED VIEW mv_giving_statistics AS
SELECT 
    church_id,
    campus_id,
    donation_type,
    DATE_TRUNC('month', donation_date) AS month,
    COUNT(*) AS donation_count,
    COUNT(DISTINCT member_id) AS unique_donors,
    SUM(amount) AS total_amount,
    AVG(amount) AS average_amount,
    MIN(amount) AS min_amount,
    MAX(amount) AS max_amount
FROM donation
WHERE payment_status = 'Completed'
AND deleted_at IS NULL
GROUP BY church_id, campus_id, donation_type, DATE_TRUNC('month', donation_date);

-- Index on materialized view
CREATE INDEX idx_mv_giving_stats_church_month ON mv_giving_statistics(
    church_id, month DESC
);

-- Comments
COMMENT ON MATERIALIZED VIEW mv_giving_statistics IS 'Pre-calculated giving statistics for reporting';
```

---

## 13. Stored Procedures & Functions

### 13.1 Member Check-In Procedure

```sql
CREATE OR REPLACE FUNCTION member_check_in(
    p_member_id UUID,
    p_campus_id UUID,
    p_service_type VARCHAR,
    p_check_in_method VARCHAR DEFAULT 'Manual'
)
RETURNS UUID AS $$
DECLARE
    v_church_id UUID;
    v_attendance_id UUID;
BEGIN
    -- Get church_id from member
    SELECT church_id INTO v_church_id
    FROM member
    WHERE id = p_member_id;
    
    -- Insert attendance record
    INSERT INTO attendance_record (
        church_id,
        campus_id,
        member_id,
        service_type,
        attendance_date,
        attendance_time,
        check_in_time,
        check_in_method,
        status
    ) VALUES (
        v_church_id,
        p_campus_id,
        p_member_id,
        p_service_type,
        CURRENT_DATE,
        CURRENT_TIME,
        CURRENT_TIMESTAMP,
        p_check_in_method,
        'Present'
    )
    ON CONFLICT (member_id, attendance_date, service_type)
    DO UPDATE SET
        check_in_time = CURRENT_TIMESTAMP,
        check_in_method = p_check_in_method,
        status = 'Present',
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO v_attendance_id;
    
    RETURN v_attendance_id;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON FUNCTION member_check_in IS 'Handles member check-in with duplicate prevention';
```

### 13.2 Record Donation Procedure

```sql
CREATE OR REPLACE FUNCTION record_donation(
    p_church_id UUID,
    p_member_id UUID,
    p_campus_id UUID,
    p_donation_type donation_type,
    p_amount DECIMAL,
    p_payment_method payment_method,
    p_donation_date DATE DEFAULT CURRENT_DATE,
    p_is_anonymous BOOLEAN DEFAULT false,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_donation_id UUID;
BEGIN
    -- Insert donation record
    INSERT INTO donation (
        church_id,
        campus_id,
        member_id,
        donation_type,
        amount,
        payment_method,
        donation_date,
        donation_time,
        is_anonymous,
        donor_note,
        payment_status
    ) VALUES (
        p_church_id,
        p_campus_id,
        CASE WHEN p_is_anonymous THEN NULL ELSE p_member_id END,
        p_donation_type,
        p_amount,
        p_payment_method,
        p_donation_date,
        CURRENT_TIME,
        p_is_anonymous,
        p_notes,
        'Completed'
    )
    RETURNING id INTO v_donation_id;
    
    -- Update pledge if applicable
    UPDATE pledge
    SET 
        paid_amount = paid_amount + p_amount,
        remaining_amount = total_amount - (paid_amount + p_amount),
        updated_at = CURRENT_TIMESTAMP
    WHERE member_id = p_member_id
    AND pledge_type = p_donation_type
    AND status = 'Active'
    AND deleted_at IS NULL;
    
    RETURN v_donation_id;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON FUNCTION record_donation IS 'Records donation and updates related pledges';
```

### 13.3 Event Registration Procedure

```sql
CREATE OR REPLACE FUNCTION register_for_event(
    p_event_id UUID,
    p_member_id UUID,
    p_number_of_guests INTEGER DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
    v_registration_id UUID;
    v_current_attendees INTEGER;
    v_max_attendees INTEGER;
BEGIN
    -- Check event capacity
    SELECT current_attendees, max_attendees
    INTO v_current_attendees, v_max_attendees
    FROM event
    WHERE id = p_event_id;
    
    IF v_max_attendees IS NOT NULL AND 
       v_current_attendees + p_number_of_guests + 1 > v_max_attendees THEN
        RAISE EXCEPTION 'Event is at full capacity';
    END IF;
    
    -- Create registration
    INSERT INTO event_registration (
        event_id,
        member_id,
        number_of_guests,
        status
    ) VALUES (
        p_event_id,
        p_member_id,
        p_number_of_guests,
        'Confirmed'
    )
    RETURNING id INTO v_registration_id;
    
    -- Update event attendee count
    UPDATE event
    SET current_attendees = current_attendees + p_number_of_guests + 1
    WHERE id = p_event_id;
    
    RETURN v_registration_id;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON FUNCTION register_for_event IS 'Registers member for event with capacity check';
```

---

## 14. Triggers

### 14.1 Update Timestamp Trigger

```sql
-- Generic function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all relevant tables
CREATE TRIGGER update_church_updated_at BEFORE UPDATE ON church
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campus_updated_at BEFORE UPDATE ON campus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_updated_at BEFORE UPDATE ON member
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance_record
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_updated_at BEFORE UPDATE ON event
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_updated_at BEFORE UPDATE ON donation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add similar triggers for all other tables with updated_at column
```

### 14.2 Pledge Remaining Amount Trigger

```sql
CREATE OR REPLACE FUNCTION update_pledge_remaining_amount()
RETURNS TRIGGER AS $$
BEGIN
    NEW.remaining_amount = NEW.total_amount - NEW.paid_amount;
    
    -- Update status if fully paid
    IF NEW.remaining_amount <= 0 THEN
        NEW.status = 'Completed';
        NEW.completed_date = CURRENT_DATE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pledge_amounts BEFORE INSERT OR UPDATE ON pledge
    FOR EACH ROW EXECUTE FUNCTION update_pledge_remaining_amount();
```

### 14.3 Activity Log Trigger

```sql
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
    v_church_id UUID;
    v_user_id UUID;
BEGIN
    -- Extract church_id and user_id from the record
    IF TG_OP = 'DELETE' THEN
        v_church_id := OLD.church_id;
    ELSE
        v_church_id := NEW.church_id;
    END IF;
    
    -- Get current user from session (set by application)
    v_user_id := current_setting('app.current_user_id', TRUE)::UUID;
    
    -- Log the activity
    INSERT INTO activity_log (
        church_id,
        user_id,
        activity_type,
        entity_type,
        entity_id,
        old_values,
        new_values,
        created_at
    ) VALUES (
        v_church_id,
        v_user_id,
        LOWER(TG_OP),
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        CURRENT_TIMESTAMP
    );
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables that need audit logging
CREATE TRIGGER log_member_activity AFTER INSERT OR UPDATE OR DELETE ON member
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_donation_activity AFTER INSERT OR UPDATE OR DELETE ON donation
    FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Add similar triggers for other critical tables
```

---

## 15. Initial Data Seeding

### 15.1 System Roles and Permissions

```sql
-- Insert system permissions
INSERT INTO permission (name, display_name, category, description) VALUES
    -- Member permissions
    ('members.view', 'View Members', 'members', 'View member profiles and lists'),
    ('members.create', 'Create Members', 'members', 'Add new members'),
    ('members.edit', 'Edit Members', 'members', 'Modify member information'),
    ('members.delete', 'Delete Members', 'members', 'Remove members from system'),
    
    -- Attendance permissions
    ('attendance.view', 'View Attendance', 'attendance', 'View attendance records'),
    ('attendance.record', 'Record Attendance', 'attendance', 'Mark attendance'),
    ('attendance.edit', 'Edit Attendance', 'attendance', 'Modify attendance records'),
    
    -- Event permissions
    ('events.view', 'View Events', 'events', 'View event listings'),
    ('events.create', 'Create Events', 'events', 'Create new events'),
    ('events.edit', 'Edit Events', 'events', 'Modify events'),
    ('events.delete', 'Delete Events', 'events', 'Remove events'),
    
    -- Giving permissions
    ('giving.view', 'View Giving', 'giving', 'View donation records'),
    ('giving.record', 'Record Giving', 'giving', 'Record donations'),
    ('giving.edit', 'Edit Giving', 'giving', 'Modify donation records'),
    ('giving.reports', 'Giving Reports', 'giving', 'View financial reports'),
    
    -- Communication permissions
    ('chat.access', 'Access Chat', 'communication', 'Use chat system'),
    ('announcements.view', 'View Announcements', 'communication', 'View announcements'),
    ('announcements.create', 'Create Announcements', 'communication', 'Post announcements'),
    
    -- Admin permissions
    ('settings.view', 'View Settings', 'admin', 'View system settings'),
    ('settings.edit', 'Edit Settings', 'admin', 'Modify system settings'),
    ('users.manage', 'Manage Users', 'admin', 'Manage user accounts'),
    ('roles.manage', 'Manage Roles', 'admin', 'Manage roles and permissions');

-- Insert system roles
INSERT INTO role (name, display_name, description, level, is_system) VALUES
    ('super_admin', 'Super Administrator', 'Full system access', 100, true),
    ('church_admin', 'Church Administrator', 'Church-wide administrative access', 90, true),
    ('pastor', 'Pastor', 'Pastoral staff access', 80, true),
    ('minister', 'Minister', 'Ministry leader access', 60, true),
    ('volunteer', 'Volunteer', 'Volunteer access', 40, true),
    ('member', 'Member', 'Basic member access', 20, true);
```

---

## 16. Migration Notes

### 16.1 Data Migration from Firestore/Current System

When migrating from the React prototype or Firestore:

1. **Church Setup**: Create church record first with default branding
2. **Campuses**: Create at least one default campus
3. **Members**: Import member data, ensuring email uniqueness
4. **User Accounts**: Create user accounts linked to members
5. **Roles**: Assign appropriate roles to users
6. **Historical Data**: Import attendance, donations, events in chronological order

### 16.2 Performance Considerations

- **Partitioning**: Consider partitioning `activity_log` by date for better performance
- **Archival**: Implement archival strategy for old attendance and donation records
- **Replication**: Set up read replicas for reporting queries
- **Caching**: Use Redis/Memcached for frequently accessed data (church settings, permissions)
- **Connection Pooling**: Configure appropriate connection pool size based on load

### 16.3 Backup Strategy

- **Daily Backups**: Full database backup daily
- **Point-in-Time Recovery**: Enable WAL archiving
- **Retention**: Keep backups for 30 days minimum
- **Testing**: Regular restore testing

---

## 17. Query Examples

### 17.1 Member Queries

```sql
-- Get all active members with their campus
SELECT 
    m.id,
    m.first_name || ' ' || m.last_name AS full_name,
    m.email,
    m.membership_status,
    c.name AS campus_name
FROM member m
LEFT JOIN campus c ON m.campus_id = c.id
WHERE m.church_id = 'church-uuid'
AND m.is_active = true
AND m.deleted_at IS NULL
ORDER BY m.last_name, m.first_name;

-- Get member with attendance summary
SELECT 
    m.*,
    COUNT(ar.id) AS total_attendance,
    MAX(ar.attendance_date) AS last_attendance
FROM member m
LEFT JOIN attendance_record ar ON m.id = ar.member_id AND ar.deleted_at IS NULL
WHERE m.id = 'member-uuid'
GROUP BY m.id;
```

### 17.2 Attendance Queries

```sql
-- Sunday service attendance for a specific date
SELECT 
    COUNT(*) AS total_attendance,
    COUNT(CASE WHEN ar.status = 'Present' THEN 1 END) AS present_count,
    ca.name AS campus_name
FROM attendance_record ar
JOIN campus ca ON ar.campus_id = ca.id
WHERE ar.church_id = 'church-uuid'
AND ar.attendance_date = '2024-12-25'
AND ar.service_type = 'Sunday Service'
GROUP BY ca.name;

-- Member attendance history
SELECT 
    ar.attendance_date,
    ar.service_type,
    ar.status,
    ar.check_in_time
FROM attendance_record ar
WHERE ar.member_id = 'member-uuid'
AND ar.deleted_at IS NULL
ORDER BY ar.attendance_date DESC
LIMIT 50;
```

### 17.3 Giving Queries

```sql
-- Monthly giving report
SELECT 
    DATE_TRUNC('month', donation_date) AS month,
    donation_type,
    COUNT(*) AS donation_count,
    SUM(amount) AS total_amount
FROM donation
WHERE church_id = 'church-uuid'
AND payment_status = 'Completed'
AND deleted_at IS NULL
GROUP BY DATE_TRUNC('month', donation_date), donation_type
ORDER BY month DESC, donation_type;

-- Top donors (not anonymous)
SELECT 
    m.first_name || ' ' || m.last_name AS donor_name,
    COUNT(d.id) AS donation_count,
    SUM(d.amount) AS total_given
FROM donation d
JOIN member m ON d.member_id = m.id
WHERE d.church_id = 'church-uuid'
AND d.is_anonymous = false
AND d.payment_status = 'Completed'
AND d.deleted_at IS NULL
AND d.donation_date >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY m.id, donor_name
ORDER BY total_given DESC
LIMIT 10;
```

### 17.4 Event Queries

```sql
-- Upcoming events
SELECT 
    e.id,
    e.title,
    e.category,
    e.start_date,
    e.location_name,
    ca.name AS campus_name,
    e.current_attendees,
    e.max_attendees
FROM event e
LEFT JOIN campus ca ON e.campus_id = ca.id
WHERE e.church_id = 'church-uuid'
AND e.status = 'Published'
AND e.start_date >= CURRENT_DATE
AND e.deleted_at IS NULL
ORDER BY e.start_date ASC;

-- Event registration list
SELECT 
    m.first_name || ' ' || m.last_name AS attendee_name,
    m.email,
    m.phone,
    er.registration_date,
    er.status,
    er.checked_in,
    er.number_of_guests
FROM event_registration er
JOIN member m ON er.member_id = m.id
WHERE er.event_id = 'event-uuid'
AND er.deleted_at IS NULL
ORDER BY er.registration_date;
```

---

## 18. Database Maintenance

### 18.1 Regular Maintenance Tasks

```sql
-- Vacuum and analyze (should be scheduled regularly)
VACUUM ANALYZE;

-- Reindex heavily used tables
REINDEX TABLE member;
REINDEX TABLE attendance_record;
REINDEX TABLE donation;

-- Update statistics
ANALYZE member;
ANALYZE attendance_record;
ANALYZE donation;
ANALYZE event;

-- Check for bloat
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS external_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 18.2 Monitoring Queries

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size(current_database()));

-- Table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size('public.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.'||tablename) DESC;

-- Active connections
SELECT 
    datname,
    count(*) AS connections
FROM pg_stat_activity
GROUP BY datname;

-- Long-running queries
SELECT 
    pid,
    now() - query_start AS duration,
    query
FROM pg_stat_activity
WHERE state = 'active'
AND now() - query_start > interval '5 minutes'
ORDER BY duration DESC;
```

---

## Conclusion

This database schema provides a comprehensive foundation for the ChurchAfrica church management system. It supports:

✅ **Multi-tenancy** with church isolation  
✅ **Member management** with families and relationships  
✅ **Attendance tracking** with flexible check-in methods  
✅ **Event management** with registration and capacity control  
✅ **Giving/donation tracking** with pledges and campaigns  
✅ **Real-time chat** with conversations and messages  
✅ **Role-based access control** with permissions  
✅ **Comprehensive audit trail** for all activities  
✅ **Performance optimization** with indexes and materialized views  
✅ **Data integrity** with constraints and triggers  

The schema is designed to scale with the needs of African churches, supporting both single-campus and multi-campus operations, with considerations for offline-first mobile applications and low-bandwidth environments.

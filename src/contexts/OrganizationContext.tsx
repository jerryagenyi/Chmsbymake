/**
 * Organization Context
 * Manages church/organization branding and settings
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Branch {
  id: string;
  name: string;
  shortName: string;
  address: string;
  city: string;
  country: string;
  isHeadquarters: boolean;
  contactEmail?: string;
  contactPhone?: string;
  capacity?: number;
}

export interface OrganizationProfile {
  id: string;
  name: string;
  abbreviation: string;
  mission: string;
  vision?: string;
  logo: string;
  primaryColor?: string;
  accentColor?: string;
  website?: string;
  email?: string;
  phone?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  branches: Branch[];
}

interface OrganizationContextType {
  organization: OrganizationProfile;
  currentBranch: Branch;
  updateOrganization: (updates: Partial<OrganizationProfile>) => void;
  updateBranch: (branchId: string, updates: Partial<Branch>) => void;
  setCurrentBranch: (branchId: string) => void;
  addBranch: (branch: Branch) => void;
  removeBranch: (branchId: string) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

// Default organization data for The OliveBrook Church
const defaultOrganization: OrganizationProfile = {
  id: 'org1',
  name: 'The OliveBrook Church',
  abbreviation: 'TOBC',
  mission: 'Making everyone who comes in contact with us be who God has created them to be.',
  vision: 'A thriving community of believers living out their God-given purpose',
  logo: 'figma:asset/9d1163839e7096c205b7e5081c4bdd76fc45aba3.png',
  primaryColor: '#1CE479',
  accentColor: '#0EA5E9',
  website: 'https://olivebrokchurch.org',
  email: 'info@olivebrookchurch.org',
  phone: '+234 XXX XXXX XXXX',
  socialMedia: {
    facebook: 'olivebrookchurch',
    instagram: 'olivebrookchurch',
    youtube: 'olivebrookchurch',
  },
  branches: [
    {
      id: 'b1',
      name: 'Kubwa Campus',
      shortName: 'Kubwa',
      address: 'Ignobis Hotels, Kubwa',
      city: 'Abuja',
      country: 'Nigeria',
      isHeadquarters: true,
      contactEmail: 'kubwa@olivebrookchurch.org',
      contactPhone: '+234 XXX XXXX XXXX',
      capacity: 500,
    },
    {
      id: 'b2',
      name: 'Wuse 2 Campus',
      shortName: 'Wuse 2',
      address: 'Wuse 2',
      city: 'Abuja',
      country: 'Nigeria',
      isHeadquarters: false,
      contactEmail: 'wuse2@olivebrookchurch.org',
      contactPhone: '+234 XXX XXXX XXXX',
      capacity: 300,
    },
  ],
};

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<OrganizationProfile>(defaultOrganization);
  const [currentBranchId, setCurrentBranchId] = useState<string>(
    organization.branches.find(b => b.isHeadquarters)?.id || organization.branches[0].id
  );

  const currentBranch = organization.branches.find(b => b.id === currentBranchId) || organization.branches[0];

  const updateOrganization = (updates: Partial<OrganizationProfile>) => {
    setOrganization(prev => ({ ...prev, ...updates }));
  };

  const updateBranch = (branchId: string, updates: Partial<Branch>) => {
    setOrganization(prev => ({
      ...prev,
      branches: prev.branches.map(b => 
        b.id === branchId ? { ...b, ...updates } : b
      ),
    }));
  };

  const setCurrentBranch = (branchId: string) => {
    setCurrentBranchId(branchId);
  };

  const addBranch = (branch: Branch) => {
    setOrganization(prev => ({
      ...prev,
      branches: [...prev.branches, branch],
    }));
  };

  const removeBranch = (branchId: string) => {
    setOrganization(prev => ({
      ...prev,
      branches: prev.branches.filter(b => b.id !== branchId),
    }));
  };

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        currentBranch,
        updateOrganization,
        updateBranch,
        setCurrentBranch,
        addBranch,
        removeBranch,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}
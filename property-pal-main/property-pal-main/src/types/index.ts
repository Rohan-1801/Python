export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  profileImage?: string;
  createdAt: Date;
}

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  propertyType: 'residential' | 'commercial' | 'industrial' | 'land';
  requirement: 'buy' | 'sell' | 'rent' | 'lease';
  budget: string;
  preferredLocation: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: string;
  status: 'not-started' | 'in-progress' | 'complete';
  source: 'website' | 'referral' | 'social-media' | 'advertisement' | 'other';
  notes: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LeadStatus = 'not-started' | 'in-progress' | 'complete';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  leadId?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: 'residential' | 'commercial' | 'industrial' | 'land';
  listingType: 'sale' | 'rent' | 'lease';
  price: number;
  priceUnit: 'total' | 'monthly' | 'yearly';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage: number;
  yearBuilt?: number;
  amenities: string[];
  photos: string[];
  status: 'available' | 'under-contract' | 'sold' | 'rented';
  availability: PropertyAvailability[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyAvailability {
  date: string;
  available: boolean;
  notes?: string;
}

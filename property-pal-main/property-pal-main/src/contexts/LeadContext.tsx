import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Lead } from '@/types';

interface LeadContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, lead: Partial<Lead>, onStatusChange?: (oldStatus: string, newStatus: string, leadName: string) => void) => void;
  deleteLead: (id: string) => void;
  getLead: (id: string) => Lead | undefined;
  getLeadStats: () => { notStarted: number; inProgress: number; complete: number };
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const useLead = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLead must be used within a LeadProvider');
  }
  return context;
};

interface LeadProviderProps {
  children: ReactNode;
}

const sampleLeads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '555-0101',
    dateOfBirth: '1985-03-15',
    propertyType: 'residential',
    requirement: 'buy',
    budget: '$500,000',
    preferredLocation: 'Downtown',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: '2000',
    status: 'in-progress',
    source: 'website',
    notes: 'Looking for a family home',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '555-0102',
    dateOfBirth: '1990-07-22',
    propertyType: 'commercial',
    requirement: 'lease',
    budget: '$10,000/month',
    preferredLocation: 'Business District',
    status: 'not-started',
    source: 'referral',
    notes: 'Office space for startup',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Davis',
    email: 'mdavis@email.com',
    phone: '555-0103',
    dateOfBirth: '1978-11-08',
    propertyType: 'residential',
    requirement: 'sell',
    budget: '$750,000',
    preferredLocation: 'Suburbs',
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: '3500',
    status: 'complete',
    source: 'advertisement',
    notes: 'Property sold successfully',
    address: '789 Pine Rd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '4',
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'emily.b@email.com',
    phone: '555-0104',
    dateOfBirth: '1995-02-28',
    propertyType: 'residential',
    requirement: 'rent',
    budget: '$2,500/month',
    preferredLocation: 'Near University',
    bedrooms: 2,
    bathrooms: 1,
    status: 'in-progress',
    source: 'social-media',
    notes: 'Graduate student looking for apartment',
    address: '321 College Blvd',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'r.wilson@email.com',
    phone: '555-0105',
    dateOfBirth: '1970-06-12',
    propertyType: 'land',
    requirement: 'buy',
    budget: '$200,000',
    preferredLocation: 'Rural Area',
    squareFootage: '50000',
    status: 'not-started',
    source: 'other',
    notes: 'Looking for farmland',
    address: '654 Country Ln',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
  },
];

export const LeadProvider: React.FC<LeadProviderProps> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    const stored = localStorage.getItem('pms_leads');
    return stored ? JSON.parse(stored) : sampleLeads;
  });

  useEffect(() => {
    localStorage.setItem('pms_leads', JSON.stringify(leads));
  }, [leads]);

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setLeads((prev) => [...prev, newLead]);
  };

  const updateLead = useCallback((
    id: string, 
    leadData: Partial<Lead>,
    onStatusChange?: (oldStatus: string, newStatus: string, leadName: string) => void
  ) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          // Check if status changed
          if (leadData.status && leadData.status !== lead.status && onStatusChange) {
            onStatusChange(lead.status, leadData.status, `${lead.firstName} ${lead.lastName}`);
          }
          return { ...lead, ...leadData, updatedAt: new Date() };
        }
        return lead;
      })
    );
  }, []);

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const getLead = (id: string) => {
    return leads.find((lead) => lead.id === id);
  };

  const getLeadStats = () => {
    return {
      notStarted: leads.filter((l) => l.status === 'not-started').length,
      inProgress: leads.filter((l) => l.status === 'in-progress').length,
      complete: leads.filter((l) => l.status === 'complete').length,
    };
  };

  return (
    <LeadContext.Provider
      value={{ leads, addLead, updateLead, deleteLead, getLead, getLeadStats }}
    >
      {children}
    </LeadContext.Provider>
  );
};

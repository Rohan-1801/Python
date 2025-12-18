import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Property } from '@/types';

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  getProperty: (id: string) => Property | undefined;
  getPropertyStats: () => { available: number; underContract: number; sold: number; rented: number };
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

interface PropertyProviderProps {
  children: ReactNode;
}

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Apartment',
    description: 'Stunning 2-bedroom apartment with city views, modern amenities, and walking distance to restaurants and entertainment.',
    propertyType: 'residential',
    listingType: 'rent',
    price: 2500,
    priceUnit: 'monthly',
    address: '123 Main Street, Apt 15B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 1200,
    yearBuilt: 2020,
    amenities: ['Gym', 'Pool', 'Parking', 'Doorman', 'Laundry'],
    photos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    status: 'available',
    availability: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Luxury Family Home',
    description: 'Beautiful 4-bedroom family home with a large backyard, updated kitchen, and excellent school district.',
    propertyType: 'residential',
    listingType: 'sale',
    price: 750000,
    priceUnit: 'total',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 3200,
    yearBuilt: 2015,
    amenities: ['Garage', 'Backyard', 'Central AC', 'Fireplace'],
    photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    status: 'available',
    availability: [],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    title: 'Prime Commercial Space',
    description: 'High-visibility retail space in a busy commercial district. Perfect for restaurants, retail, or office use.',
    propertyType: 'commercial',
    listingType: 'lease',
    price: 5000,
    priceUnit: 'monthly',
    address: '789 Business Blvd',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    squareFootage: 2500,
    yearBuilt: 2018,
    amenities: ['Street Parking', 'High Ceilings', 'Large Windows'],
    photos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
    status: 'under-contract',
    availability: [],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-20'),
  },
];

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    const stored = localStorage.getItem('pms_properties');
    return stored ? JSON.parse(stored) : sampleProperties;
  });

  useEffect(() => {
    localStorage.setItem('pms_properties', JSON.stringify(properties));
  }, [properties]);

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProperties((prev) => [...prev, newProperty]);
  };

  const updateProperty = (id: string, propertyData: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((property) =>
        property.id === id
          ? { ...property, ...propertyData, updatedAt: new Date() }
          : property
      )
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((property) => property.id !== id));
  };

  const getProperty = (id: string) => {
    return properties.find((property) => property.id === id);
  };

  const getPropertyStats = () => {
    return {
      available: properties.filter((p) => p.status === 'available').length,
      underContract: properties.filter((p) => p.status === 'under-contract').length,
      sold: properties.filter((p) => p.status === 'sold').length,
      rented: properties.filter((p) => p.status === 'rented').length,
    };
  };

  return (
    <PropertyContext.Provider
      value={{ properties, addProperty, updateProperty, deleteProperty, getProperty, getPropertyStats }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

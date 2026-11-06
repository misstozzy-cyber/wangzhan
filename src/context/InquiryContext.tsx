import React, { createContext, useContext, useState, useEffect } from 'react';
import { InquiryItem, LeadProfile, Product } from '../types/product';

interface InquiryContextValue {
  items: InquiryItem[];
  addItem: (product: Product, overrides?: Partial<InquiryItem>) => void;
  removeItem: (productId: string) => void;
  updateItem: (productId: string, patch: Partial<InquiryItem>) => void;
  clearBasket: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  leadProfile: LeadProfile | null;
  saveLeadProfile: (lead: Omit<LeadProfile, 'unlockedAt'>) => void;
}

const STORAGE_BASKET_KEY = 'tyria_rfq_basket_v1';
const STORAGE_LEAD_KEY = 'tyria_designer_lead_v1';

const InquiryContext = createContext<InquiryContextValue | undefined>(undefined);

export const InquiryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<InquiryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BASKET_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [leadProfile, setLeadProfile] = useState<LeadProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEAD_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BASKET_KEY, JSON.stringify(items));
    } catch {
      // ignore storage quota errors
    }
  }, [items]);

  const addItem = (product: Product, overrides?: Partial<InquiryItem>) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.productId === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...overrides,
          qty: updated[existingIdx].qty + (overrides?.qty ?? 1),
        };
        return updated;
      }
      const defaultCct = product.cctOptions[0] || '3000K';
      const defaultWatt = product.wattOptions[0] ? `${product.wattOptions[0]}W/m` : '10W/m';
      return [
        ...prev,
        {
          productId: product.id,
          model: product.model,
          itemNo: product.itemNo,
          family: product.family,
          cct: overrides?.cct || defaultCct,
          wattage: overrides?.wattage || defaultWatt,
          lengthM: overrides?.lengthM ?? 50,
          qty: overrides?.qty ?? 1,
          cableEntry: overrides?.cableEntry || 'Front',
          note: overrides?.note || '',
        },
      ];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateItem = (productId: string, patch: Partial<InquiryItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, ...patch } : item))
    );
  };

  const clearBasket = () => setItems([]);

  const saveLeadProfile = (lead: Omit<LeadProfile, 'unlockedAt'>) => {
    const profile: LeadProfile = {
      ...lead,
      unlockedAt: new Date().toISOString(),
    };
    setLeadProfile(profile);
    try {
      localStorage.setItem(STORAGE_LEAD_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  };

  return (
    <InquiryContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        clearBasket,
        isDrawerOpen,
        setIsDrawerOpen,
        leadProfile,
        saveLeadProfile,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
};

export function useInquiry(): InquiryContextValue {
  const ctx = useContext(InquiryContext);
  if (!ctx) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return ctx;
}

export interface PhotometricEntry {
  label: string;
  filename: string;
  cct: string;
  watt: string;
  url: string;
  productId?: string;
  model?: string;
  itemNo?: string;
  family?: string;
  series?: string;
}

export interface Product {
  id: string;
  family: 'LED Neon Flex' | 'LED Strip' | 'Flex LED Sheet' | 'Flexible Wall Grazer' | string;
  familySlug: 'neon-flex' | 'led-strip' | 'led-sheet' | 'wall-grazer' | string;
  series: string;
  seriesSlug: string;
  model: string;
  itemNo: string;
  size: {
    w: number;
    h: number;
  };
  view: 'TV' | 'SV' | '360' | '3D' | 'Dome' | 'Dual' | 'Embedded' | 'Anti-Glare' | 'Corner' | 'Strip' | 'COB' | 'Sheet' | 'Grazer' | string;
  voltage: string;
  wattOptions: number[];
  maxLumen: number;
  efficacy: number;
  ledType: string;
  ledsPerM: number;
  cri: string;
  sdcm: string;
  cctOptions: string[];
  ip: string;
  minBendRadius: number;
  minBendDiameter: number;
  cutUnit: string;
  maxRun: string;
  warranty: string;
  controls: string[];
  pitch: string;
  features: string[];
  images: {
    hero: string;
    section: string;
    curve: string;
    detail: string[];
  };
  downloads: {
    datasheet: string;
    ies: PhotometricEntry[];
    ldt: PhotometricEntry[];
    report: PhotometricEntry[];
  };
}

export interface CatalogItem {
  id: string;
  title: string;
  filename: string;
  pages: number;
  category: string;
  highlight: string;
  url: string;
}

export interface FactoryAsset {
  id: string;
  title: string;
  image: string;
}

export interface InquiryItem {
  productId: string;
  model: string;
  itemNo: string;
  family: string;
  cct: string;
  wattage: string;
  lengthM: number;
  qty: number;
  cableEntry: 'Front' | 'Side' | 'Bottom' | 'Standard';
  note: string;
}

export interface LeadProfile {
  name: string;
  company: string;
  email: string;
  unlockedAt: string;
}

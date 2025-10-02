// أنواع البيانات لحزم الخدمات
export interface ServicePackage {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  level: 'foundation' | 'standard' | 'certified';
  price: number;
  duration: string;
  deliverables: string[];
  kpis: string[];
  governance: string[];
  inputs: string[];
  outputs: ServiceOutput[];
}

export interface ServiceOutput {
  type: 'document' | 'spreadsheet' | 'presentation' | 'dashboard' | 'template';
  name: string;
  description: string;
  format: string;
}

export interface ServiceDepartment {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  pillars: string[];
  packages: ServicePackage[];
  kpis: string[];
  governance: {
    frequency: string;
    reviews: string[];
  };
}

export interface ServiceRequest {
  departmentId: string;
  packageId: string;
  inputs: Record<string, any>;
  projectContext: {
    name: string;
    sector: string;
    location: string;
    budget: number;
    timeline: string;
  };
}

export interface ServiceResult {
  success: boolean;
  data?: any;
  files?: {
    json: string;
    excel?: string;
    pdf?: string;
    presentation?: string;
  };
  error?: string;
  recommendations?: string[];
  nextSteps?: string[];
}
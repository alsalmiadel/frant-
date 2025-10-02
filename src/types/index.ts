export interface Project {
  id: string;
  title: string;
  description: string;
  type: 'commercial' | 'tech' | 'service' | 'delivery';
  city: string;
  goal: 'funding' | 'development' | 'analysis' | 'marketing';
  status: 'analyzing' | 'completed' | 'saved';
  createdAt: Date;
}

export interface Analysis {
  feasibility: {
    swot: string;
    market: string;
    costs: string;
    profitability: string;
  };
  marketing: {
    campaigns: string;
    audience: string;
    platforms: string;
  };
  financial: {
    cashFlow: string;
    breakeven: string;
  };
  code?: string;
  esg: {
    sustainability: string;
    social: string;
  };
}

export interface Subscription {
  type: 'lite' | 'pro' | 'business';
  price: number;
  features: string[];
}
// Google Analytics 4 Integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  initialize(measurementId: string) {
    if (this.isInitialized || !measurementId) return;

    // تحميل Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // تهيئة gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_title: 'SmartStartAI',
      page_location: window.location.href,
      custom_map: {
        'custom_parameter_1': 'user_type'
      }
    });

    this.isInitialized = true;
  }

  // تتبع الأحداث المطلوبة
  trackLocationAnalysis(data: { lat: number; lng: number; competitors_found: number }) {
    if (!this.isInitialized) return;
    
    window.gtag('event', 'analyze_location', {
      event_category: 'Location Analysis',
      event_label: 'User analyzed location',
      custom_parameters: {
        latitude: data.lat,
        longitude: data.lng,
        competitors_count: data.competitors_found
      }
    });
  }

  trackFeasibilityRequest(data: { project_type: string; investment: number }) {
    if (!this.isInitialized) return;
    
    window.gtag('event', 'request_feasibility', {
      event_category: 'Feasibility Study',
      event_label: 'User requested feasibility study',
      value: data.investment,
      custom_parameters: {
        project_type: data.project_type,
        investment_amount: data.investment
      }
    });
  }

  trackFeasibilityDownload(data: { project_name: string; file_format: string }) {
    if (!this.isInitialized) return;
    
    window.gtag('event', 'download_feasibility_zip', {
      event_category: 'Download',
      event_label: 'User downloaded feasibility ZIP',
      custom_parameters: {
        project_name: data.project_name,
        file_format: data.file_format
      }
    });
  }

  trackBlogView(slug: string) {
    if (!this.isInitialized) return;
    
    window.gtag('event', 'blog_view', {
      event_category: 'Blog',
      event_label: 'User viewed blog index',
      custom_parameters: {
        page_type: 'blog_index'
      }
    });
  }

  trackBlogPostOpen(data: { slug: string; title: string }) {
    if (!this.isInitialized) return;
    
    window.gtag('event', 'blog_post_open', {
      event_category: 'Blog',
      event_label: 'User opened blog post',
      custom_parameters: {
        post_slug: data.slug,
        post_title: data.title
      }
    });
  }

  trackVoiceToggle(enabled: boolean) {
    if (!this.isInitialized) return;
    
    window.gtag('event', enabled ? 'voice_toggle_on' : 'voice_toggle_off', {
      event_category: 'Voice Interaction',
      event_label: enabled ? 'Voice enabled' : 'Voice disabled',
      custom_parameters: {
        voice_state: enabled ? 'enabled' : 'disabled'
      }
    });
  }

  trackPageView(page: string) {
    if (!this.isInitialized) return;
    
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: page,
      page_location: window.location.href
    });
  }

  trackUserEngagement(action: string, details?: any) {
    if (!this.isInitialized) return;
    
    window.gtag('event', 'engagement', {
      event_category: 'User Engagement',
      event_label: action,
      custom_parameters: details || {}
    });
  }
}

export const analytics = AnalyticsService.getInstance();

// تهيئة تلقائية إذا كان GA_MEASUREMENT_ID متاح
if (typeof window !== 'undefined' && import.meta.env.VITE_GA_MEASUREMENT_ID) {
  analytics.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
}
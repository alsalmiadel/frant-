import { ServiceDepartment } from '../types/services';

export const serviceDepartments: ServiceDepartment[] = [
  {
    id: 'strategy',
    name: 'الإدارة والاستراتيجية',
    nameEn: 'Strategy & Management',
    icon: '📈',
    color: 'from-saudi-green to-tech-blue',
    pillars: [
      'رؤية/رسالة/NSM',
      'TAM/SAM/SOM/بورتر',
      'ميزة مستدامة',
      'Operating Model',
      'خارطة 12-18 شهر',
      'OKRs',
      'مخاطر/PDPL'
    ],
    packages: [
      {
        id: 'foundation',
        name: 'تأسيسي',
        nameEn: 'Foundation',
        description: 'الأساسيات الاستراتيجية للبدء',
        level: 'foundation',
        price: 2500,
        duration: '5-7 أيام',
        deliverables: [
          'Strategy One-Pager',
          'SWOT مختصر',
          '3 OKRs رئيسية',
          'خارطة ربع سنوية'
        ],
        kpis: ['تحقيق OKRs', 'سرعة القرار'],
        governance: ['مراجعة شهرية', 'تقييم ربع سنوي'],
        inputs: ['قطاع', 'نموذج ربحي', 'شرائح', 'أهداف'],
        outputs: [
          {
            type: 'document',
            name: 'الخطة الاستراتيجية',
            description: 'وثيقة شاملة للاستراتيجية',
            format: 'PDF'
          },
          {
            type: 'spreadsheet',
            name: 'مصفوفة OKRs',
            description: 'جدول متابعة الأهداف',
            format: 'Excel'
          }
        ]
      },
      {
        id: 'standard',
        name: 'قياسي',
        nameEn: 'Standard',
        description: 'تحليل متقدم مع أدوات إدارية',
        level: 'standard',
        price: 7500,
        duration: '10-14 يوم',
        deliverables: [
          'KPI Tree',
          'مصفوفة مخاطر',
          'Decision Log',
          'RACI Matrix',
          'CapEx/Opex عالية المستوى'
        ],
        kpis: ['% إنجاز المبادرات', 'صافي الأثر'],
        governance: ['مراجعة أسبوعية', 'تقييم شهري'],
        inputs: ['قيود', 'منافسون', 'موارد', 'مخاطر'],
        outputs: [
          {
            type: 'dashboard',
            name: 'لوحة KPIs',
            description: 'مؤشرات الأداء التفاعلية',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'مصفوفة المخاطر',
            description: 'تحليل وإدارة المخاطر',
            format: 'PDF'
          }
        ]
      },
      {
        id: 'certified',
        name: 'معتمد',
        nameEn: 'Certified',
        description: 'حلول استراتيجية متكاملة للمؤسسات',
        level: 'certified',
        price: 15000,
        duration: '20-30 يوم',
        deliverables: [
          'Portfolio Scorecard',
          'خطة رأس المال',
          'QBR Pack/Board Pack',
          'امتثال كامل'
        ],
        kpis: ['ROI الاستراتيجي', 'مؤشر النضج التنظيمي'],
        governance: ['مراجعة أسبوعية', 'تقييم ربع سنوي', 'مراجعة سنوية'],
        inputs: ['استراتيجية حالية', 'ميزانية', 'فريق إدارة'],
        outputs: [
          {
            type: 'presentation',
            name: 'عرض مجلس الإدارة',
            description: 'عرض تقديمي للإدارة العليا',
            format: 'PowerPoint'
          },
          {
            type: 'dashboard',
            name: 'Portfolio Scorecard',
            description: 'لوحة متابعة المحفظة',
            format: 'Excel'
          }
        ]
      }
    ],
    kpis: ['تحقيق OKRs', 'سرعة القرار', '% إنجاز المبادرات', 'صافي الأثر'],
    governance: {
      frequency: 'شهري تشغيل، ربع سنوي مراجعة استراتيجية',
      reviews: ['مراجعة شهرية', 'تقييم ربع سنوي', 'مراجعة سنوية']
    }
  },
  {
    id: 'marketing',
    name: 'التسويق والنمو',
    nameEn: 'Marketing & Growth',
    icon: '🎯',
    color: 'from-saudi-gold to-saudi-green',
    pillars: [
      'STP',
      'Value Prop',
      'Channel Mix',
      'Funnel/Lifecycle',
      'Budget/Attribution',
      'محتوى 90 يوم',
      'قياس'
    ],
    packages: [
      {
        id: 'foundation',
        name: 'تأسيسي',
        nameEn: 'Foundation',
        description: 'استراتيجية تسويقية أساسية',
        level: 'foundation',
        price: 3000,
        duration: '7-10 أيام',
        deliverables: [
          'Channel Mix',
          'تقويم 90 يوم',
          '3 صفحات هبوط',
          'قياس بسيط'
        ],
        kpis: ['CAC', 'LTV', 'ROAS'],
        governance: ['مراجعة أسبوعية', 'تحسين شهري'],
        inputs: ['قطاع/منطقة', 'ميزانية', 'كلمات مفتاحية'],
        outputs: [
          {
            type: 'document',
            name: 'استراتيجية التسويق',
            description: 'خطة تسويقية شاملة',
            format: 'PDF'
          },
          {
            type: 'spreadsheet',
            name: 'تقويم المحتوى',
            description: 'جدولة المحتوى 90 يوم',
            format: 'Excel'
          }
        ]
      },
      {
        id: 'standard',
        name: 'قياسي',
        nameEn: 'Standard',
        description: 'تسويق متقدم مع تحليلات',
        level: 'standard',
        price: 8500,
        duration: '14-21 يوم',
        deliverables: [
          'AARRR Framework',
          'Backlog A/B Testing',
          'استراتيجية مؤثرين',
          'قوالب رسائل/إعلانات',
          'لوحة CAC/LTV/ROAS/CR'
        ],
        kpis: ['CTR', 'Conversion Rate', 'Retention'],
        governance: ['تحسين أسبوعي', 'مراجعة قنوات شهرية'],
        inputs: ['سلة/هوامش', 'مواسم', 'منافسين'],
        outputs: [
          {
            type: 'dashboard',
            name: 'لوحة التسويق',
            description: 'مؤشرات التسويق التفاعلية',
            format: 'Excel'
          },
          {
            type: 'template',
            name: 'قوالب الحملات',
            description: 'قوالب جاهزة للحملات',
            format: 'PowerPoint'
          }
        ]
      },
      {
        id: 'certified',
        name: 'معتمد',
        nameEn: 'Certified',
        description: 'تسويق احترافي متكامل',
        level: 'certified',
        price: 18000,
        duration: '30-45 يوم',
        deliverables: [
          'Budget Reallocation ديناميكي',
          'SEO تقني/محتوى طويل',
          'Brand Lift',
          'إسناد متعدد اللمسات'
        ],
        kpis: ['Brand Awareness', 'Market Share', 'Customer Lifetime Value'],
        governance: ['تحسين يومي', 'مراجعة أسبوعية', 'تقييم شهري'],
        inputs: ['بيانات تاريخية', 'ميزانية متقدمة', 'فريق تسويق'],
        outputs: [
          {
            type: 'dashboard',
            name: 'Attribution Dashboard',
            description: 'لوحة الإسناد المتقدمة',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'Brand Strategy',
            description: 'استراتيجية العلامة التجارية',
            format: 'PDF'
          }
        ]
      }
    ],
    kpis: ['CAC', 'LTV', 'ROAS', 'CTR', 'Conversion', 'Retention'],
    governance: {
      frequency: 'أسبوعي تحسين، شهري مراجعة قنوات',
      reviews: ['تحسين أسبوعي', 'مراجعة قنوات شهرية']
    }
  },
  {
    id: 'sales',
    name: 'المبيعات وتطوير الأعمال',
    nameEn: 'Sales & Business Development',
    icon: '💼',
    color: 'from-tech-blue to-saudi-gold',
    pillars: [
      'ICP/Segments',
      'تسعير/باقات',
      'CRM Stages',
      'Enablement',
      'Forecast',
      'شراكات'
    ],
    packages: [
      {
        id: 'foundation',
        name: 'تأسيسي',
        nameEn: 'Foundation',
        description: 'أساسيات المبيعات والعملاء',
        level: 'foundation',
        price: 2800,
        duration: '5-7 أيام',
        deliverables: [
          'ICP محدد',
          'مراحل CRM بمعايير',
          'سكربت اتصال',
          'قوالب بريد/واتساب'
        ],
        kpis: ['Pipeline Coverage', 'Win Rate'],
        governance: ['متابعة أسبوعية', 'مراجعة شهرية'],
        inputs: ['قطاعات', 'دورة مبيعات', 'باقات'],
        outputs: [
          {
            type: 'document',
            name: 'دليل المبيعات',
            description: 'دليل شامل لعملية المبيعات',
            format: 'PDF'
          },
          {
            type: 'template',
            name: 'قوالب التواصل',
            description: 'قوالب جاهزة للتواصل',
            format: 'Word'
          }
        ]
      },
      {
        id: 'standard',
        name: 'قياسي',
        nameEn: 'Standard',
        description: 'نظام مبيعات متقدم',
        level: 'standard',
        price: 9000,
        duration: '14-21 يوم',
        deliverables: [
          'MEDDICC/SPICED Framework',
          'Playbooks مفصلة',
          'برنامج شركاء بسيط',
          'Forecast شهري',
          'لوحة Win Rate/Sales Cycle/ACV'
        ],
        kpis: ['Sales Cycle', 'ACV', 'Pipeline Velocity'],
        governance: ['متابعة أسبوعية', 'Forecast شهري'],
        inputs: ['قنوات مباشرة/شركاء', 'تاريخ مبيعات'],
        outputs: [
          {
            type: 'dashboard',
            name: 'لوحة المبيعات',
            description: 'مؤشرات المبيعات التفاعلية',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'Playbook المبيعات',
            description: 'دليل عمليات المبيعات',
            format: 'PDF'
          }
        ]
      },
      {
        id: 'certified',
        name: 'معتمد',
        nameEn: 'Certified',
        description: 'نظام مبيعات احترافي متكامل',
        level: 'certified',
        price: 20000,
        duration: '30-45 يوم',
        deliverables: [
          'تسعير مُفرّق',
          'اتفاقيات شراكة',
          'Deal Desk (خصومات/اعتمادات)',
          'Role-plays متقدمة'
        ],
        kpis: ['ARR Growth', 'Partner Revenue %', 'Deal Size'],
        governance: ['متابعة يومية', 'مراجعة أسبوعية', 'QBR'],
        inputs: ['استراتيجية شراكات', 'هيكل تسعير معقد'],
        outputs: [
          {
            type: 'dashboard',
            name: 'Revenue Operations',
            description: 'لوحة عمليات الإيرادات',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'Partner Program',
            description: 'برنامج الشراكات المتكامل',
            format: 'PDF'
          }
        ]
      }
    ],
    kpis: ['Pipeline 3×-4×', 'Win Rate', 'Sales Cycle', 'ACV/ARR', 'Loss Reasons'],
    governance: {
      frequency: 'أسبوعي بايبلاين، شهري Forecast',
      reviews: ['متابعة أسبوعية', 'Forecast شهري', 'QBR ربع سنوي']
    }
  },
  {
    id: 'financial',
    name: 'المالية',
    nameEn: 'Finance',
    icon: '💰',
    color: 'from-saudi-green to-saudi-gold',
    pillars: [
      'Unit Economics',
      'P&L شهري',
      'FCF',
      'NWC/CCC',
      'CapEx/Opex',
      'حساسية/سيناريوهات',
      'Break-even'
    ],
    packages: [
      {
        id: 'foundation',
        name: 'تأسيسي',
        nameEn: 'Foundation',
        description: 'النموذج المالي الأساسي',
        level: 'foundation',
        price: 3500,
        duration: '7-10 أيام',
        deliverables: [
          'P&L 12 شهر',
          'Break-even Analysis',
          'FCF مبسّط',
          'KPIs (مجمل/تشغيلي، CAC Payback)'
        ],
        kpis: ['Gross Margin', 'Operating Margin', 'Break-even'],
        governance: ['مراجعة شهرية', 'تقييم ربع سنوي'],
        inputs: ['أسعار/حجم', 'تكاليف', 'رواتب'],
        outputs: [
          {
            type: 'spreadsheet',
            name: 'النموذج المالي',
            description: 'نموذج مالي تفاعلي',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'تحليل التعادل',
            description: 'تحليل نقطة التعادل',
            format: 'PDF'
          }
        ]
      },
      {
        id: 'standard',
        name: 'قياسي',
        nameEn: 'Standard',
        description: 'تحليل مالي متقدم',
        level: 'standard',
        price: 12000,
        duration: '14-21 يوم',
        deliverables: [
          '36-60 شهر توقعات',
          '3 سيناريوهات',
          'تحليل حساسية',
          'CapEx/تمويل',
          'NWC مفصّل'
        ],
        kpis: ['NPV', 'IRR', 'Payback Period', 'CCC'],
        governance: ['إقفال شهري', 'مراجعة ربع سنوية'],
        inputs: ['إيجار/طاقة', 'ضريبة', 'استهلاك/إطفاء'],
        outputs: [
          {
            type: 'spreadsheet',
            name: 'النموذج المالي المتقدم',
            description: 'نموذج مالي شامل مع سيناريوهات',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'تحليل الاستثمار',
            description: 'تحليل جدوى الاستثمار',
            format: 'PDF'
          }
        ]
      },
      {
        id: 'certified',
        name: 'معتمد',
        nameEn: 'Certified',
        description: 'نموذج مالي مصرفي احترافي',
        level: 'certified',
        price: 25000,
        duration: '30-45 يوم',
        deliverables: [
          'Excel «مصرفي» متكامل',
          'تحليل حساسية متقدم',
          'نمذجة مونت كارلو',
          'تقرير استثماري معتمد'
        ],
        kpis: ['Risk-adjusted NPV', 'Scenario Probability', 'Stress Test Results'],
        governance: ['مراجعة أسبوعية', 'تقييم شهري', 'مراجعة استثمارية ربع سنوية'],
        inputs: ['بيانات تاريخية', 'مخاطر السوق', 'معايير الصناعة'],
        outputs: [
          {
            type: 'spreadsheet',
            name: 'النموذج المصرفي',
            description: 'نموذج مالي معتمد للبنوك',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'تقرير الاستثمار',
            description: 'تقرير معتمد للمستثمرين',
            format: 'PDF'
          }
        ]
      }
    ],
    kpis: ['مجمل/تشغيلي', 'NPV/IRR', 'Payback', 'CCC'],
    governance: {
      frequency: 'شهري إقفال، ربع سنوي مراجعة استثمارية',
      reviews: ['إقفال شهري', 'مراجعة ربع سنوية', 'مراجعة استثمارية']
    }
  },
  {
    id: 'operations',
    name: 'العمليات',
    nameEn: 'Operations',
    icon: '⚙️',
    color: 'from-gray-600 to-gray-800',
    pillars: [
      'خريطة عمليات',
      'SOPs/Checklists',
      'Capacity/Utilization',
      'QA/QC',
      'سلسلة إمداد',
      'أتمتة'
    ],
    packages: [
      {
        id: 'foundation',
        name: 'تأسيسي',
        nameEn: 'Foundation',
        description: 'العمليات الأساسية',
        level: 'foundation',
        price: 2200,
        duration: '5-7 أيام',
        deliverables: [
          'SOPs يومي/أسبوعي/شهري',
          'مؤشرات جودة',
          'خطة توريد أساسية'
        ],
        kpis: ['Lead Time', 'Quality Score'],
        governance: ['مراجعة يومية', 'تقييم أسبوعي'],
        inputs: ['من الطلب للتسليم', 'أزمنة', 'معدل طلب'],
        outputs: [
          {
            type: 'document',
            name: 'دليل العمليات',
            description: 'دليل شامل للعمليات',
            format: 'PDF'
          },
          {
            type: 'template',
            name: 'Checklists التشغيل',
            description: 'قوائم فحص يومية',
            format: 'Excel'
          }
        ]
      },
      {
        id: 'standard',
        name: 'قياسي',
        nameEn: 'Standard',
        description: 'إدارة عمليات متقدمة',
        level: 'standard',
        price: 7800,
        duration: '14-21 يوم',
        deliverables: [
          'Capacity/Utilization Planning',
          'مناوبات محسنة',
          'QC Cards',
          'لوحة Lead Time/OTD/Defect',
          'MSA مبسّط'
        ],
        kpis: ['OTD/OTIF', 'Defect Rate', 'Utilization'],
        governance: ['تشغيل يومي', 'S&OP شهري'],
        inputs: ['موردون/مخزون', 'معايير جودة'],
        outputs: [
          {
            type: 'dashboard',
            name: 'لوحة العمليات',
            description: 'مؤشرات العمليات التفاعلية',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'خطة الجودة',
            description: 'نظام إدارة الجودة',
            format: 'PDF'
          }
        ]
      },
      {
        id: 'certified',
        name: 'معتمد',
        nameEn: 'Certified',
        description: 'تميز تشغيلي متكامل',
        level: 'certified',
        price: 16000,
        duration: '30-45 يوم',
        deliverables: [
          'S&OP شهري',
          'إدارة مخزون (Min/Max/ABC/ROP)',
          'تدقيق مورّدين',
          'مخاطر الإمداد',
          'فرص RPA/تكامل'
        ],
        kpis: ['Perfect Order Rate', 'Inventory Turns', 'Supplier Performance'],
        governance: ['تشغيل يومي', 'S&OP شهري', 'مراجعة ربع سنوية'],
        inputs: ['بيانات تاريخية', 'شبكة موردين', 'متطلبات أتمتة'],
        outputs: [
          {
            type: 'dashboard',
            name: 'S&OP Dashboard',
            description: 'لوحة التخطيط والعمليات',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'استراتيجية الإمداد',
            description: 'استراتيجية سلسلة الإمداد',
            format: 'PDF'
          }
        ]
      }
    ],
    kpis: ['Lead Time', 'OTD/OTIF', 'Defect/FPY', 'Utilization', 'COGS/وحدة'],
    governance: {
      frequency: 'يومي تشغيل، شهري S&OP',
      reviews: ['تشغيل يومي', 'S&OP شهري', 'مراجعة ربع سنوية']
    }
  },
  {
    id: 'hr',
    name: 'الموارد البشرية',
    nameEn: 'Human Resources',
    icon: '👥',
    color: 'from-purple-500 to-pink-500',
    pillars: [
      'تصميم تنظيمي',
      'توظيف',
      'تعويضات',
      'أداء/كفاءات',
      'L&D',
      'ثقافة/سياسات'
    ],
    packages: [
      {
        id: 'foundation',
        name: 'تأسيسي',
        nameEn: 'Foundation',
        description: 'أساسيات الموارد البشرية',
        level: 'foundation',
        price: 2000,
        duration: '5-7 أيام',
        deliverables: [
          'هيكل تنظيمي مقترح',
          'خطة توظيف 6-12 شهر',
          'قوالب JD',
          'سياسة عمل أساسية',
          'دورة أداء نصف سنوية'
        ],
        kpis: ['Time-to-Hire', 'Employee Satisfaction'],
        governance: ['مراجعة شهرية', 'تقييم ربع سنوي'],
        inputs: ['أهداف', 'أدوار حرجة', 'رواتب سوق'],
        outputs: [
          {
            type: 'document',
            name: 'دليل الموظف',
            description: 'دليل شامل للموظفين',
            format: 'PDF'
          },
          {
            type: 'template',
            name: 'نماذج التوظيف',
            description: 'نماذج جاهزة للتوظيف',
            format: 'Word'
          }
        ]
      },
      {
        id: 'standard',
        name: 'قياسي',
        nameEn: 'Standard',
        description: 'إدارة موارد بشرية متقدمة',
        level: 'standard',
        price: 6500,
        duration: '14-21 يوم',
        deliverables: [
          'Competency Matrix',
          'سلم درجات/رواتب',
          'Onboarding 30/60/90',
          'خطة L&D',
          'eNPS Survey'
        ],
        kpis: ['Retention Rate', 'eNPS', 'Training ROI'],
        governance: ['توظيف أسبوعي', 'أداء ربع سنوي'],
        inputs: ['سياسات محلية', 'مستويات خبرة'],
        outputs: [
          {
            type: 'dashboard',
            name: 'لوحة الموارد البشرية',
            description: 'مؤشرات الموارد البشرية',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'استراتيجية المواهب',
            description: 'استراتيجية إدارة المواهب',
            format: 'PDF'
          }
        ]
      },
      {
        id: 'certified',
        name: 'معتمد',
        nameEn: 'Certified',
        description: 'تميز في إدارة المواهب',
        level: 'certified',
        price: 14000,
        duration: '30-45 يوم',
        deliverables: [
          'Workforce Planning',
          '9-Box Talent Review',
          'مكافآت مرتبطة بـOKRs',
          'خطة تعاقب وظيفي'
        ],
        kpis: ['Talent Pipeline Strength', 'Succession Readiness', 'Performance Distribution'],
        governance: ['توظيف أسبوعي', 'أداء ربع سنوي', 'تعاقب سنوي'],
        inputs: ['استراتيجية المواهب', 'ميزانية تطوير'],
        outputs: [
          {
            type: 'dashboard',
            name: 'Talent Analytics',
            description: 'تحليلات المواهب المتقدمة',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'خطة التعاقب',
            description: 'خطة التعاقب الوظيفي',
            format: 'PDF'
          }
        ]
      }
    ],
    kpis: ['Time-to-Hire', 'Offer Acceptance', 'Retention 12m', 'eNPS', 'Span of Control'],
    governance: {
      frequency: 'أسبوعي توظيف، ربع سنوي أداء/تعاقب',
      reviews: ['توظيف أسبوعي', 'أداء ربع سنوي', 'تعاقب سنوي']
    }
  },
  {
    id: 'legal',
    name: 'القانوني والامتثال',
    nameEn: 'Legal & Compliance',
    icon: '⚖️',
    color: 'from-indigo-500 to-blue-600',
    pillars: [
      'تراخيص',
      'عقود أساسية',
      'PDPL',
      'امتثال قطاعي',
      'IP',
      'مراجعة دورية'
    ],
    packages: [
      {
        id: 'foundation',
        name: 'تأسيسي',
        nameEn: 'Foundation',
        description: 'الامتثال الأساسي (إرشادي)',
        level: 'foundation',
        price: 1800,
        duration: '3-5 أيام',
        deliverables: [
          'قائمة تراخيص/وثائق',
          'سياسات داخلية (خصوصية/AUP/سرية)',
          'فهرس عقود أساسي'
        ],
        kpis: ['اكتمال التراخيص', 'الامتثال الأساسي'],
        governance: ['مراجعة شهرية', 'تحديث ربع سنوي'],
        inputs: ['نوع النشاط', 'الموقع', 'حجم الفريق'],
        outputs: [
          {
            type: 'document',
            name: 'دليل الامتثال',
            description: 'دليل الامتثال القانوني',
            format: 'PDF'
          },
          {
            type: 'template',
            name: 'قوالب العقود',
            description: 'قوالب العقود الأساسية',
            format: 'Word'
          }
        ]
      },
      {
        id: 'standard',
        name: 'قياسي',
        nameEn: 'Standard',
        description: 'امتثال متقدم مع مراقبة',
        level: 'standard',
        price: 5500,
        duration: '10-14 يوم',
        deliverables: [
          'مصفوفة امتثال RACI',
          'جدول مراجعات دورية',
          'فحص PDPL readiness',
          'DPA للمورّدين'
        ],
        kpis: ['نتائج التدقيق', 'زمن الاستجابة لطلبات البيانات'],
        governance: ['مراجعة شهرية', 'تدقيق ربع سنوي'],
        inputs: ['عقود حالية', 'سياسات', 'مخاطر قانونية'],
        outputs: [
          {
            type: 'dashboard',
            name: 'لوحة الامتثال',
            description: 'مؤشرات الامتثال',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'تقرير PDPL',
            description: 'تقرير امتثال حماية البيانات',
            format: 'PDF'
          }
        ]
      },
      {
        id: 'certified',
        name: 'معتمد',
        nameEn: 'Certified',
        description: 'امتثال مؤسسي شامل',
        level: 'certified',
        price: 12000,
        duration: '21-30 يوم',
        deliverables: [
          'خطة احتفاظ/تدمير',
          'مصفوفة مخاطر قانونية',
          'إرشاد عقود مورّدين',
          'سير تدقيق داخلي'
        ],
        kpis: ['Risk Mitigation Score', 'Audit Readiness', 'Contract Compliance'],
        governance: ['مراجعة شهرية', 'تدقيق ربع سنوي', 'مراجعة سنوية'],
        inputs: ['استراتيجية المخاطر', 'متطلبات تنظيمية'],
        outputs: [
          {
            type: 'dashboard',
            name: 'Risk Dashboard',
            description: 'لوحة إدارة المخاطر',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'خطة إدارة المخاطر',
            description: 'خطة شاملة لإدارة المخاطر',
            format: 'PDF'
          }
        ]
      }
    ],
    kpis: ['اكتمال تراخيص', 'نتائج تدقيق', 'زمن استجابة لطلبات بيانات'],
    governance: {
      frequency: 'مراجعة قانونية محلية قبل الإيداع/التعاقد',
      reviews: ['مراجعة شهرية', 'تدقيق ربع سنوي', 'مراجعة سنوية']
    }
  },
  {
    id: 'product',
    name: 'المنتج والتقنية',
    nameEn: 'Product & Technology',
    icon: '💻',
    color: 'from-green-500 to-teal-500',
    pillars: [
      'PRD',
      'خارطة طريق',
      'هندسة/تقنيات',
      'أمن معلومات',
      'خصوصية/امتثال',
      'مراقبة/موثوقية SLO'
    ],
    packages: [
      {
        id: 'foundation',
        name: 'تأسيسي',
        nameEn: 'Foundation',
        description: 'أساسيات تطوير المنتج',
        level: 'foundation',
        price: 4000,
        duration: '7-10 أيام',
        deliverables: [
          'PRD مختصر',
          'خطة MVP',
          'Product Backlog',
          'بنية تقنية بسيطة',
          'قائمة أمن أساسية'
        ],
        kpis: ['Feature Completion', 'Bug Rate'],
        governance: ['Sprint أسبوعي', 'مراجعة شهرية'],
        inputs: ['متطلبات المنتج', 'قيود تقنية', 'ميزانية'],
        outputs: [
          {
            type: 'document',
            name: 'مواصفات المنتج',
            description: 'مواصفات تفصيلية للمنتج',
            format: 'PDF'
          },
          {
            type: 'template',
            name: 'Product Backlog',
            description: 'قائمة مهام المنتج',
            format: 'Excel'
          }
        ]
      },
      {
        id: 'standard',
        name: 'قياسي',
        nameEn: 'Standard',
        description: 'تطوير منتج متقدم',
        level: 'standard',
        price: 11000,
        duration: '14-21 يوم',
        deliverables: [
          'Roadmap V1/V2',
          'مقاييس المنتج (NSM/Activation/Retention)',
          'سياسة نشر',
          'مراقبة (Logs/Alerts/Sentry)'
        ],
        kpis: ['DAU/WAU/MAU', 'Activation Rate', 'Retention D30'],
        governance: ['Sprint أسبوعي', 'مراجعة شهرية لمؤشرات المنتج'],
        inputs: ['بيانات استخدام', 'ملاحظات المستخدمين'],
        outputs: [
          {
            type: 'dashboard',
            name: 'Product Analytics',
            description: 'تحليلات المنتج التفاعلية',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'خارطة المنتج',
            description: 'خارطة طريق المنتج',
            format: 'PDF'
          }
        ]
      },
      {
        id: 'certified',
        name: 'معتمد',
        nameEn: 'Certified',
        description: 'تميز في تطوير المنتجات',
        level: 'certified',
        price: 22000,
        duration: '30-45 يوم',
        deliverables: [
          'معمارية مرجعية',
          'SLO/SLI محددة',
          'ضوابط أمن (CSP/Secrets)',
          'خطة استمرارية (Backups/DR)'
        ],
        kpis: ['System Uptime', 'Security Score', 'Performance Metrics'],
        governance: ['Sprint أسبوعي', 'مراجعة شهرية', 'مراجعة أمنية ربع سنوية'],
        inputs: ['متطلبات أمنية', 'SLA مطلوبة', 'خطة النمو'],
        outputs: [
          {
            type: 'dashboard',
            name: 'System Health',
            description: 'لوحة صحة النظام',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'Architecture Guide',
            description: 'دليل المعمارية التقنية',
            format: 'PDF'
          }
        ]
      }
    ],
    kpis: ['DAU/WAU/MAU', 'Activation', 'Retention D30', 'Latency/Availability', 'Crash Rate'],
    governance: {
      frequency: 'Sprint أسبوعي، مراجعة شهرية لمؤشرات المنتج',
      reviews: ['Sprint أسبوعي', 'مراجعة شهرية', 'مراجعة أمنية ربع سنوية']
    }
  },
  {
    id: 'consulting',
    name: 'استشارات مخصصة',
    nameEn: 'Custom Consulting',
    icon: '✨',
    color: 'from-saudi-gold to-saudi-green',
    pillars: [
      'تحليلات متقدمة',
      'نمذجة تخصصية',
      'قنوات غير تقليدية',
      'شراكات استراتيجية',
      'ذكاء اصطناعي',
      'حلول مبتكرة'
    ],
    packages: [
      {
        id: 'foundation',
        name: 'استشارة أساسية',
        nameEn: 'Basic Consulting',
        description: 'استشارة مخصصة لاحتياجاتك',
        level: 'foundation',
        price: 5000,
        duration: '7-14 يوم',
        deliverables: [
          'تحليل الوضع الحالي',
          'توصيات مرتبة بالأولوية',
          'خطة تنفيذ 30-60-90',
          'مؤشرات نجاح'
        ],
        kpis: ['Implementation Rate', 'Impact Score'],
        governance: ['متابعة أسبوعية', 'مراجعة شهرية'],
        inputs: ['التحدي المحدد', 'الموارد المتاحة', 'القيود'],
        outputs: [
          {
            type: 'document',
            name: 'تقرير الاستشارة',
            description: 'تقرير شامل مع التوصيات',
            format: 'PDF'
          },
          {
            type: 'spreadsheet',
            name: 'خطة التنفيذ',
            description: 'جدول زمني للتنفيذ',
            format: 'Excel'
          }
        ]
      },
      {
        id: 'standard',
        name: 'استشارة متقدمة',
        nameEn: 'Advanced Consulting',
        description: 'حلول متخصصة مع تحليل عميق',
        level: 'standard',
        price: 12000,
        duration: '14-28 يوم',
        deliverables: [
          'تحليل متعدد الأبعاد',
          'نمذجة مخصصة',
          'بدائل استراتيجية',
          'خطة إدارة التغيير'
        ],
        kpis: ['Solution Effectiveness', 'Change Adoption', 'ROI'],
        governance: ['متابعة أسبوعية', 'مراجعة نصف شهرية'],
        inputs: ['بيانات تفصيلية', 'أهداف محددة', 'فريق التنفيذ'],
        outputs: [
          {
            type: 'presentation',
            name: 'عرض الحلول',
            description: 'عرض تقديمي للحلول',
            format: 'PowerPoint'
          },
          {
            type: 'dashboard',
            name: 'لوحة المتابعة',
            description: 'لوحة متابعة التنفيذ',
            format: 'Excel'
          }
        ]
      },
      {
        id: 'certified',
        name: 'استشارة احترافية',
        nameEn: 'Professional Consulting',
        description: 'حلول مؤسسية متكاملة',
        level: 'certified',
        price: 25000,
        duration: '30-60 يوم',
        deliverables: [
          'استراتيجية تحول شاملة',
          'نماذج ذكاء اصطناعي',
          'تكامل أنظمة',
          'برنامج تدريب متخصص'
        ],
        kpis: ['Transformation Success', 'AI Model Accuracy', 'System Integration'],
        governance: ['متابعة يومية', 'مراجعة أسبوعية', 'تقييم شهري'],
        inputs: ['رؤية التحول', 'بيانات ضخمة', 'فريق تقني'],
        outputs: [
          {
            type: 'dashboard',
            name: 'Transformation Dashboard',
            description: 'لوحة متابعة التحول',
            format: 'Excel'
          },
          {
            type: 'document',
            name: 'دليل التحول',
            description: 'دليل شامل للتحول',
            format: 'PDF'
          }
        ]
      }
    ],
    kpis: ['Solution Impact', 'Client Satisfaction', 'Implementation Success'],
    governance: {
      frequency: 'حسب طبيعة المشروع',
      reviews: ['متابعة مستمرة', 'مراجعة دورية', 'تقييم نهائي']
    }
  }
];
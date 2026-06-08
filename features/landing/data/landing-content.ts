export type LandingLanguage = 'ar' | 'en';

export interface LandingServiceItem {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  outcome: string;
  metric: string;
  points: string[];
  gradient: string;
}

export interface LandingWorkItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  stats: string[];
}

export interface LandingPackageItem {
  name: string;
  bestFor: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export interface LandingTrustCard {
  title: string;
  body: string;
  stat: string;
}

export interface LandingFaqItem {
  q: string;
  a: string;
}

export interface LandingContent {
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    proof: string[];
    videoTitle: string;
  };
  services: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    items: LandingServiceItem[];
  };
  works: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    discussCta: string;
    items: LandingWorkItem[];
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  packages: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    popularBadge: string;
    items: LandingPackageItem[];
  };
  partners: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    trustCards: LandingTrustCard[];
    highlights: Array<{ quote: string; name: string; company: string }>;
  };
  faq: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    items: LandingFaqItem[];
  };
  finalCta: {
    badge: string;
    title: string;
    description: string;
    button: string;
  };
  contact: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    sidebarTitle: string;
    sidebarSteps: string[];
    promises: string[];
    form: {
      name: string;
      email: string;
      phone: string;
      service: string;
      servicePlaceholder: string;
      message: string;
      submit: string;
      submitting: string;
      successTitle: string;
      successDescription: string;
      sendAnother: string;
    };
    methods: {
      emailLabel: string;
      emailHint: string;
      phoneLabel: string;
      phoneHint: string;
      locationLabel: string;
      locationHint: string;
    };
    serviceOptions: Array<{ value: string; label: string }>;
  };
  footer: {
    ctaBadge: string;
    ctaTitle: string;
    ctaButton: string;
    description: string;
    quickLinksTitle: string;
    servicesTitle: string;
    resourcesTitle: string;
    quickLinks: string[];
    services: string[];
    resources: string[];
    rights: string;
    tagline: string;
  };
}

const sharedServiceMeta = [
  { id: 'mobile', gradient: 'from-sky-500 to-cyan-500', metricAr: '4-8 أسابيع', metricEn: '4-8 weeks' },
  { id: 'web', gradient: 'from-primary to-emerald-400', metricAr: '95+ أداء', metricEn: '95+ score' },
  { id: 'ecommerce', gradient: 'from-emerald-500 to-teal-500', metricAr: 'جاهز للبيع', metricEn: 'Sales ready' },
  { id: 'identity', gradient: 'from-amber-400 to-orange-500', metricAr: 'هوية موحدة', metricEn: 'Unified brand' },
] as const;

export const landingContent: Record<LandingLanguage, LandingContent> = {
  ar: {
    hero: {
      badge: 'وكالة تقنية تبني منتجات رقمية قابلة للنمو',
      titleLine1: 'اصنع حضوراً رقمياً',
      titleHighlight: 'يوقف التمرير',
      titleLine2: 'ويحوّل الفضول إلى طلبات.',
      description:
        'نأخذ فكرتك من أول ملامحها إلى واجهة مصقولة، تجربة استخدام واضحة، ومنتج جاهز للإطلاق بثقة.',
      ctaPrimary: 'احجز استشارة مجانية',
      ctaSecondary: 'شاهد الأعمال',
      proof: ['استشارة أولى مجانية', 'تصميم قبل البرمجة', 'تسليم مرحلي واضح'],
      videoTitle: 'ريان سوفت',
    },
    services: {
      badge: 'خدماتنا',
      title: 'حلول رقمية',
      titleHighlight: 'تُبنى للنمو',
      description: 'كل خدمة تبدأ من سؤال واحد: كيف نجعل المنتج أوضح، أسرع، وأكثر قدرة على تحويل الزوار إلى عملاء؟',
      items: [
        {
          id: 'mobile',
          title: 'تطوير تطبيقات الجوال',
          eyebrow: 'iOS و Android',
          description:
            'تصميم وتطوير تطبيقات مستقرة وسريعة بواجهات عربية أنيقة، رحلة استخدام واضحة، وتجربة إطلاق قابلة للتوسع.',
          outcome: 'تطبيق جاهز للنشر مع لوحة تحكم وخطة تحسين بعد الإطلاق.',
          metric: sharedServiceMeta[0].metricAr,
          gradient: sharedServiceMeta[0].gradient,
          points: ['تحليل المتطلبات', 'تصميم UX/UI', 'تطوير التطبيق', 'اختبارات وتجهيز المتاجر'],
        },
        {
          id: 'web',
          title: 'المواقع والمنصات',
          eyebrow: 'Next.js و SEO',
          description:
            'بناء مواقع ومنصات سريعة ومتوافقة مع محركات البحث ومهيأة للتحويل والقياس.',
          outcome: 'موقع سريع، قابل للإدارة، ومهيأ للظهور والقياس.',
          metric: sharedServiceMeta[1].metricAr,
          gradient: sharedServiceMeta[1].gradient,
          points: ['أداء عال', 'هيكل SEO', 'تصميم متجاوب', 'تكاملات ولوحات تحكم'],
        },
        {
          id: 'ecommerce',
          title: 'المتاجر الإلكترونية',
          eyebrow: 'مبيعات ومدفوعات',
          description:
            'تجارب بيع متكاملة من عرض المنتج حتى الدفع، مع مسارات شراء مختصرة وواضحة.',
          outcome: 'متجر مصمم للبيع مع ربط دفع وشحن وتقارير.',
          metric: sharedServiceMeta[2].metricAr,
          gradient: sharedServiceMeta[2].gradient,
          points: ['كتالوج منتجات', 'بوابات دفع وشحن', 'تقارير ومخزون', 'تحسين التحويل'],
        },
        {
          id: 'identity',
          title: 'الهوية البصرية وتصميم UX/UI',
          eyebrow: 'Brand System',
          description:
            'نظام بصري وتجربة استخدام تمنح المنتج حضوراً احترافياً عبر الموقع والتطبيق والحملات.',
          outcome: 'هوية موحدة قابلة للتطبيق على كل قنوات العلامة.',
          metric: sharedServiceMeta[3].metricAr,
          gradient: sharedServiceMeta[3].gradient,
          points: ['شعار وألوان', 'دليل استخدام', 'نماذج واجهات', 'مواد إطلاق'],
        },
      ],
    },
    works: {
      badge: 'قدراتنا',
      title: 'ما نبنيه',
      titleHighlight: 'للعملاء',
      description: 'نعرض مجالات العمل التي ننفذها فعلياً: تطبيقات، منصات، متاجر، وهويات رقمية مترابطة.',
      discussCta: 'ناقش مشروعاً مشابهاً',
      items: [
        {
          id: 'mobile',
          title: 'تطبيقات الجوال',
          category: 'منتجات iOS و Android',
          desc: 'تطبيقات عربية بواجهات واضحة، إشعارات، حجوزات، وتجارب تفاعلية قابلة للتوسع.',
          stats: ['Flutter / React Native', 'إطلاق المتاجر'],
        },
        {
          id: 'web',
          title: 'المواقع والمنصات',
          category: 'Next.js',
          desc: 'مواقع سريعة، صفحات هبوط، لوحات تحكم، ومنصات خدمات مع أداء وSEO قوي.',
          stats: ['أداء عال', 'هيكل SEO'],
        },
        {
          id: 'ecommerce',
          title: 'المتاجر الإلكترونية',
          category: 'تجارة رقمية',
          desc: 'متاجر بمسارات شراء مختصرة، دفع، شحن، وإدارة منتجات وطلبات.',
          stats: ['دفع وشحن', 'تحويل أعلى'],
        },
        {
          id: 'identity',
          title: 'الهوية والتجربة',
          category: 'UX/UI',
          desc: 'هويات بصرية وأنظمة تصميم تربط العلامة بالمنتج الرقمي منذ البداية.',
          stats: ['Design System', 'واجهات جاهزة'],
        },
      ],
      ctaTitle: 'لديك فكرة وتريد تصوراً واضحاً؟',
      ctaDescription: 'نرتب لك المرحلة الأولى: النطاق، أهم الشاشات، والمسار المناسب للميزانية والوقت.',
      ctaButton: 'اطلب تصوراً لمشروعك',
    },
    packages: {
      badge: 'العروض',
      title: 'اختر نقطة البداية،',
      titleHighlight: 'ونصمم الطريق',
      description: 'لا نحتاج أن تبدأ بكل شيء. نحدد المرحلة الأعلى أثراً ونبني منها بثبات.',
      popularBadge: 'الأكثر طلباً',
      items: [
        {
          name: 'انطلاقة',
          bestFor: 'للحضور الرقمي الأول والمواقع التعريفية',
          features: ['صفحات أساسية', 'تصميم متجاوب', 'تهيئة SEO أساسية', 'نموذج تواصل وقياس'],
          cta: 'ابدأ بمرحلة أولى',
        },
        {
          name: 'منتج متكامل',
          bestFor: 'لتطبيق أو منصة تحتاج تجربة مستخدم ولوحة تحكم',
          features: ['تحليل وتجربة مستخدم', 'واجهات كاملة', 'تطوير وربط', 'اختبار وإطلاق مرحلي'],
          cta: 'ناقش المنتج',
          highlighted: true,
        },
        {
          name: 'نمو وتحسين',
          bestFor: 'لمنتج قائم يحتاج أداء أفضل وتحويل أعلى',
          features: ['مراجعة UX/UI', 'تحسين سرعة وSEO', 'تحسين CTAs', 'تقرير فرص النمو'],
          cta: 'اطلب تدقيقاً',
        },
      ],
    },
    partners: {
      badge: 'لماذا ريان سوفت',
      title: 'قبل أن تبدأ معنا،',
      titleHighlight: 'اعرف كيف نعمل',
      description: 'نركز على وضوح المنتج، التسليم المرحلي، وتجربة عربية مناسبة لسوقك منذ اليوم الأول.',
      trustCards: [
        {
          title: 'خبرة محلية',
          body: 'نراعي اللغة العربية، اتجاه RTL، واحتياجات السوق في المنطقة منذ بداية التصميم.',
          stat: 'RTL',
        },
        {
          title: 'شراكة منتج',
          body: 'نعمل معك كفريق منتج واحد، لا كمورد ينفذ قائمة طلبات فقط.',
          stat: '+10',
        },
        {
          title: 'تسليم شفاف',
          body: 'مراحل واضحة، مراجعات دورية، ومخرجات قابلة للقياس بعد كل خطوة.',
          stat: '4 مراحل',
        },
      ],
      highlights: [
        {
          quote: 'نبدأ دائماً بفهم الهدف التجاري قبل اختيار التقنية أو شكل الواجهة.',
          name: 'منهجية العمل',
          company: 'ريان سوفت',
        },
        {
          quote: 'نسلم على مراحل مع اختبار وتحسين، حتى يصل المنتج للإطلاق بثقة ووضوح.',
          name: 'تسليم مرحلي',
          company: 'ريان سوفت',
        },
      ],
    },
    faq: {
      badge: 'الأسئلة الشائعة',
      title: 'نزيل الغموض',
      titleHighlight: 'قبل التعاقد',
      description: 'إجابات مختصرة لأكثر الأسئلة التي تظهر قبل بدء أي مشروع رقمي.',
      items: [
        {
          q: 'كم يستغرق تنفيذ المشروع؟',
          a: 'يعتمد على النطاق. المواقع التعريفية قد تبدأ من أسبوعين، والتطبيقات أو المنصات غالباً تمر بمراحل من 4 إلى 12 أسبوعاً حسب التكاملات والخصائص.',
        },
        {
          q: 'هل يمكن البدء بمرحلة صغيرة؟',
          a: 'نعم. نفضل أحياناً البدء بمرحلة اكتشاف أو نسخة أولى MVP لتقليل المخاطر وتوضيح التكلفة قبل التوسع.',
        },
        {
          q: 'هل تساعدون في التصميم فقط أو البرمجة فقط؟',
          a: 'نستطيع تنفيذ التصميم، البرمجة، أو الرحلة كاملة. لكن أفضل النتائج تحدث عندما نربط تجربة المستخدم بالتنفيذ من البداية.',
        },
        {
          q: 'هل الموقع سيكون متوافقاً مع الجوال ومحركات البحث؟',
          a: 'نعم، التوافق مع الجوال، الأداء، الأساسيات التقنية للـ SEO، وتجربة RTL العربية جزء من نظام العمل الأساسي.',
        },
      ],
    },
    finalCta: {
      badge: 'الخطوة التالية',
      title: 'إذا كان مشروعك مهماً، يستحق تجربة أولى واضحة.',
      description: 'أرسل الفكرة، وسنرتب لك تصوراً للمرحلة الأولى قبل أي التزام كبير.',
      button: 'ابدأ النقاش الآن',
    },
    contact: {
      badge: 'تواصل معنا',
      title: 'ابدأ بخطوة صغيرة،',
      titleHighlight: 'ونرتب الباقي معاً',
      description: 'أخبرنا عن فكرتك وسنرد بتصور أولي: ما الذي تحتاجه، كيف نبدأ، وما المرحلة الأنسب لميزانيتك.',
      sidebarTitle: 'ماذا يحدث بعد الإرسال؟',
      sidebarSteps: ['نراجع تفاصيل المشروع', 'نتواصل لتوضيح النقاط المهمة', 'نقترح المسار والمرحلة الأولى'],
      promises: ['رد خلال يوم عمل', 'استشارة أولى مجانية', 'خطة تنفيذ واضحة', 'خصوصية كاملة للفكرة'],
      form: {
        name: 'الاسم الكامل *',
        email: 'البريد الإلكتروني *',
        phone: 'رقم الجوال',
        service: 'نوع الخدمة',
        servicePlaceholder: 'اختر الخدمة',
        message: 'تفاصيل المشروع *',
        submit: 'أرسل تفاصيل المشروع',
        submitting: 'جارٍ إرسال الرسالة...',
        successTitle: 'تم إرسال رسالتك بنجاح',
        successDescription: 'وصلتنا تفاصيلك، وسنراجعها ونعود لك بالخطوة التالية في أقرب وقت.',
        sendAnother: 'إرسال رسالة أخرى',
      },
      methods: {
        emailLabel: 'البريد الإلكتروني',
        emailHint: 'للعروض والتفاصيل الرسمية',
        phoneLabel: 'رقم الهاتف',
        phoneHint: 'للاستفسارات السريعة',
        locationLabel: 'الموقع',
        locationHint: 'نخدم المشاريع عن بعد وحضورياً',
      },
      serviceOptions: [
        { value: 'mobile', label: 'تطبيق جوال' },
        { value: 'web', label: 'موقع أو منصة ويب' },
        { value: 'ecommerce', label: 'متجر إلكتروني' },
        { value: 'identity', label: 'هوية بصرية' },
        { value: 'other', label: 'غير ذلك' },
      ],
    },
    footer: {
      ctaBadge: 'جاهز نبدأ؟',
      ctaTitle: 'خلنا نحول فكرتك إلى منتج واضح وقابل للنمو.',
      ctaButton: 'احجز استشارة مجانية',
      description:
        'وكالة تقنية تبني تطبيقات، مواقع، ومتاجر إلكترونية بهوية واضحة وتجربة استخدام مريحة ونتائج قابلة للقياس.',
      quickLinksTitle: 'روابط سريعة',
      servicesTitle: 'خدماتنا',
      resourcesTitle: 'موارد',
      quickLinks: ['الرئيسية', 'خدماتنا', 'أعمالنا', 'لماذا نحن', 'تواصل معنا'],
      services: ['تطبيقات الجوال', 'المواقع والمنصات', 'المتاجر الإلكترونية', 'الهوية البصرية'],
      resources: ['الأسئلة الشائعة', 'سياسة الخصوصية', 'الشروط والأحكام', 'تواصل معنا'],
      rights: 'جميع الحقوق محفوظة.',
      tagline: 'صُمم ليكون سريعاً، واضحاً، وقابلاً للتطوير.',
    },
  },
  en: {
    hero: {
      badge: 'A tech agency building digital products that scale',
      titleLine1: 'Build a digital presence',
      titleHighlight: 'that stops the scroll',
      titleLine2: 'and turns curiosity into leads.',
      description:
        'We take your idea from first sketch to polished interface, clear user experience, and a product ready to launch with confidence.',
      ctaPrimary: 'Book a free consultation',
      ctaSecondary: 'View our work',
      proof: ['Free initial consultation', 'Design before development', 'Clear phased delivery'],
      videoTitle: 'Raiyansoft',
    },
    services: {
      badge: 'Our Services',
      title: 'Digital solutions',
      titleHighlight: 'built to grow',
      description: 'Every service starts with one question: how do we make the product clearer, faster, and better at turning visitors into customers?',
      items: [
        {
          id: 'mobile',
          title: 'Mobile App Development',
          eyebrow: 'iOS & Android',
          description:
            'We design and build stable, fast apps with elegant Arabic interfaces, clear user journeys, and launch-ready scalability.',
          outcome: 'An app ready for store release with admin tools and a post-launch improvement plan.',
          metric: sharedServiceMeta[0].metricEn,
          gradient: sharedServiceMeta[0].gradient,
          points: ['Requirements analysis', 'UX/UI design', 'App development', 'Testing & store release'],
        },
        {
          id: 'web',
          title: 'Websites & Platforms',
          eyebrow: 'Next.js & SEO',
          description:
            'Fast websites and platforms optimized for search engines, conversion, and measurable performance.',
          outcome: 'A fast, manageable site prepared for visibility and analytics.',
          metric: sharedServiceMeta[1].metricEn,
          gradient: sharedServiceMeta[1].gradient,
          points: ['High performance', 'SEO structure', 'Responsive design', 'Integrations & dashboards'],
        },
        {
          id: 'ecommerce',
          title: 'E-commerce Stores',
          eyebrow: 'Sales & Payments',
          description:
            'Complete shopping experiences from product display to checkout with short, clear purchase paths.',
          outcome: 'A sales-focused store with payments, shipping, and reporting.',
          metric: sharedServiceMeta[2].metricEn,
          gradient: sharedServiceMeta[2].gradient,
          points: ['Product catalog', 'Payment & shipping', 'Inventory & reports', 'Conversion optimization'],
        },
        {
          id: 'identity',
          title: 'Brand Identity & UX/UI',
          eyebrow: 'Brand System',
          description:
            'A visual system and user experience that gives your product a professional presence across web, app, and campaigns.',
          outcome: 'A unified identity applied consistently across every channel.',
          metric: sharedServiceMeta[3].metricEn,
          gradient: sharedServiceMeta[3].gradient,
          points: ['Logo & colors', 'Usage guidelines', 'Interface prototypes', 'Launch assets'],
        },
      ],
    },
    works: {
      badge: 'What We Build',
      title: 'Solutions we deliver',
      titleHighlight: 'for clients',
      description: 'These are the product areas we actively build: apps, platforms, stores, and connected digital brands.',
      discussCta: 'Discuss a similar project',
      items: [
        {
          id: 'mobile',
          title: 'Mobile Applications',
          category: 'iOS & Android products',
          desc: 'Arabic-first apps with clear interfaces, notifications, bookings, and scalable interactive experiences.',
          stats: ['Flutter / React Native', 'Store launch'],
        },
        {
          id: 'web',
          title: 'Websites & Platforms',
          category: 'Next.js',
          desc: 'Fast websites, landing pages, dashboards, and service platforms with strong performance and SEO.',
          stats: ['High performance', 'SEO structure'],
        },
        {
          id: 'ecommerce',
          title: 'E-commerce Stores',
          category: 'Digital commerce',
          desc: 'Stores with short checkout flows, payments, shipping, and product/order management.',
          stats: ['Payments & shipping', 'Higher conversion'],
        },
        {
          id: 'identity',
          title: 'Brand & Experience',
          category: 'UX/UI',
          desc: 'Visual identities and design systems that connect the brand to the digital product from day one.',
          stats: ['Design system', 'Ready interfaces'],
        },
      ],
      ctaTitle: 'Have an idea and want a clear starting point?',
      ctaDescription: 'We will outline the first phase: scope, key screens, and the right path for your budget and timeline.',
      ctaButton: 'Request a project outline',
    },
    packages: {
      badge: 'Packages',
      title: 'Pick your starting point,',
      titleHighlight: 'we design the path',
      description: 'You do not need to start with everything. We identify the highest-impact phase and build from there.',
      popularBadge: 'Most requested',
      items: [
        {
          name: 'Launch',
          bestFor: 'For a first digital presence and marketing websites',
          features: ['Core pages', 'Responsive design', 'Basic SEO setup', 'Contact form & tracking'],
          cta: 'Start with phase one',
        },
        {
          name: 'Full Product',
          bestFor: 'For apps or platforms that need UX and an admin panel',
          features: ['Discovery & UX', 'Full interfaces', 'Development & integrations', 'Testing & phased launch'],
          cta: 'Discuss the product',
          highlighted: true,
        },
        {
          name: 'Growth & Optimization',
          bestFor: 'For existing products that need better performance and conversion',
          features: ['UX/UI review', 'Speed & SEO improvements', 'CTA optimization', 'Growth opportunity report'],
          cta: 'Request an audit',
        },
      ],
    },
    partners: {
      badge: 'Why Raiyansoft',
      title: 'Before you start with us,',
      titleHighlight: 'see how we work',
      description: 'We focus on product clarity, phased delivery, and an Arabic-first experience suited to your market from day one.',
      trustCards: [
        {
          title: 'Regional expertise',
          body: 'Arabic language, RTL direction, and regional market needs are part of the design from the start.',
          stat: 'RTL',
        },
        {
          title: 'Product partnership',
          body: 'We work with you as one product team, not as a vendor executing a ticket list.',
          stat: '+10',
        },
        {
          title: 'Transparent delivery',
          body: 'Clear phases, regular reviews, and measurable outputs after every step.',
          stat: '4 phases',
        },
      ],
      highlights: [
        {
          quote: 'We always start by understanding the business goal before choosing technology or interface shape.',
          name: 'Our approach',
          company: 'Raiyansoft',
        },
        {
          quote: 'We deliver in phases with testing and refinement so the product launches with confidence and clarity.',
          name: 'Phased delivery',
          company: 'Raiyansoft',
        },
      ],
    },
    faq: {
      badge: 'FAQ',
      title: 'Remove uncertainty',
      titleHighlight: 'before you commit',
      description: 'Short answers to the questions that usually come up before starting a digital project.',
      items: [
        {
          q: 'How long does a project take?',
          a: 'It depends on scope. Marketing websites may start around two weeks, while apps and platforms often run through phases of 4 to 12 weeks depending on integrations and features.',
        },
        {
          q: 'Can we start with a small phase?',
          a: 'Yes. We often recommend starting with discovery or an MVP to reduce risk and clarify cost before scaling.',
        },
        {
          q: 'Do you offer design-only or development-only?',
          a: 'We can handle design, development, or the full journey, but the best results happen when UX and implementation are connected from the start.',
        },
        {
          q: 'Will the site work on mobile and search engines?',
          a: 'Yes. Mobile compatibility, performance, core SEO, and Arabic RTL experience are part of our standard delivery.',
        },
      ],
    },
    finalCta: {
      badge: 'Next step',
      title: 'If your project matters, it deserves a clear first experience.',
      description: 'Share your idea and we will outline the first phase before any major commitment.',
      button: 'Start the conversation',
    },
    contact: {
      badge: 'Contact Us',
      title: 'Start with a small step,',
      titleHighlight: 'we will organize the rest',
      description: 'Tell us about your idea and we will reply with an initial outline: what you need, how to start, and the best phase for your budget.',
      sidebarTitle: 'What happens after you submit?',
      sidebarSteps: ['We review the project details', 'We follow up on the important points', 'We propose the path and first phase'],
      promises: ['Reply within one business day', 'Free initial consultation', 'Clear delivery plan', 'Full confidentiality for your idea'],
      form: {
        name: 'Full name *',
        email: 'Email address *',
        phone: 'Phone number',
        service: 'Service type',
        servicePlaceholder: 'Select a service',
        message: 'Project details *',
        submit: 'Send project details',
        submitting: 'Sending message...',
        successTitle: 'Your message was sent successfully',
        successDescription: 'We received your details and will get back to you with the next step as soon as possible.',
        sendAnother: 'Send another message',
      },
      methods: {
        emailLabel: 'Email',
        emailHint: 'For proposals and official details',
        phoneLabel: 'Phone',
        phoneHint: 'For quick questions',
        locationLabel: 'Location',
        locationHint: 'We support projects remotely and on-site',
      },
      serviceOptions: [
        { value: 'mobile', label: 'Mobile app' },
        { value: 'web', label: 'Website or web platform' },
        { value: 'ecommerce', label: 'E-commerce store' },
        { value: 'identity', label: 'Brand identity' },
        { value: 'other', label: 'Other' },
      ],
    },
    footer: {
      ctaBadge: 'Ready to start?',
      ctaTitle: 'Let us turn your idea into a clear, scalable product.',
      ctaButton: 'Book a free consultation',
      description:
        'A technology agency building apps, websites, and e-commerce stores with clear identity, comfortable UX, and measurable outcomes.',
      quickLinksTitle: 'Quick links',
      servicesTitle: 'Services',
      resourcesTitle: 'Resources',
      quickLinks: ['Home', 'Services', 'Work', 'Why us', 'Contact'],
      services: ['Mobile apps', 'Websites & platforms', 'E-commerce stores', 'Brand identity'],
      resources: ['FAQ', 'Privacy policy', 'Terms of use', 'Contact us'],
      rights: 'All rights reserved.',
      tagline: 'Built to be fast, clear, and ready to grow.',
    },
  },
};

export const landingSectionAnchors = {
  ar: ['#home', '#services', '#works', '#partners', '#contact'],
  en: ['#home', '#services', '#works', '#partners', '#contact'],
} as const;

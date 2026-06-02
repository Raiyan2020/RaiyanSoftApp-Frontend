export type ServiceSlug =
  | 'mobile-app-development'
  | 'web-development'
  | 'ecommerce-development'
  | 'branding-ui-ux';

export type PublicService = {
  slug: ServiceSlug;
  title: string;
  shortTitle: string;
  description: string;
  outcomes: string[];
  deliverables: string[];
};

export const publicServices: PublicService[] = [
  {
    slug: 'mobile-app-development',
    title: 'تطوير تطبيقات الجوال',
    shortTitle: 'تطبيقات الجوال',
    description: 'تصميم وتطوير تطبيقات iOS و Android بتجربة عربية واضحة ومسار إطلاق قابل للتوسع.',
    outcomes: ['تطبيق جاهز للنشر', 'لوحة تحكم عند الحاجة', 'خطة تحسين بعد الإطلاق'],
    deliverables: ['تحليل المتطلبات', 'تصميم UX/UI', 'تطوير التطبيق', 'اختبارات وتجهيز المتاجر'],
  },
  {
    slug: 'web-development',
    title: 'تطوير المواقع والمنصات',
    shortTitle: 'المواقع والمنصات',
    description: 'بناء مواقع ومنصات سريعة ومتوافقة مع محركات البحث ومهيأة للتحويل والقياس.',
    outcomes: ['موقع سريع', 'هيكل SEO واضح', 'تجربة متجاوبة بالكامل'],
    deliverables: ['خريطة صفحات', 'تصميم واجهات', 'تطوير Next.js', 'تهيئة الأداء والقياس'],
  },
  {
    slug: 'ecommerce-development',
    title: 'تطوير المتاجر الإلكترونية',
    shortTitle: 'المتاجر الإلكترونية',
    description: 'تجارب بيع متكاملة من عرض المنتج حتى الدفع مع مسارات شراء مختصرة وواضحة.',
    outcomes: ['متجر جاهز للبيع', 'ربط دفع وشحن', 'تجربة شراء محسنة'],
    deliverables: ['كتالوج المنتجات', 'صفحات البيع', 'الدفع والشحن', 'تقارير ومتابعة'],
  },
  {
    slug: 'branding-ui-ux',
    title: 'الهوية البصرية وتصميم UX/UI',
    shortTitle: 'الهوية والتجربة',
    description: 'نظام بصري وتجربة استخدام تمنح المنتج حضورا واضحا وقابلا للتطبيق عبر القنوات.',
    outcomes: ['هوية موحدة', 'واجهات قابلة للتنفيذ', 'إرشادات استخدام'],
    deliverables: ['شعار وألوان', 'نظام تصميم', 'نماذج واجهات', 'مواد إطلاق'],
  },
];

export const publicFaqs = [
  {
    question: 'كم يستغرق تنفيذ المشروع؟',
    answer: 'يعتمد على النطاق. المواقع التعريفية قد تبدأ من أسبوعين، بينما التطبيقات والمنصات تمر غالبا بمراحل من 4 إلى 12 أسبوعا.',
  },
  {
    question: 'هل يمكن البدء بمرحلة صغيرة؟',
    answer: 'نعم. يمكن البدء بمرحلة اكتشاف أو نسخة MVP لتقليل المخاطر وتوضيح التكلفة قبل التوسع.',
  },
  {
    question: 'هل تساعدون في التصميم فقط أو البرمجة فقط؟',
    answer: 'يمكن تنفيذ التصميم أو البرمجة أو الرحلة كاملة، لكن أفضل النتائج تحدث عندما ترتبط تجربة المستخدم بالتنفيذ من البداية.',
  },
];

export const pricingPackages = [
  {
    name: 'انطلاقة',
    description: 'مناسب للمواقع التعريفية والحضور الرقمي الأول.',
    features: ['صفحات أساسية', 'تصميم متجاوب', 'تهيئة SEO أساسية', 'نموذج تواصل'],
  },
  {
    name: 'نمو',
    description: 'مناسب للشركات التي تحتاج تجربة أعمق وتحويلات أكثر وضوحا.',
    features: ['هيكل صفحات متقدم', 'مكونات قابلة لإعادة الاستخدام', 'تحسين أداء', 'ربط تحليلات'],
  },
  {
    name: 'منتج مخصص',
    description: 'مناسب للتطبيقات والمنصات والمتاجر التي تحتاج تكاملات خاصة.',
    features: ['تحليل منتج', 'تصميم UX/UI', 'تطوير مخصص', 'اختبارات وإطلاق'],
  },
];

export const portfolioItems = [
  {
    slug: 'sample-digital-platform',
    title: 'منصة رقمية مخصصة',
    summary: 'نموذج داخلي يوضح بنية دراسة الحالة إلى حين إضافة مشاريع حقيقية معتمدة.',
    isPlaceholder: true,
    serviceSlug: 'web-development' satisfies ServiceSlug,
  },
];

export const blogPosts = [
  {
    slug: 'estimate-digital-product-cost',
    title: 'كيف تحدد تكلفة منتجك الرقمي قبل البدء؟',
    excerpt: 'إطار مبسط لفهم نطاق المشروع والعوامل التي تؤثر في التكلفة والمدة.',
    category: 'إدارة المنتج',
    isPlaceholder: true,
  },
];

export const testimonials = [
  {
    quote: 'تضاف الشهادات الحقيقية بعد اعتمادها من العملاء.',
    author: 'فريق ريان سوفت',
    role: 'محتوى مؤقت',
    isPlaceholder: true,
  },
];

export const partners = [
  {
    name: 'شركاء التقنية',
    description: 'تضاف أسماء الشركاء الحقيقيين بعد اعتمادها.',
    isPlaceholder: true,
  },
];

export const teamMembers = [
  {
    name: 'فريق ريان سوفت',
    role: 'فريق المنتج والتطوير',
    bio: 'يتم تحديث هذه الصفحة بأسماء الفريق المعتمدة لاحقا.',
    isPlaceholder: true,
  },
];


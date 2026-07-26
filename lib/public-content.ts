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
    title: 'Mobile App Development',
    shortTitle: 'Mobile Apps',
    description: 'Design and development of iOS and Android apps with a clear user experience and a scalable launch path.',
    outcomes: ['A launch-ready app', 'An admin dashboard when needed', 'A post-launch optimization plan'],
    deliverables: ['Requirements analysis', 'UX/UI design', 'App development', 'Testing and store submission preparation'],
  },
  {
    slug: 'web-development',
    title: 'Web & Platform Development',
    shortTitle: 'Websites & Platforms',
    description: 'Building fast, SEO-friendly websites and platforms optimized for conversion and measurement.',
    outcomes: ['A fast website', 'A clear SEO structure', 'A fully responsive experience'],
    deliverables: ['Sitemap planning', 'Interface design', 'Next.js development', 'Performance and analytics setup'],
  },
  {
    slug: 'ecommerce-development',
    title: 'E-commerce Development',
    shortTitle: 'Online Stores',
    description: 'Complete selling experiences from product display through checkout, with short and clear purchase paths.',
    outcomes: ['A store ready to sell', 'Payment and shipping integration', 'An optimized purchase experience'],
    deliverables: ['Product catalog', 'Sales pages', 'Payment and shipping', 'Reports and tracking'],
  },
  {
    slug: 'branding-ui-ux',
    title: 'Branding and UX/UI Design',
    shortTitle: 'Branding & Experience',
    description: 'A visual system and user experience that give the product a clear, consistent presence across channels.',
    outcomes: ['A unified identity', 'Implementation-ready interfaces', 'Usage guidelines'],
    deliverables: ['Logo and color palette', 'Design system', 'Interface mockups', 'Launch materials'],
  },
];

export const publicFaqs = [
  {
    question: 'How long does a project take to complete?',
    answer: 'It depends on the scope. Informational websites can start from two weeks, while apps and platforms typically go through phases lasting 4 to 12 weeks.',
  },
  {
    question: 'Can we start with a small phase?',
    answer: 'Yes. You can start with a discovery phase or an MVP version to reduce risk and clarify cost before scaling up.',
  },
  {
    question: 'Do you help with design only or development only?',
    answer: "We can deliver design only, development only, or the full journey - but the best results happen when user experience and implementation are connected from the start.",
  },
];

export const pricingPackages = [
  {
    name: 'Launch',
    description: 'Suitable for informational websites and your first digital presence.',
    features: ['Core pages', 'Responsive design', 'Basic SEO setup', 'Contact form'],
  },
  {
    name: 'Growth',
    description: 'Suitable for companies that need a deeper experience and clearer conversions.',
    features: ['Advanced page structure', 'Reusable components', 'Performance optimization', 'Analytics integration'],
  },
  {
    name: 'Custom Product',
    description: 'Suitable for apps, platforms, and stores that need custom integrations.',
    features: ['Product analysis', 'UX/UI design', 'Custom development', 'Testing and launch'],
  },
];

export const portfolioItems = [
  {
    slug: 'sample-digital-platform',
    title: 'Custom Digital Platform',
    summary: 'An internal sample that illustrates the case study structure until real, approved projects are added.',
    isPlaceholder: true,
    serviceSlug: 'web-development' satisfies ServiceSlug,
  },
];

export const blogPosts = [
  {
    slug: 'estimate-digital-product-cost',
    title: 'How do you estimate your digital product cost before you start?',
    excerpt: 'A simple framework for understanding project scope and the factors that affect cost and duration.',
    category: 'Product Management',
    body: [
      'Any good estimate starts from a clear definition of scope, not from a random number or a quick guess.',
      'The clearer the requirements, the easier it becomes to estimate time, cost, and potential risks.',
      'The best approach is to break the idea into small deliverables, then prioritize them to define the first version.',
    ].join('\n'),
    isPlaceholder: true,
  },
  {
    slug: 'ux-content-that-converts',
    title: 'How do user experience and content help increase conversion?',
    excerpt: 'Connecting your messaging with a clear interface reduces friction and increases completion rates.',
    category: 'UX & Content Writing',
    body: [
      "It isn't enough for the interface to be beautiful - it must also clearly explain the next step to the user.",
      'Short, direct content eases hesitation and makes decision-making easier.',
      'When messaging, content, and design work together, conversion becomes a natural part of the experience.',
    ].join('\n'),
    isPlaceholder: true,
  },
  {
    slug: 'launching-with-a-minimum-viable-scope',
    title: 'Launching with an MVP scope: how do you start without overdoing it?',
    excerpt: 'Use a small first version to learn quickly and build on real results.',
    category: 'Product Management',
    body: [
      'A smaller scope does not mean a weaker product - it means a stronger focus on core value.',
      'The first version should test the important hypotheses before investing in secondary details.',
      'Every early-launch cycle gives you better data for making the next development decision.',
    ].join('\n'),
    isPlaceholder: true,
  },
];

export const testimonials = [
  {
    quote: 'Real testimonials will be added here once approved by clients.',
    author: 'Raiyan Soft team',
    role: 'Temporary content',
    isPlaceholder: true,
  },
];

export const partners = [
  {
    name: 'Technology Partners',
    description: 'The names of real partners will be added here once approved.',
    isPlaceholder: true,
  },
];

export const teamMembers = [
  {
    name: 'Raiyan Soft team',
    role: 'Product and Development Team',
    bio: 'This page will be updated with approved team member names later.',
    isPlaceholder: true,
  },
];

export interface NavLink {
  key: string;
  href: string;
}

export const sectionLinks: NavLink[] = [
  { key: 'landing.nav.home', href: '#home' },
  { key: 'landing.nav.services', href: '#services' },
  { key: 'landing.nav.sectors', href: '#sectors' },
  { key: 'landing.nav.works', href: '#works' },
  { key: 'landing.nav.packages', href: '#packages' },
  { key: 'landing.nav.faq', href: '#faq' },
];

export const pageLinks: NavLink[] = [
  { key: 'landing.nav.about', href: '/about' },
  { key: 'landing.nav.services', href: '/services' },
  { key: 'landing.nav.portfolio', href: '/portfolio' },
  { key: 'landing.nav.blog', href: '/blogs' },
  { key: 'landing.nav.pricing', href: '/pricing' },
  { key: 'landing.nav.consultation', href: '/consultation' },
  { key: 'landing.nav.contact', href: '/contact' },
  { key: 'landing.nav.team', href: '/team' },
  { key: 'landing.nav.partners', href: '/partners' },
  { key: 'landing.nav.careers', href: '/careers' },
  { key: 'landing.nav.privacy', href: '/privacy' },
  { key: 'landing.nav.terms', href: '/terms' },
];

export const headerPageLinks: NavLink[] = [
  { key: 'landing.nav.packages', href: '/pricing' },
];

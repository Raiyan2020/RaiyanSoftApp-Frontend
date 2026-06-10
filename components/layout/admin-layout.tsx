'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Menu,
  X,
  FolderKanban,
  Users,
  Briefcase,
  Shield,
  LayoutGrid,
  MessageSquareText,
  User,
  ChevronDown,
  Calendar,
  Inbox,
  ListChecks,
  Globe2,
  Home,
  Newspaper,
  HelpCircle,
  Tags,
  Star,
  Handshake,
  FileText,
  Palette,
  Settings,
  Sun,
  Moon,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Languages,
  Layout,
  Megaphone,
} from 'lucide-react';
import { authService } from '@/lib/auth-service';
import { hasPermission } from '@/lib/permissions';
import { FEATURES } from '@/lib/feature-flags';
import { useTheme } from '@/lib/themeContext';
import { useTranslation } from '@/lib/i18nContext';
import SafeImage from '../ui/safe-image';
import Avatar from '../ui/avatar';


interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ displayName: string; email: string } | null>(null);
  const [currentPermissions, setCurrentPermissions] = useState<string[]>(['*']);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    operations: false,
    content: false,
    people: false,
    website: false,
    system: false,
  });

  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage, dir } = useTranslation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribeAuth = authService.subscribe(({ admin }) => {
      if (admin) {
        setCurrentUser({
          displayName: admin.full_name || admin.name || admin.admin_code || 'Admin',
          email: admin.email || admin.phone || '',
        });
        setCurrentPermissions(['*']);
      } else {
        setCurrentUser(null);
        setCurrentPermissions([]);
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      unsubscribeAuth();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsCommandOpen(true);
      }

      if (event.key === 'Escape') {
        setIsCommandOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!isCommandOpen) return;
    const timer = window.setTimeout(() => commandInputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [isCommandOpen]);

  // Keep CSS variables on :root so portaled sheets can stay inside the admin
  // content area instead of sitting underneath the header/sidebar.
  useEffect(() => {
    const setSheetOffsets = () => {
      const hasDesktopSidebar = window.matchMedia('(min-width: 768px)').matches;
      const sidebarWidth = hasDesktopSidebar ? (isSidebarCollapsed ? '64px' : '240px') : '0px';
      document.documentElement.style.setProperty('--admin-sheet-top', '64px');
      document.documentElement.style.setProperty('--admin-sheet-left', dir === 'ltr' ? sidebarWidth : '0px');
      document.documentElement.style.setProperty('--admin-sheet-right', dir === 'rtl' ? sidebarWidth : '0px');
    };

    setSheetOffsets();
    window.addEventListener('resize', setSheetOffsets);
    return () => {
      window.removeEventListener('resize', setSheetOffsets);
      document.documentElement.style.removeProperty('--admin-sheet-top');
      document.documentElement.style.removeProperty('--admin-sheet-left');
      document.documentElement.style.removeProperty('--admin-sheet-right');
    };
  }, [dir, isSidebarCollapsed]);

  const handleLogout = async () => {
    try {
      authService.clearAdminSession();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };


  const navItems = [
    { id: 'leads', label: t('admin.nav.leads'), icon: Inbox, path: '/admin/leads', badge: 0, permission: 'leads.view' },
    { id: 'project-questions', label: t('admin.nav.project_questions'), icon: ListChecks, path: '/admin/project-questions', badge: 0, permission: 'lead_questions.manage' },
    ...(FEATURES.portfolioProjects ? [{ id: 'projects', label: t('admin.nav.portfolio'), icon: FolderKanban, path: '/admin/projects', badge: 0, permission: 'portfolio.manage' }] : []),
    { id: 'user-projects', label: t('admin.nav.user_projects'), icon: LayoutGrid, path: '/admin/user-projects', badge: 0, permission: 'projects.view' },
    ...(FEATURES.adminLiveChat ? [{
      id: 'live-chat',
      label: t('admin.nav.live_chat'),
      icon: MessageSquareText,
      path: '/admin/live-chat',
      badge: 0,
      permission: 'chat.manage',
    }] : []),
    {
      id: 'appointments',
      label: t('admin.nav.meetings'),
      icon: Calendar,
      path: '/admin/appointments',
      badge: 0,
      permission: 'appointments.view',
    },
    {
      id: 'marketing',
      label: t('admin.nav.marketing'),
      icon: Megaphone,
      path: '/admin/marketing',
      badge: 0,
      permission: '*',
    },
    { id: 'users', label: t('admin.nav.users'), icon: Users, path: '/admin/users', badge: 0, permission: 'users.view' },
    { id: 'employees', label: t('admin.nav.employees'), icon: Briefcase, path: '/admin/employees', badge: 0, permission: 'employees.manage' },
    ...(FEATURES.rolesManagement ? [{ id: 'roles', label: t('admin.nav.roles'), icon: Shield, path: '/admin/roles', badge: 0, permission: 'roles.manage' }] : []),
    { id: 'pages', label: t('admin.nav.pages'), icon: FileText, path: '/admin/pages', badge: 0, permission: 'pages.manage' },
    { id: 'colors', label: t('admin.nav.colors'), icon: Palette, path: '/admin/colors', badge: 0, permission: 'colors.manage' },
    ...(FEATURES.landingPageManagement ? [{ id: 'landing-page', label: t('admin.nav.landing_page'), icon: Layout, path: '/admin/landing-page', badge: 0, permission: '*' }] : []),
  ].filter((item) => hasPermission(currentPermissions, item.permission));

  const websiteNavItems = FEATURES.websiteManagement ? [
    { id: 'website', label: t('admin.nav.overview'), icon: Globe2, path: '/admin/website', permission: 'website.view' },
    { id: 'website-homepage', label: t('admin.nav.homepage'), icon: Home, path: '/admin/website/homepage', permission: 'website.homepage.manage' },
    { id: 'website-services', label: t('admin.nav.services'), icon: Briefcase, path: '/admin/website/services', permission: 'website.services.manage' },
    { id: 'website-apps', label: t('admin.nav.apps_cases'), icon: FolderKanban, path: '/admin/website/apps', permission: 'website.apps.manage' },
    { id: 'website-blog', label: t('admin.nav.blog'), icon: Newspaper, path: '/admin/website/blog', permission: 'website.blog.manage' },
    { id: 'website-steps', label: t('admin.nav.steps'), icon: ListChecks, path: '/admin/website/steps', permission: 'website.steps.manage' },
    { id: 'website-faqs', label: t('admin.nav.faqs'), icon: HelpCircle, path: '/admin/website/faqs', permission: 'website.faqs.manage' },
    { id: 'website-pricing', label: t('admin.nav.pricing'), icon: Tags, path: '/admin/website/pricing', permission: 'website.pricing.manage' },
    { id: 'website-testimonials', label: t('admin.nav.testimonials'), icon: Star, path: '/admin/website/testimonials', permission: 'website.testimonials.manage' },
    { id: 'website-partners', label: t('admin.nav.partners'), icon: Handshake, path: '/admin/website/partners', permission: 'website.partners.manage' },
    { id: 'website-team', label: t('admin.nav.team'), icon: Users, path: '/admin/website/team', permission: 'website.team.manage' },
    { id: 'website-careers', label: t('admin.nav.careers'), icon: Briefcase, path: '/admin/website/careers', permission: 'website.careers.manage' },
    { id: 'website-legal', label: t('admin.nav.legal'), icon: FileText, path: '/admin/website/legal', permission: 'website.legal.manage' },
    { id: 'website-settings', label: t('admin.nav.site_settings'), icon: Settings, path: '/admin/website/settings', permission: 'website.settings.manage' },
  ].filter((item) => hasPermission(currentPermissions, item.permission)) : [];

  const allSearchableNavItems = [
    ...navItems.map((item) => ({ ...item, section: t('admin.section.admin') })),
    ...websiteNavItems.map((item) => ({ ...item, section: t('admin.section.website') })),
  ];

  const normalizeQuery = (value: string) => value.trim().toLowerCase();
  const filterNavItems = <T extends { label: string; path: string; id: string }>(items: T[], query: string) => {
    const normalized = normalizeQuery(query);
    if (!normalized) return items;

    return items.filter((item) =>
      [item.label, item.path, item.id].some((value) => value.toLowerCase().includes(normalized))
    );
  };

  const filteredNavItems = filterNavItems(navItems, sidebarSearch);
  const filteredWebsiteNavItems = filterNavItems(websiteNavItems, sidebarSearch);
  const commandResults = filterNavItems(allSearchableNavItems, commandQuery);

  const sidebarSections = [
    {
      id: 'operations',
      label: dir === 'rtl' ? 'العمليات' : 'Operations',
      items: filteredNavItems.filter((item) => ['leads', 'appointments', 'marketing', 'live-chat'].includes(item.id)),
    },
    {
      id: 'content',
      label: dir === 'rtl' ? 'المحتوى' : 'Content',
      items: filteredNavItems.filter((item) => ['project-questions', 'projects', 'user-projects'].includes(item.id)),
    },
    {
      id: 'people',
      label: dir === 'rtl' ? 'الأشخاص والصلاحيات' : 'People & Access',
      items: filteredNavItems.filter((item) => ['users', 'employees', 'roles'].includes(item.id)),
    },
    {
      id: 'system',
      label: dir === 'rtl' ? 'النظام' : 'System',
      items: filteredNavItems.filter((item) => ['pages', 'colors', 'landing-page'].includes(item.id)),
    },
    {
      id: 'website',
      label: t('admin.section.website'),
      items: filteredWebsiteNavItems,
    },
  ] as const;

  const navigateToAdminPath = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setIsCommandOpen(false);
    setCommandQuery('');
  };

  function SidebarContent() {
    const toggleSection = (sectionId: string) => {
      setCollapsedSections((current) => ({
        ...current,
        [sectionId]: !current[sectionId],
      }));
    };

    const renderItem = (item: (typeof navItems)[number] | (typeof websiteNavItems)[number]) => {
      const isActive = pathname.includes(item.path);
      const badge = 'badge' in item ? item.badge : 0;
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => navigateToAdminPath(item.path)}
          title={isSidebarCollapsed ? item.label : undefined}
          className={`group relative w-full overflow-hidden rounded-xl border px-3 py-2 text-start transition-all duration-200 ${
            isSidebarCollapsed ? 'flex justify-center px-2.5' : 'flex items-center gap-2.5'
          } ${
            isActive
              ? 'border-primary/25 bg-primary/10 text-primary shadow-[0_6px_18px_rgba(29,183,240,0.1)]'
              : 'border-transparent bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
          }`}
        >
          {isActive ? <span className="absolute inset-y-2 left-1 w-0.5 rounded-full bg-primary" /> : null}
          <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors group-hover:bg-[var(--surface)] group-hover:text-[var(--text)]">
            <item.icon size={16} />
            {badge > 0 ? (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-[var(--surface)] shadow-sm z-10">
                {badge > 99 ? '99+' : badge}
              </span>
            ) : null}
          </div>
          {!isSidebarCollapsed ? (
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold tracking-tight">{item.label}</span>
          ) : null}
        </button>
      );
    };

    return (
      <div className="flex flex-col h-full">
        <div className={`p-3 flex items-center border-b border-[var(--border)] ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5'}`}>
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/15 relative overflow-hidden">
            <SafeImage
              src="https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png"
              alt="Raiyansoft"
              className="h-5 w-5 object-contain"
            />
          </div>
          <div className={isSidebarCollapsed ? 'hidden' : ''}>
            <h1 className="text-[var(--text)] font-extrabold text-sm leading-none tracking-tight">Raiyansoft</h1>
            <span className="mt-0.5 inline-flex rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-primary">
              {t('admin.panel')}
            </span>
          </div>
        </div>

        {!isSidebarCollapsed ? (
          <div className="border-b border-[var(--border)] p-2.5 space-y-2">
            <button
              type="button"
              onClick={() => setIsCommandOpen(true)}
              className="flex w-full items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-start text-[13px] text-[var(--text-muted)] transition-all hover:border-primary/30 hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
            >
              <Search size={16} className="shrink-0" />
              <span className="flex-1 font-medium">{t('admin.search.links')}</span>
              <kbd className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--text-muted)]">
                {t('admin.search.shortcut')}
              </kbd>
            </button>
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 shadow-inner">
              <Search size={15} className="text-[var(--text-muted)] shrink-0" />
              <input
                value={sidebarSearch}
                onChange={(event) => setSidebarSearch(event.target.value)}
                placeholder={t('admin.search.sidebar')}
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none"
              />
            </div>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto no-scrollbar px-2.5 py-2.5">
          <div className="space-y-2">
            {sidebarSections.map((section) => {
              if (section.items.length === 0) return null;
              const isCollapsed = collapsedSections[section.id];

              return (
                <div key={section.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-1">
                  {!isSidebarCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center justify-between rounded-xl px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
                      aria-expanded={!isCollapsed}
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-primary/70" />
                        {section.label}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-[var(--surface)] px-1.5 py-0.5 text-[9px] font-semibold normal-case tracking-normal text-[var(--text-muted)]">
                          {section.items.length}
                        </span>
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                        />
                      </span>
                    </button>
                  ) : null}

                  {!isCollapsed || isSidebarCollapsed ? (
                    <div className="space-y-1 p-0.5 pt-1">
                      {section.items.map(renderItem)}
                    </div>
                  ) : null}
                </div>
              );
            })}

          {!isSidebarCollapsed && sidebarSearch && filteredNavItems.length === 0 && filteredWebsiteNavItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs font-medium text-[var(--text-muted)]">
              {t('admin.search.no_results')}
            </div>
          ) : null}
          </div>
        </div>

        <div className={`p-2 border-t border-[var(--border)] text-center ${isSidebarCollapsed ? 'hidden' : ''}`}>
          <p className="text-[10px] text-[var(--text-muted)]">{t('admin.version')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[var(--bg)] text-[var(--text)] flex overflow-hidden font-sans" dir={dir}>
      <aside className={`hidden md:block ${isSidebarCollapsed ? 'w-16' : 'w-60'} bg-[var(--surface)] border-r border-[var(--border)] shadow-2xl z-[60] shrink-0 transition-all duration-300`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden min-h-0">
        <header className="h-16 shrink-0 bg-[var(--surface)] backdrop-blur-md border-b border-[var(--border)] flex items-center justify-between px-4 z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors md:hidden"
            >
              <Menu size={24} />
            </button>
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
              className="hidden md:grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
              aria-label={isSidebarCollapsed ? t('admin.sidebar.expand') : t('admin.sidebar.collapse')}
            >
              {isSidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <div className="md:hidden flex items-center space-x-2">
              <SafeImage
                src="https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-[var(--text)] text-sm">{t('admin.mobile_title')}</span>
            </div>

            <div className="hidden md:block text-[var(--text-muted)] text-sm font-medium" />
          </div>

          <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCommandOpen(true)}
            className="hidden sm:flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
          >
            <Search size={16} />
            <span className="hidden lg:inline">{t('admin.search.header')}</span>
            <kbd className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-bold">
              {t('admin.search.shortcut')}
          </kbd>
          </button>
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 text-sm font-bold text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            aria-label={t('admin.language.toggle')}
          >
            <Languages size={16} />
            <span>{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            aria-label={t('admin.theme.toggle')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-[var(--surface-2)] border border-transparent hover:border-[var(--border)] transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                <Avatar name={currentUser?.displayName || t('admin.mobile_title')} size="sm" className="w-full h-full text-xs" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[var(--text)] leading-none">{currentUser?.displayName || t('admin.account.default_user')}</p>
                <p className="text-[10px] text-[var(--text-muted)] leading-none mt-1 group-hover:text-primary transition-colors">
                  {t('admin.account.view')}
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-[var(--text-muted)] transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isUserMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[var(--border)] mb-1">
                    <p className="text-sm font-bold text-[var(--text)] truncate">{currentUser?.displayName}</p>
                    <p className="text-xs text-[var(--text-muted)] truncate">{currentUser?.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      router.push('/admin/account');
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] flex items-center gap-2 transition-colors"
                  >
                    <User size={16} />
                    <span>{t('admin.account.edit')}</span>
                  </button>

                  <div className="my-1 border-t border-[var(--border)]" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>{t('admin.account.signout')}</span>
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          </div>
        </header>

        <AnimatePresence>
          {isMobileMenuOpen ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 w-60 bg-[var(--surface)] border-r border-[var(--border)] z-50 md:hidden shadow-2xl"
              >
                <SidebarContent />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <X size={20} />
                </button>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {isCommandOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 px-4 pt-24 backdrop-blur-sm"
              onClick={() => setIsCommandOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
              >
                <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
                  <Search size={18} className="text-[var(--text-muted)]" />
                  <input
                    ref={commandInputRef}
                    value={commandQuery}
                    onChange={(event) => setCommandQuery(event.target.value)}
                    placeholder={t('admin.search.placeholder')}
                    className="min-w-0 flex-1 bg-transparent text-base text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none"
                  />
                  <kbd className="rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-[10px] font-bold text-[var(--text-muted)]">
                    Esc
                  </kbd>
                </div>

                <div className="max-h-[24rem] overflow-y-auto p-2 custom-scrollbar">
                  {commandResults.length > 0 ? (
                    commandResults.map((item) => {
                      const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
                      return (
                        <button
                          key={`${item.section}-${item.id}`}
                          type="button"
                          onClick={() => navigateToAdminPath(item.path)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-start transition-colors ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                          }`}
                        >
                          <item.icon size={18} className="shrink-0" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-bold">{item.label}</span>
                            <span className="block truncate text-xs opacity-70">{item.section} • {item.path}</span>
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">
                      {t('admin.search.no_results')}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <main className="flex-1 min-h-0 overflow-y-auto bg-[var(--bg)] p-4 md:p-8 relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10 h-full pb-20">{children}</div>
        </main>
      </div>
    </div>
  );
}

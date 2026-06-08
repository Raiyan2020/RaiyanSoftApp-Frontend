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
} from 'lucide-react';
import { authService } from '@/lib/auth-service';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { useAdminChatNotifications } from '@/lib/adminChatStore';
import { hasPermission } from '@/lib/permissions';
import { useTheme } from '@/lib/themeContext';
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
  const [upcomingApptsCount, setUpcomingApptsCount] = useState(0);

  const router = useRouter();
  const pathname = usePathname();
  const { totalUnread } = useAdminChatNotifications();
  const { theme, toggleTheme } = useTheme();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeAuth = authService.subscribe(({ admin }) => {
      if (admin) {
        setCurrentUser({
          displayName: admin.name,
          email: admin.email,
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

    let unsubscribeAppts = () => {};
    if (db) {
      const apptsQuery = query(
        collection(db, 'appointment_bookings'),
        where('startAt', '>=', Timestamp.now()),
        where('status', 'not-in', ['cancelled', 'completed'])
      );

      unsubscribeAppts = onSnapshot(
        apptsQuery,
        (snap) => {
          setUpcomingApptsCount(snap.size);
        },
        (err) => {
          console.warn('Upcoming appointments badge subscription error:', err);
        }
      );
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      unsubscribeAuth();
      unsubscribeAppts();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      authService.clearAdminSession();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };


  const navItems = [
    { id: 'leads', label: 'Leads', icon: Inbox, path: '/admin/leads', badge: 0, permission: 'leads.view' },
    { id: 'project-questions', label: 'Project Questions', icon: ListChecks, path: '/admin/project-questions', badge: 0, permission: 'lead_questions.manage' },
    { id: 'projects', label: 'Portfolio', icon: FolderKanban, path: '/admin/projects', badge: 0, permission: 'portfolio.manage' },
    { id: 'user-projects', label: 'User Projects', icon: LayoutGrid, path: '/admin/user-projects', badge: 0, permission: 'projects.view' },
    {
      id: 'live-chat',
      label: 'Live Chat',
      icon: MessageSquareText,
      path: '/admin/live-chat',
      badge: totalUnread,
      permission: 'chat.manage',
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      path: '/admin/appointments',
      badge: upcomingApptsCount,
      permission: 'appointments.view',
    },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users', badge: 0, permission: 'users.view' },
    { id: 'employees', label: 'Employees', icon: Briefcase, path: '/admin/employees', badge: 0, permission: 'employees.manage' },
    { id: 'roles', label: 'Roles', icon: Shield, path: '/admin/roles', badge: 0, permission: 'roles.manage' },
    { id: 'pages', label: 'Pages', icon: FileText, path: '/admin/pages', badge: 0, permission: 'pages.manage' },
    { id: 'colors', label: 'Colors', icon: Palette, path: '/admin/colors', badge: 0, permission: 'colors.manage' },
  ].filter((item) => hasPermission(currentPermissions, item.permission));

  const websiteNavItems = [
    { id: 'website', label: 'Overview', icon: Globe2, path: '/admin/website', permission: 'website.view' },
    { id: 'website-homepage', label: 'Homepage', icon: Home, path: '/admin/website/homepage', permission: 'website.homepage.manage' },
    { id: 'website-services', label: 'Services', icon: Briefcase, path: '/admin/website/services', permission: 'website.services.manage' },
    { id: 'website-apps', label: 'Apps & Cases', icon: FolderKanban, path: '/admin/website/apps', permission: 'website.apps.manage' },
    { id: 'website-blog', label: 'Blog', icon: Newspaper, path: '/admin/website/blog', permission: 'website.blog.manage' },
    { id: 'website-steps', label: 'Steps', icon: ListChecks, path: '/admin/website/steps', permission: 'website.steps.manage' },
    { id: 'website-faqs', label: 'FAQs', icon: HelpCircle, path: '/admin/website/faqs', permission: 'website.faqs.manage' },
    { id: 'website-pricing', label: 'Pricing', icon: Tags, path: '/admin/website/pricing', permission: 'website.pricing.manage' },
    { id: 'website-testimonials', label: 'Testimonials', icon: Star, path: '/admin/website/testimonials', permission: 'website.testimonials.manage' },
    { id: 'website-partners', label: 'Partners', icon: Handshake, path: '/admin/website/partners', permission: 'website.partners.manage' },
    { id: 'website-team', label: 'Team', icon: Users, path: '/admin/website/team', permission: 'website.team.manage' },
    { id: 'website-careers', label: 'Careers', icon: Briefcase, path: '/admin/website/careers', permission: 'website.careers.manage' },
    { id: 'website-legal', label: 'Legal Pages', icon: FileText, path: '/admin/website/legal', permission: 'website.legal.manage' },
    { id: 'website-settings', label: 'Site Settings', icon: Settings, path: '/admin/website/settings', permission: 'website.settings.manage' },
  ].filter((item) => hasPermission(currentPermissions, item.permission));

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 flex items-center space-x-3 border-b border-[var(--border)]">
          <div className="w-8 h-8 relative">
            <SafeImage
              src="https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png"
              alt="Raiyansoft"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-[var(--text)] font-bold text-lg leading-none">Raiyansoft</h1>
            <span className="text-xs text-primary font-medium">Admin Panel</span>
          </div>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname.includes(item.path);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  router.push(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`}
              >
                <div className="relative">
                  <item.icon size={20} />
                  {item.badge > 0 ? (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-[var(--surface)] shadow-sm z-10">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}

          {websiteNavItems.length > 0 ? (
            <div className="pt-5 mt-5 border-t border-[var(--border)]">
              <p className="px-4 mb-2 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] font-bold">
                Website Content
              </p>
              <div className="space-y-1">
                {websiteNavItems.map((item) => {
                  const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        router.push(item.path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-4 border-t border-[var(--border)] text-center">
          <p className="text-[10px] text-[var(--text-muted)]">v1.2.0 • Admin Dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)] flex overflow-hidden font-sans">
      <aside className="hidden md:block w-64 bg-[var(--surface)] border-r border-[var(--border)] shadow-2xl z-20 shrink-0">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col relative w-full h-screen overflow-hidden">
        <header className="h-16 shrink-0 bg-[var(--surface)] backdrop-blur-md border-b border-[var(--border)] flex items-center justify-between px-4 z-30 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="md:hidden flex items-center space-x-2">
              <SafeImage
                src="https://raiyansoft.com/wp-content/uploads/2024/05/cropped-App-Icon-1.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-[var(--text)] text-sm">Admin</span>
            </div>

            <div className="hidden md:block text-[var(--text-muted)] text-sm font-medium" />
          </div>

          <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
            aria-label="Toggle theme"
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
                <Avatar name={currentUser?.displayName || 'Admin'} size="sm" className="w-full h-full text-xs" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-[var(--text)] leading-none">{currentUser?.displayName || 'Admin User'}</p>
                <p className="text-[10px] text-[var(--text-muted)] leading-none mt-1 group-hover:text-primary transition-colors">
                  View Account
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
                    <span>Edit Account</span>
                  </button>

                  <div className="my-1 border-t border-[var(--border)]" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
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
                className="fixed inset-y-0 left-0 w-64 bg-[var(--surface)] border-r border-[var(--border)] z-50 md:hidden shadow-2xl"
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

        <main className="flex-1 overflow-y-auto bg-[var(--bg)] p-4 md:p-8 relative">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10 h-full pb-20">{children}</div>
        </main>
      </div>
    </div>
  );
}


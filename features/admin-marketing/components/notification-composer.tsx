import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CheckCircle, Send, Loader2 } from 'lucide-react';
import Avatar from '@/components/ui/avatar';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { AdminUser as User } from '@/features/admin-users/types/admin-user.types';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notificationSchema, NotificationValues } from '../schemas/notification.schema';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { translateMessage } from '@/lib/i18n-utils';

interface NotificationComposerProps {
  targetType: 'all' | 'single';
  setTargetType: React.Dispatch<React.SetStateAction<'all' | 'single'>>;
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  showUserDropdown: boolean;
  setShowUserDropdown: (val: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  filteredUsers: User[];
  isSearchingUsers: boolean;
  userSearchFailed: boolean;
  handleUserSelect: (user: User) => void;
  formData: NotificationValues;
  setFormData: React.Dispatch<React.SetStateAction<NotificationValues>>;
  handleSubmit: (data: NotificationValues) => Promise<void>;
  isSending: boolean;
  successMessage: string | null;
}

export default function NotificationComposer({
  targetType,
  setTargetType,
  selectedUser,
  setSelectedUser,
  searchQuery,
  setSearchQuery,
  showUserDropdown,
  setShowUserDropdown,
  dropdownRef,
  filteredUsers,
  isSearchingUsers,
  userSearchFailed,
  handleUserSelect,
  formData,
  setFormData,
  handleSubmit,
  isSending,
  successMessage,
}: NotificationComposerProps) {
  const form = useForm<NotificationValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: formData,
  });

  // Reset the visible form when the parent clears formData (e.g. after a
  // successful send). Do NOT sync every keystroke back into formData via
  // form.watch() + form.reset() here — that created a watch -> setFormData
  // -> reset -> watch loop that fired on every render and made typing (and
  // the rest of the page) freeze after one character.
  useEffect(() => {
    form.reset(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const isScheduled = form.watch('isScheduled');

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{translateMessage('Recipients')}</label>
            <div className="flex bg-[var(--surface-3)] p-1 rounded-xl border border-[var(--border)] w-full sm:w-fit">
              <button
                type="button"
                onClick={() => setTargetType('all')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  targetType === 'all'
                    ? 'bg-primary text-on-primary shadow-lg'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {translateMessage('All Users')}
              </button>
              <button
                type="button"
                onClick={() => setTargetType('single')}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  targetType === 'single'
                    ? 'bg-primary text-on-primary shadow-lg'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {translateMessage('Single User')}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {targetType === 'single' ? (
                <motion.div
                  initial={false}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-visible"
                >
                  {!selectedUser ? (
                    <div className="relative" ref={dropdownRef}>
                      <Input
                        type="text"
                        icon={<Search size={18} />}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowUserDropdown(true);
                        }}
                        onFocus={() => setShowUserDropdown(true)}
                        placeholder={translateMessage('Search user by name, email, or phone...')}
                      />

                      <AnimatePresence>
                        {showUserDropdown && searchQuery.trim() ? (
                          <motion.div
                            initial={false}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full start-0 end-0 mt-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden"
                          >
                            {isSearchingUsers ? (
                              <div role="status" className="p-4 flex items-center justify-center gap-2 text-[var(--text-muted)] text-sm">
                                <Loader2 className="animate-spin" size={16} />
                                {translateMessage('Loading...')}
                              </div>
                            ) : userSearchFailed ? (
                              <div className="p-4 text-center text-danger text-sm">{translateMessage('Failed to load users.')}</div>
                            ) : filteredUsers.length > 0 ? (
                              filteredUsers.map((user) => (
                                <button
                                  key={user.id}
                                  type="button"
                                  onClick={() => handleUserSelect(user)}
                                  className="w-full text-start p-3 hover:bg-white/5 border-b border-[var(--border)] last:border-0 flex items-center gap-3 transition-colors"
                                >
                                  <Avatar name={`${user.firstName} ${user.lastName}`} size="sm" className="w-8 h-8 text-xs" />
                                  <div>
                                    <div className="text-sm font-medium text-[var(--text)]">
                                      {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">{user.email}</div>
                                  </div>
                                  <span
                                    className={`ms-auto text-[11px] px-2 py-0.5 rounded-full ${
                                      user.status === 'Active'
                                        ? 'bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-success'
                                        : 'bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-danger'
                                    }`}
                                  >
                                    {translateMessage(user.status)}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="p-4 text-center text-[var(--text-muted)] text-sm">{translateMessage('No users found')}</div>
                            )}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-[var(--surface-3)] border border-primary/30 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={`${selectedUser.firstName} ${selectedUser.lastName}`}
                          size="md"
                          className="w-10 h-10 text-sm"
                        />
                        <div>
                          <div className="font-bold text-[var(--text)] text-sm">
                            {selectedUser.firstName} {selectedUser.lastName}
                          </div>
                          <div className="text-xs text-[var(--text-muted)]">{selectedUser.email}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedUser(null)}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--surface-3)] hover:bg-[var(--surface-3)] rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="space-y-4 pt-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-bold uppercase tracking-wider">{translateMessage('Title')}</FieldLabel>
                  <Input
                    {...field}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    className={fieldState.invalid ? 'border-danger' : ''}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="font-bold uppercase tracking-wider">{translateMessage('Message')}</FieldLabel>
                  <Textarea
                    {...field}
                    rows={4}
                    aria-invalid={fieldState.invalid}
                    className={`resize-none ${fieldState.invalid ? 'border-danger' : ''}`}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="imageUrl"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-bold uppercase tracking-wider">{translateMessage('Image URL (Optional)')}</FieldLabel>
                    <Input
                      {...field}
                      type="url"
                      aria-invalid={fieldState.invalid}
                      className={fieldState.invalid ? 'border-danger' : ''}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="deepLink"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-bold uppercase tracking-wider">{translateMessage('Deep Link (Optional)')}</FieldLabel>
                    <Input
                      {...field}
                      type="text"
                      aria-invalid={fieldState.invalid}
                      className={fieldState.invalid ? 'border-danger' : ''}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="isScheduled"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="schedule"
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 rounded border-[var(--border)] text-primary focus:ring-primary bg-[var(--surface-2)]"
                  />
                  <label htmlFor="schedule" className="text-sm font-medium text-[var(--text)]">
                    {translateMessage('Schedule for later')}
                  </label>
                </div>
              )}
            />

            {isScheduled ? (
              <Controller
                name="scheduledDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="font-bold uppercase tracking-wider">{translateMessage('Schedule Date & Time')}</FieldLabel>
                    <Input
                      {...field}
                      type="datetime-local"
                      aria-invalid={fieldState.invalid}
                      className={fieldState.invalid ? 'border-danger' : ''}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ) : null}

            <button
              type="submit"
              disabled={isSending}
              className="w-full mt-4 bg-primary hover:bg-primary-dark text-on-primary font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isSending ? <CheckCircle className="animate-spin" size={20} /> : <Send size={20} />}
              <span>{translateMessage(isSending ? 'Sending...' : 'Send Notification')}</span>
            </button>
            {successMessage ? (
              <div className="text-success text-center text-sm font-medium mt-2">{translateMessage(successMessage)}</div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

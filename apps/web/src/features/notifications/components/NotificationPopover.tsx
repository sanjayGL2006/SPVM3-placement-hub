import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Calendar, Sparkles, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useNotificationStore } from '../stores/notificationStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../shared/utils/cn';

export const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } =
    useNotificationStore();

  const count = unreadCount();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'drive':
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-stone-900">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#1C1C1C] border border-stone-200 dark:border-stone-800 shadow-2xl z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">
                Notifications
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {count} unread updates
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={markAllAsRead}
                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-xs flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={clearNotifications}
                className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-xs"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/60">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">
                No notifications right now
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.link) {
                      navigate(notif.link);
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    'p-4 flex gap-3 transition-colors cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40',
                    !notif.read && 'bg-indigo-50/30 dark:bg-indigo-950/20'
                  )}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-stone-100 dark:bg-stone-800 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-100">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-stone-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 self-center shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { CommandPalette } from './CommandPalette';
import { AppLauncherModal } from './AppLauncherModal';

export const AppLayout: React.FC = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#0F0F0F] text-stone-900 dark:text-stone-50 flex">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block w-[280px] shrink-0">
        <Sidebar className="fixed left-0 top-0" />
      </div>

      {/* Mobile Drawer (Slide-out Sidebar with Backdrop) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-[280px] h-full shadow-2xl"
            >
              <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <TopBar
          onOpenCommand={() => setCommandOpen(true)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenLauncher={() => setLauncherOpen(true)}
        />

        <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenLauncher={() => setLauncherOpen(true)} />

      {/* Global Command Search (Cmd+K) */}
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />

      {/* Visual A-to-Z App Suite Launcher */}
      <AppLauncherModal isOpen={launcherOpen} onClose={() => setLauncherOpen(false)} />
    </div>
  );
};

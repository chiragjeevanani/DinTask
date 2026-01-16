import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '@/shared/utils/animations';

const AdminLayout = ({ role }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans transition-colors duration-300">
            {/* Sidebar with mobile responsiveness */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} role={role} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64 relative min-h-screen">
                {/* Header/Top Navigation */}
                <TopNav onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Page Content */}
                <main className="flex-1 px-4 md:px-8 pt-24 pb-28">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            variants={pageVariants}
                            transition={{ duration: 0.2 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Footer overlay - Minimal and clean */}
                <footer className="fixed bottom-0 right-0 left-0 lg:left-64 py-4 px-4 md:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 transition-colors duration-300">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                            &copy; 2024 <span className="text-primary-600">DINTASK</span> CRM. ALL RIGHTS RESERVED.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-primary-500 uppercase tracking-widest transition-colors">Support</a>
                            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-primary-500 uppercase tracking-widest transition-colors">Privacy</a>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout;

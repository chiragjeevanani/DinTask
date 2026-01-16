import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Fingerprint, Smartphone, ExternalLink, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/utils/cn';
import { fadeInUp } from '@/shared/utils/animations';

const Security = () => {
    const navigate = useNavigate();
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);

    const handlePasswordChange = () => {
        toast.info('Password reset link sent to your email');
    };

    const toggle2FA = () => {
        setIs2FAEnabled(!is2FAEnabled);
        toast.success(`Two-factor authentication ${!is2FAEnabled ? 'enabled' : 'disabled'}`);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex items-center p-4 justify-between max-w-[480px] mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold">Security</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-[480px] mx-auto px-6 pt-4 space-y-8">
                {/* Status Hero */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-400">Account Secured</h3>
                            <p className="text-[10px] text-emerald-700 dark:text-emerald-500 font-medium leading-tight">Your account is fully protected with our advanced encryption.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Login & Recovery */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Login & Recovery</h3>
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                        <CardContent className="p-0 divide-y divide-slate-50 dark:divide-slate-800">
                            <div className="flex items-center justify-between p-4 group cursor-pointer" onClick={handlePasswordChange}>
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
                                        <Lock size={18} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Change Password</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <ExternalLink size={16} className="text-slate-300" />
                            </div>

                            <div className="flex items-center justify-between p-4 group cursor-pointer" onClick={toggle2FA}>
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
                                        <Smartphone size={18} className="text-amber-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Auth</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Highly recommended for safety</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-colors",
                                    is2FAEnabled ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                                )}>
                                    {is2FAEnabled ? 'Active' : 'Off'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Hardware & Sessions */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Devices & Sessions</h3>
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                        <CardContent className="p-0 divide-y divide-slate-50 dark:divide-slate-800">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                        <Fingerprint size={18} className="text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Biometric Login</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Use FaceID or Fingerprint</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="h-8 px-3 text-[10px] font-black bg-slate-50 dark:bg-slate-800 text-slate-600">Setup</Button>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                        <Key size={18} className="text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Active Sessions</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Log out from other devices</p>
                                    </div>
                                </div>
                                <Button variant="ghost" className="h-8 px-3 text-[10px] font-black bg-slate-50 dark:bg-slate-800 text-red-500">Sign Out All</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Security;

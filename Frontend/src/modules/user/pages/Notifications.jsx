import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Mail, Smartphone, Monitor, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Switch } from "@/shared/components/ui/switch";
import { Card, CardContent } from '@/shared/components/ui/card';
import { fadeInUp } from '@/shared/utils/animations';

const Notifications = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        push: true,
        email: true,
        desktop: false,
        taskUpdates: true,
        mentions: true,
        security: true
    });

    const toggleSetting = (key) => {
        setSettings(prev => {
            const newValue = !prev[key];
            toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${newValue ? 'enabled' : 'disabled'}`);
            return { ...prev, [key]: newValue };
        });
    };

    const sections = [
        {
            title: 'Delivery Channels',
            items: [
                { id: 'push', icon: <Smartphone className="text-blue-500" />, label: 'Push Notifications', sub: 'In-app mobile alerts' },
                { id: 'email', icon: <Mail className="text-amber-500" />, label: 'Email Alerts', sub: 'Weekly digest and urgent updates' },
                { id: 'desktop', icon: <Monitor className="text-purple-500" />, label: 'Desktop App', sub: 'Native system notifications' },
            ]
        },
        {
            title: 'Activity Updates',
            items: [
                { id: 'taskUpdates', icon: <Bell className="text-emerald-500" />, label: 'Task Assignments', sub: 'When someone assigns you a task' },
                { id: 'mentions', icon: <Bell className="text-indigo-500" />, label: 'Mentions', sub: 'When someone mentions you in a comment' },
                { id: 'security', icon: <ShieldCheck className="text-red-500" />, label: 'Security Alerts', sub: 'Suspicious login attempts' },
            ]
        }
    ];

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
                    <h2 className="text-lg font-bold">Notifications</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-[480px] mx-auto px-6 pt-4 space-y-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        Choose how you want to be notified when something happens. You can control delivery for each activity type.
                    </p>
                </motion.div>

                {sections.map((section, idx) => (
                    <motion.div
                        key={idx}
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">{section.title}</h3>
                        <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                            <CardContent className="p-0 divide-y divide-slate-50 dark:divide-slate-800">
                                {section.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{item.sub}</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings[item.id]}
                                            onCheckedChange={() => toggleSetting(item.id)}
                                            className="data-[state=checked]:bg-primary"
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;

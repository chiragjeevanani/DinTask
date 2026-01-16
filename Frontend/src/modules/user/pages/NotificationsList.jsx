import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCheck, Trash2, Bell, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import useNotificationStore from '@/store/notificationStore';
import { cn } from '@/shared/utils/cn';
import { fadeInUp, staggerContainer, scaleOnTap } from '@/shared/utils/animations';

const NotificationsList = () => {
    const navigate = useNavigate();
    const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();

    const unreadNotifications = notifications.filter(n => !n.isRead);
    const readNotifications = notifications.filter(n => n.isRead);

    const handleMarkAll = () => {
        markAllAsRead();
        toast.success('All notifications marked as read');
    };

    const getIcon = (category) => {
        switch (category) {
            case 'task': return <Bell className="text-blue-500" size={16} />;
            case 'comment': return <MessageSquare className="text-emerald-500" size={16} />;
            case 'deadline': return <AlertCircle className="text-amber-500" size={16} />;
            default: return <Clock className="text-slate-500" size={16} />;
        }
    };

    const NotificationItem = ({ notification }) => (
        <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "p-4 flex items-start gap-4 transition-colors relative group",
                !notification.isRead ? "bg-primary/5 dark:bg-primary/10" : ""
            )}
        >
            <div className={cn(
                "p-2.5 rounded-2xl shrink-0 transition-transform group-hover:scale-110",
                !notification.isRead ? "bg-white dark:bg-slate-800 shadow-sm" : "bg-slate-50 dark:bg-slate-900"
            )}>
                {getIcon(notification.category)}
            </div>
            <div className="flex-1 space-y-1 pr-8">
                <div className="flex items-center justify-between">
                    <p className={cn("text-xs font-bold", !notification.isRead ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400")}>
                        {notification.title}
                    </p>
                    <span className="text-[9px] text-slate-400 font-medium">{notification.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {notification.description}
                </p>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                {!notification.isRead && (
                    <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-primary shadow-sm"
                    >
                        <CheckCheck size={14} />
                    </button>
                )}
                <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-red-500 shadow-sm"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center p-4 justify-between max-w-[480px] mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-lg font-black tracking-tight">Notifications</h2>
                    </div>
                    {unreadNotifications.length > 0 && (
                        <button
                            onClick={handleMarkAll}
                            className="text-[10px] font-black text-primary uppercase tracking-widest px-3 py-1.5 hover:bg-primary/5 rounded-full transition-colors"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-[480px] mx-auto pt-6 space-y-8 px-6">
                <AnimatePresence mode="popLayout">
                    {notifications.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="py-20 flex flex-col items-center justify-center text-slate-400"
                        >
                            <Bell size={48} className="opacity-10 mb-4" />
                            <p className="text-sm font-bold">All caught up!</p>
                            <p className="text-[11px]">No new notifications for you.</p>
                        </motion.div>
                    ) : (
                        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8 pb-10">
                            {/* Unread Section */}
                            {unreadNotifications.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] ml-1">New For You</h3>
                                    <Card className="border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden">
                                        <CardContent className="p-0 divide-y divide-slate-50 dark:divide-slate-800">
                                            <AnimatePresence mode="popLayout">
                                                {unreadNotifications.map(notification => (
                                                    <NotificationItem key={notification.id} notification={notification} />
                                                ))}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Read Section */}
                            {readNotifications.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Earlier</h3>
                                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden">
                                        <CardContent className="p-0 divide-y divide-slate-50 dark:divide-slate-800">
                                            <AnimatePresence mode="popLayout">
                                                {readNotifications.map(notification => (
                                                    <NotificationItem key={notification.id} notification={notification} />
                                                ))}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NotificationsList;

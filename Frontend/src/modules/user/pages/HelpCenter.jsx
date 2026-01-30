import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileText, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { fadeInUp } from '@/shared/utils/animations';
import { motion } from 'framer-motion';

const HelpCenter = () => {
    const navigate = useNavigate();

    const articles = [
        { title: 'Getting Started with DinTask', category: 'Basics' },
        { title: 'How to create your first task', category: 'Tasks' },
        { title: 'Managing your profile settings', category: 'Account' },
        { title: 'Understanding role permissions', category: 'Teams' },
        { title: 'Syncing your calendar', category: 'Integrations' },
        { title: 'Notification preferences', category: 'Settings' },
    ];

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-10">
            <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex items-center p-4 justify-between max-w-[600px] mx-auto">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold">Help Center</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-[600px] mx-auto px-6 pt-4 space-y-8"
            >
                <div className="text-center space-y-2 py-4">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">How can we help?</h1>
                    <div className="relative max-w-sm mx-auto">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search articles..."
                            className="pl-10 h-10 bg-white dark:bg-slate-900 border-none shadow-sm rounded-xl focus-visible:ring-primary-500"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Popular Articles</h3>
                    <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                        <CardContent className="p-0 divide-y divide-slate-50 dark:divide-slate-800">
                            {articles.map((article, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{article.title}</p>
                                            <p className="text-[10px] text-slate-400">{article.category}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};

export default HelpCenter;

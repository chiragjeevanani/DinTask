import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, Copy, Check } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { fadeInUp } from '@/shared/utils/animations';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ApiDocs = () => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('npm install dintask-sdk');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-10">
            <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex items-center p-4 justify-between max-w-[600px] mx-auto">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold">API Documentation</h2>
                    <div className="w-10"></div>
                </div>
            </div>

            <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="max-w-[600px] mx-auto px-6 pt-4 space-y-6"
            >
                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                    <CardContent className="p-6 space-y-6">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Developer API</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Welcome to the DinTask API documentation. Our API allows you to integrate your own applications with the DinTask platform.
                        </p>

                        <div className="space-y-2">
                            <h3 className="font-bold text-sm">Installation</h3>
                            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs flex items-center justify-between">
                                <span>npm install dintask-sdk</span>
                                <button onClick={handleCopy} className="p-1 hover:bg-slate-700 rounded transition-colors">
                                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-sm">Endpoints</h3>
                            <div className="space-y-2">
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-2 font-mono text-xs">
                                    <span className="text-emerald-600 font-bold">GET</span>
                                    <span>/api/v1/tasks</span>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-2 font-mono text-xs">
                                    <span className="text-blue-600 font-bold">POST</span>
                                    <span>/api/v1/tasks</span>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-2 font-mono text-xs">
                                    <span className="text-amber-600 font-bold">PUT</span>
                                    <span>/api/v1/tasks/:id</span>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-2 font-mono text-xs">
                                    <span className="text-red-600 font-bold">DELETE</span>
                                    <span>/api/v1/tasks/:id</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ApiDocs;

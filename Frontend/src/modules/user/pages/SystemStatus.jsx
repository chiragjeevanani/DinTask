import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { fadeInUp } from '@/shared/utils/animations';
import { motion } from 'framer-motion';

const SystemStatus = () => {
    const navigate = useNavigate();

    const services = [
        { name: 'API', status: 'operational' },
        { name: 'Web App', status: 'operational' },
        { name: 'Database', status: 'operational' },
        { name: 'Notifications', status: 'degraded' },
        { name: 'Background Jobs', status: 'operational' },
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'operational': return <CheckCircle2 size={18} className="text-emerald-500" />;
            case 'degraded': return <AlertTriangle size={18} className="text-amber-500" />;
            case 'down': return <XCircle size={18} className="text-red-500" />;
            default: return <Info size={18} className="text-slate-400" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'operational': return 'Operational';
            case 'degraded': return 'Degraded Performance';
            case 'down': return 'Major Outage';
            default: return 'Unknown';
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-10">
            <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex items-center p-4 justify-between max-w-[600px] mx-auto">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold">System Status</h2>
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
                    <div className="bg-emerald-500 p-6 text-white text-center">
                        <CheckCircle2 size={48} className="mx-auto mb-4" />
                        <h3 className="text-xl font-bold">All systems operational</h3>
                        <p className="text-emerald-100 text-sm mt-1">Last updated: Just now</p>
                    </div>
                </Card>

                <Card className="border-none shadow-sm bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
                    <CardContent className="p-0 divide-y divide-slate-50 dark:divide-slate-800">
                        {services.map((service, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4">
                                <span className="font-bold text-slate-900 dark:text-white">{service.name}</span>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span className={
                                        service.status === 'operational' ? 'text-emerald-500' :
                                            service.status === 'degraded' ? 'text-amber-500' : 'text-red-500'
                                    }>
                                        {getStatusText(service.status)}
                                    </span>
                                    {getStatusIcon(service.status)}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="text-center text-xs text-slate-400">
                    If you are experiencing issues not listed here, please contact support.
                </div>
            </motion.div>
        </div>
    );
};

export default SystemStatus;

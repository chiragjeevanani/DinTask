import React, { useMemo } from 'react';
import {
    BarChart3,
    FileText,
    Download,
    TrendingUp,
    Clock,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Calendar as CalendarIcon,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from 'recharts';
import { motion } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useTaskStore from '@/store/taskStore';
import useEmployeeStore from '@/store/employeeStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

const ManagerReports = () => {
    const { user } = useAuthStore();
    const tasks = useTaskStore(state => state.tasks);
    const employees = useEmployeeStore(state => state.employees);

    const teamTasks = useMemo(() => tasks.filter(t => t.delegatedBy === user?.id), [tasks, user]);

    // Chart data
    const statusData = useMemo(() => {
        const completed = teamTasks.filter(t => t.status === 'completed').length;
        const pending = teamTasks.filter(t => t.status === 'pending').length;
        const inProgress = teamTasks.filter(t => t.status === 'in-progress').length;
        return [
            { name: 'Completed', value: completed, color: '#10b981' },
            { name: 'Pending', value: pending, color: '#f59e0b' },
            { name: 'In Progress', value: inProgress, color: '#3b82f6' }
        ];
    }, [teamTasks]);

    const weeklyData = [
        { name: 'Mon', count: 4 },
        { name: 'Tue', count: 7 },
        { name: 'Wed', count: 5 },
        { name: 'Thu', count: 12 },
        { name: 'Fri', count: 8 },
        { name: 'Sat', count: 3 },
        { name: 'Sun', count: 2 }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Reports & Analytics</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Comprehensive insights into team performance and task completion trends.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <CalendarIcon size={18} />
                        Filter Period
                    </Button>
                    <Button className="gap-2">
                        <Download size={18} />
                        Export Report
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Stats cards can go here */}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Task Status Distribution */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <PieChartIcon className="text-primary-500" size={20} />
                            Task Status Distribution
                        </CardTitle>
                        <CardDescription>Current status breakdown for all team tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-4">
                            {statusData.map((s) => (
                                <div key={s.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                                    <span className="text-xs font-bold text-slate-500">{s.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Weekly Completion Trend */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" size={20} />
                            Weekly Completion Trend
                        </CardTitle>
                        <CardDescription>Number of tasks completed per day</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#ec4899"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Export Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold">Team Activity Log</CardTitle>
                        <CardDescription>Recent actions from all team members</CardDescription>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Time</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Employee</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Task</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Empty state for now */}
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-sm text-slate-400 italic">
                                    Activity data will appear as your team starts updating tasks.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ManagerReports;

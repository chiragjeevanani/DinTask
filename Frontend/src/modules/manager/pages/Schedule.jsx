import React, { useState, useMemo } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Users,
    Search,
    Filter
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import useEmployeeStore from '@/store/employeeStore';
import useTaskStore from '@/store/taskStore';
import useScheduleStore from '@/store/scheduleStore';
import { fadeInUp, staggerContainer } from '@/shared/utils/animations';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from '@/shared/components/ui/badge';
import { cn } from '@/shared/utils/cn';

const ManagerSchedule = () => {
    const { user } = useAuthStore();
    const employees = useEmployeeStore(state => state.employees);
    const tasks = useTaskStore(state => state.tasks);
    const { schedules } = useScheduleStore();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedMember, setSelectedMember] = useState('all');

    const teamMembers = useMemo(() => {
        return employees.filter(e => e.managerId === user?.id);
    }, [employees, user]);

    // Calendar logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const getDailyEvents = (day) => {
        const teamTasks = tasks.filter(t => (t.delegatedBy === user?.id || t.assignedToManager === user?.id) && isSameDay(new Date(t.deadline), day));
        const userSchedules = schedules.filter(s => (s.managerId === user?.id) && isSameDay(new Date(s.date), day));

        return [...teamTasks.map(t => ({ ...t, type: 'task' })), ...userSchedules.map(s => ({ ...s, type: 'schedule' }))];
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Team Schedule</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Coordinate tasks and manage team availability.
                    </p>
                </div>
                <Button className="gap-2">
                    <Plus size={18} />
                    New Schedule Event
                </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-4">
                {/* Filters/Sidebar */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Team Filter</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant={selectedMember === 'all' ? 'default' : 'outline'}
                                className="w-full justify-start gap-2 h-10 rounded-xl"
                                onClick={() => setSelectedMember('all')}
                            >
                                <Users size={16} /> All Team
                            </Button>
                            {teamMembers.map((member) => (
                                <Button
                                    key={member.id}
                                    variant={selectedMember === member.id ? 'default' : 'outline'}
                                    className="w-full justify-start gap-2 h-10 rounded-xl"
                                    onClick={() => setSelectedMember(member.id)}
                                >
                                    <div className="w-5 h-5 rounded-full overflow-hidden">
                                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="truncate">{member.name}</span>
                                </Button>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-primary-600 text-white overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                            <Clock size={32} className="opacity-50" />
                            <div>
                                <h3 className="font-bold text-lg">Daily Briefing</h3>
                                <p className="text-xs text-primary-100 mt-1">Don't forget the team sync at 10:00 AM today.</p>
                            </div>
                            <Button variant="secondary" size="sm" className="w-full font-bold text-primary-600">Join Meet</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar Grid */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                                <ChevronLeft size={20} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
                            <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="p-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest font-display">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7">
                            {calendarDays.map((day, idx) => {
                                const events = getDailyEvents(day);
                                return (
                                    <div
                                        key={day.toString()}
                                        className={cn(
                                            "min-h-[120px] p-2 border-r border-b border-slate-50 dark:border-slate-800 last:border-r-0 transition-colors",
                                            !isSameMonth(day, monthStart) ? "bg-slate-50/20 dark:bg-slate-800/10 opacity-30" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
                                            isSameDay(day, new Date()) && "bg-primary-50/30 dark:bg-primary-900/10"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={cn(
                                                "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full leading-none transition-all",
                                                isSameDay(day, new Date()) ? "bg-primary-600 text-white" : "text-slate-400 group-hover:text-slate-900"
                                            )}>
                                                {format(day, 'd')}
                                            </span>
                                            {events.length > 0 && (
                                                <Badge className="h-4 px-1.5 text-[8px] bg-primary-100 text-primary-600 border-none font-black uppercase">
                                                    {events.length} Items
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="space-y-1 overflow-hidden">
                                            {events.slice(0, 3).map((event, eIdx) => (
                                                <div key={eIdx} className={cn(
                                                    "px-1.5 py-0.5 rounded text-[8px] font-bold truncate transition-all",
                                                    event.type === 'task' ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                )}>
                                                    {event.title}
                                                </div>
                                            ))}
                                            {events.length > 3 && (
                                                <div className="text-[8px] font-bold text-slate-400 pl-1">
                                                    + {events.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerSchedule;

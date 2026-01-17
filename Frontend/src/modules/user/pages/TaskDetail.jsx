import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Clock,
    Calendar as CalendarIcon,
    MapPin,
    MessageSquare,
    Users,
    Send,
    CheckCircle2,
    AlertTriangle,
    Flag,
    MoreVertical,
    Activity,
    Shield,
    ChevronRight,
    User
} from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { toast } from 'sonner';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";

import useTaskStore from '@/store/taskStore';
import useEmployeeStore from '@/store/employeeStore';
import useAuthStore from '@/store/authStore';
import useManagerStore from '@/store/managerStore';
import { cn } from '@/shared/utils/cn';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { tasks, updateTask, addActivity } = useTaskStore();
    const { employees } = useEmployeeStore();
    const { managers } = useManagerStore();
    const { user: currentUser } = useAuthStore();

    const [comment, setComment] = useState('');

    const task = useMemo(() => tasks.find(t => t.id === id), [tasks, id]);

    const handleAddComment = () => {
        if (!comment.trim()) return;

        addActivity(task.id, {
            user: currentUser?.name || 'User',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.name}`,
            content: comment,
            time: 'Just now',
            type: 'comment'
        });

        setComment('');
        toast.success('Comment added');
    };

    const handleMarkComplete = () => {
        updateTask(task.id, { status: 'completed', progress: 100 });
        addActivity(task.id, {
            user: currentUser?.name || 'User',
            content: 'marked this task as completed',
            time: 'Just now',
            type: 'system'
        });
        toast.success('Task completed!');
    };

    if (!task) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-background-light dark:bg-background-dark">
                <AlertTriangle size={48} className="mb-4 opacity-20" />
                <h2 className="text-xl font-bold text-text-main dark:text-white">Task Expired or Not Found</h2>
                <Button variant="link" onClick={() => navigate('/employee')} className="mt-2 text-primary">Back to Dashboard</Button>
            </div>
        );
    }

    const priorityConfig = {
        low: { label: 'Low', color: 'bg-green-100 text-green-600' },
        medium: { label: 'Medium', color: 'bg-orange-100 text-orange-600' },
        high: { label: 'High Priority', color: 'bg-red-100 text-red-600' },
        urgent: { label: 'Urgent', color: 'bg-red-100 text-red-600' }
    };
    const pConfig = priorityConfig[task.priority] || priorityConfig.low;

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32 font-display text-text-main dark:text-gray-100">
            {/* Top Navigation */}
            <div className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="flex items-center p-4 justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-tight">Task Details</h2>
                    <div className="flex items-center justify-end">
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-md mx-auto px-4 pt-2">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex gap-2 mb-3">
                        <div className={cn("flex h-7 items-center justify-center rounded-full px-3", pConfig.color)}>
                            <p className="text-xs font-bold uppercase tracking-wider">{pConfig.label}</p>
                        </div>
                        {task.labels && task.labels.map((label, i) => (
                            <div key={i} className="flex h-7 items-center justify-center rounded-full bg-primary/10 px-3">
                                <p className="text-primary text-xs font-bold uppercase tracking-wider">{label}</p>
                            </div>
                        ))}
                    </div>
                    <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-text-main dark:text-white">
                        {task.title}
                    </h1>
                </div>

                {/* Task Hierarchy Visualization */}
                <div className="mb-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assignment Path</h4>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                                <Shield size={18} />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Admin</span>
                        </div>
                        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700 relative">
                            <div className="absolute inset-x-0 -top-1 flex items-center justify-center">
                                <ChevronRight size={10} className="text-slate-300" />
                            </div>
                        </div>
                        {task.delegatedBy && (
                            <>
                                <div className="flex flex-col items-center gap-1">
                                    <Avatar className="h-10 w-10 border-2 border-primary-100">
                                        <AvatarImage src={managers.find(m => m.id === task.delegatedBy)?.avatar} />
                                        <AvatarFallback className="bg-primary-50 text-primary-600 font-bold">
                                            {managers.find(m => m.id === task.delegatedBy)?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary-600">Manager</span>
                                </div>
                                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700 relative">
                                    <div className="absolute inset-x-0 -top-1 flex items-center justify-center">
                                        <ChevronRight size={10} className="text-slate-300" />
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="flex flex-col items-center gap-1">
                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                <User size={18} />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">You</span>
                        </div>
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                            <CalendarIcon size={16} />
                            <span className="text-xs font-semibold uppercase">Deadline</span>
                        </div>
                        <p className="text-sm font-bold">{format(new Date(task.deadline), 'MMM dd, yyyy')}</p>
                        <p className="text-[10px] text-orange-600 font-medium">
                            {isAfter(new Date(task.deadline), new Date())
                                ? `${Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days remaining`
                                : 'Overdue'}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                            <Activity size={16} />
                            <span className="text-xs font-semibold uppercase">Progress</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-sm font-bold">{task.progress || 0}%</p>
                            <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
                                <div className="h-full bg-primary" style={{ width: `${task.progress || 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collaborators */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 px-1">Collaborators</h3>
                    <div className="flex items-center -space-x-2">
                        {task.assignedTo?.map(empId => {
                            const emp = employees.find(e => e.id === empId); // Mock lookup
                            // If not found in store, use mock visuals from ID
                            const avatar = emp?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${empId}`;
                            const name = emp?.name || 'User';
                            return (
                                <img
                                    key={empId}
                                    className="size-10 rounded-full border-2 border-background-light dark:border-background-dark object-cover bg-gray-100"
                                    src={avatar}
                                    alt={name}
                                />
                            );
                        })}
                        <button className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors">
                            <Users size={18} className="text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-8 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Description</h3>
                    <p className="text-text-main dark:text-gray-200 text-sm leading-relaxed">
                        {task.description}
                    </p>
                </div>

                {/* Activity Feed */}
                <div className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6 px-1">Activity Feed</h3>
                    <div className="relative space-y-8 before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100 dark:before:bg-gray-800">

                        {/* Render Mock Activity or Empty State */}
                        {task.activity && task.activity.length > 0 ? (
                            task.activity.map((item, idx) => (
                                <div key={idx} className="relative flex gap-4">
                                    <div className={cn(
                                        "z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-background-light dark:border-background-dark shadow-sm",
                                        item.type === 'system' ? "bg-blue-50 dark:bg-blue-900/20" : "bg-white dark:bg-gray-800"
                                    )}>
                                        {item.type === 'system' ? (
                                            <Activity className="text-blue-600 text-lg" size={18} />
                                        ) : (
                                            <img className="size-8 rounded-full object-cover" src={item.avatar || `https://i.pravatar.cc/150?u=${idx}`} alt={item.user} />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 pt-1">
                                        <p className="text-sm text-gray-700 dark:text-gray-200">
                                            <span className="font-bold">{item.user}</span>
                                            {item.type === 'system' ? (
                                                <span className="text-gray-500 font-normal"> {item.content}</span>
                                            ) : (
                                                <span className="text-xs font-normal text-gray-500 ml-2">{item.time}</span>
                                            )}
                                        </p>
                                        {item.type !== 'system' && (
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{item.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="relative flex gap-4 opacity-50">
                                <div className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-50 border-2 border-background-light shadow-sm">
                                    <MessageSquare size={16} />
                                </div>
                                <div className="pt-2">
                                    <p className="text-sm text-gray-500">No activity yet</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-t border-gray-100 dark:border-gray-800 z-30">
                <div className="max-w-md mx-auto space-y-4">
                    {/* Comment Input */}
                    <div className="relative">
                        <input
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                            className="w-full h-12 pl-4 pr-12 rounded-xl bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all"
                            placeholder="Add a comment..."
                            type="text"
                        />
                        <button
                            onClick={handleAddComment}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    {/* Primary Action */}
                    {task.status !== 'completed' ? (
                        <button
                            onClick={handleMarkComplete}
                            className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                        >
                            <CheckCircle2 size={24} />
                            <span>Mark Complete</span>
                        </button>
                    ) : (
                        <button disabled className="w-full h-14 bg-green-100 dark:bg-emerald-900/30 text-green-700 dark:text-emerald-400 font-bold rounded-xl flex items-center justify-center gap-2 opacity-80 cursor-not-allowed">
                            <CheckCircle2 size={24} />
                            <span>Completed</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;

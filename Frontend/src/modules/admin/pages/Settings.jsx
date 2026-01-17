import React, { useState, useEffect } from 'react';
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Lock,
    Mail,
    Smartphone,
    Check,
    Save,
    Trash2
} from 'lucide-react';
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
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Switch } from "@/shared/components/ui/switch";
import { Separator } from "@/shared/components/ui/separator";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useSearchParams } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

const Settings = () => {
    const { user } = useAuthStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const urlTab = searchParams.get('tab');
        if (urlTab && urlTab !== activeTab) {
            setActiveTab(urlTab);
        }
    }, [searchParams, activeTab]);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Settings updated successfully');
        }, 1000);
    };

    return (
        <div className="space-y-6 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Manage your account preferences and system configuration.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <main className="flex-1 max-w-2xl">
                    {activeTab === 'profile' && (
                        <div className="m-0 space-y-6 animate-in fade-in duration-300">
                            <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                                <CardHeader>
                                    <CardTitle>Public Profile</CardTitle>
                                    <CardDescription>How others see you in the system</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-50 dark:border-slate-800">
                                        <Avatar className="h-24 w-24 ring-4 ring-primary-50 dark:ring-primary-900/20 shadow-xl">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
                                            <AvatarFallback className="text-2xl font-bold bg-primary-600 text-white">{user?.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-3 text-center sm:text-left">
                                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                                <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-slate-200 dark:border-slate-800">Change Photo</Button>
                                                <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">Remove</Button>
                                            </div>
                                            <p className="text-[10px] text-slate-400 max-w-[200px]">Maximum size 2MB. JPG, PNG or SVG only.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="full-name">Full Name</Label>
                                            <Input id="full-name" defaultValue={user?.name} className="bg-slate-50 border-none dark:bg-slate-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" defaultValue={user?.email} className="bg-slate-50 border-none dark:bg-slate-800" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Workspace Description</Label>
                                        <Input id="bio" placeholder="e.g. Lead Management Team" className="bg-slate-50 border-none dark:bg-slate-800" />
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 flex justify-end">
                                    <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                                        {isSaving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Save size={16} />}
                                        Save Changes
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="m-0 space-y-6 animate-in fade-in duration-300">
                            <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                                <CardHeader>
                                    <CardTitle>Notifications</CardTitle>
                                    <CardDescription>Control when and how you receive alerts</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <div className="flex gap-3">
                                                <Mail className="text-primary-500 mt-1" size={18} />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Email Notifications</p>
                                                    <p className="text-xs text-slate-500">Receive reports and task updates via email</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <div className="flex gap-3">
                                                <Smartphone className="text-primary-500 mt-1" size={18} />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Push Notifications</p>
                                                    <p className="text-xs text-slate-500">Enable real-time alerts on your browser</p>
                                                </div>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>

                                    <Separator className="bg-slate-100 dark:bg-slate-800" />

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Team Activity Alerts</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="task-created" defaultChecked />
                                                <label htmlFor="task-created" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">New task assigned</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox id="task-completed" defaultChecked />
                                                <label htmlFor="task-completed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Task completed by employee</label>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="m-0 space-y-6 animate-in fade-in duration-300">
                            <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                                <CardHeader>
                                    <CardTitle>Password & Security</CardTitle>
                                    <CardDescription>Update your credentials</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-pass">Current Password</Label>
                                        <Input id="current-pass" type="password" placeholder="••••••••" className="bg-slate-50 border-none dark:bg-slate-800" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-pass">New Password</Label>
                                            <Input id="new-pass" type="password" placeholder="••••••••" className="bg-slate-50 border-none dark:bg-slate-800" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-pass">Confirm Password</Label>
                                            <Input id="confirm-pass" type="password" placeholder="••••••••" className="bg-slate-50 border-none dark:bg-slate-800" />
                                        </div>
                                    </div>
                                    <Button className="w-full mt-4 bg-slate-900 dark:bg-white dark:text-slate-900 font-bold">Update Password</Button>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="m-0 space-y-6 animate-in fade-in duration-300">
                            <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
                                <CardHeader>
                                    <CardTitle>Appearance</CardTitle>
                                    <CardDescription>Customize the look and feel of your dashboard</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2 group cursor-pointer" onClick={() => document.documentElement.classList.remove('dark')}>
                                            <div className="aspect-video rounded-xl bg-slate-100 border-2 border-slate-200 group-hover:border-primary-500 transition-all flex items-center justify-center">
                                                <Check className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-tighter">Light Mode</p>
                                        </div>
                                        <div className="space-y-2 group cursor-pointer" onClick={() => document.documentElement.classList.add('dark')}>
                                            <div className="aspect-video rounded-xl bg-slate-900 border-2 border-slate-800 group-hover:border-primary-500 transition-all flex items-center justify-center">
                                                <Check className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-tighter">Dark Mode</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Settings;

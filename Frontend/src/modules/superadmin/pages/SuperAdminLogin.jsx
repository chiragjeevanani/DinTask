import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const SuperAdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const success = await login(email, password, 'superadmin');
        if (success) {
            toast.success('System Access Granted');
            navigate('/superadmin');
        } else {
            toast.error(error || 'Access Denied');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-900/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />

            <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl overflow-hidden relative z-10">
                <div className="absolute inset-0 bg-slate-900/80 -z-10" />

                <CardHeader className="text-center space-y-2 pt-10 pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 rounded-full" />
                            <div className="p-4 rounded-full bg-slate-900 border border-slate-800 relative z-10 text-red-500 shadow-xl">
                                <Shield className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-black tracking-tight text-white uppercase">
                        System Control
                    </CardTitle>
                    <p className="text-slate-500 text-sm font-medium">Restricted Access Area</p>
                </CardHeader>

                <CardContent className="space-y-6 px-8 pt-8 pb-8">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-400 text-xs uppercase tracking-widest font-bold">Admin Identifier</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="superadmin@dintask.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-700 h-12 pl-4 focus:border-red-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-400 text-xs uppercase tracking-widest font-bold">Secure Key</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-700 h-12 pl-4 focus:border-red-500/50 transition-colors"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold tracking-wide transition-all bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg shadow-red-900/20 border-0"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="animate-pulse">VERIFYING...</span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Lock size={16} /> AUTHENTICATE
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="bg-slate-950/80 border-t border-slate-800 p-4">
                    <div className="w-full flex justify-between items-center text-[10px] text-slate-500 font-mono">
                        <span>SECURE CONNECTION</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ONLINE</span>
                    </div>
                </CardFooter>
                {/* Demo Helper - Removable in Prod */}
                <div className="absolute top-2 right-2 opacity-10 hover:opacity-100 transition-opacity p-2 text-[9px] text-slate-400 bg-black rounded cursor-default z-50">
                    superadmin@dintask.com / super123
                </div>
            </Card>

            <div className="absolute bottom-6 text-center">
                <p className="text-[10px] text-slate-600 font-mono">UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED</p>
                <p className="text-[10px] text-slate-700 font-mono mt-1">IP: ::1 // SESSION ID: 9X-214</p>
            </div>
        </div>
    );
};

export default SuperAdminLogin;

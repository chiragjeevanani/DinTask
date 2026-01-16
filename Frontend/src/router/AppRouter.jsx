import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import useAuthStore from '@/store/authStore';

const NotFoundRedirect = () => {
    const { isAuthenticated, role } = useAuthStore();

    if (!isAuthenticated) return <Navigate to="/employee/login" replace />;

    const defaultRoute = role === 'superadmin'
        ? '/superadmin'
        : role === 'admin'
            ? '/admin'
            : '/employee';

    return <Navigate to={defaultRoute} replace />;
};

// Layouts
import AdminLayout from '@/shared/layouts/AdminLayout';
import EmployeeLayout from '@/shared/layouts/EmployeeLayout';

// Auth Pages
import EmployeeLogin from '@/modules/user/pages/EmployeeLogin';
import AdminLogin from '@/modules/admin/pages/AdminLogin';
import SuperAdminLogin from '@/modules/superadmin/pages/SuperAdminLogin';

// Admin Pages
import AdminDashboard from '@/modules/admin/pages/Dashboard';
import EmployeeManagement from '@/modules/admin/pages/EmployeeManagement';
import TaskManagement from '@/modules/admin/pages/TaskManagement';
import TaskCompletion from '@/modules/admin/pages/TaskCompletion';
import Reports from '@/modules/admin/pages/Reports';
import AdminCalendar from '@/modules/admin/pages/Calendar';
import Subscription from '@/modules/admin/pages/Subscription';
import Settings from '@/modules/admin/pages/Settings';

// Employee Pages
import EmployeeDashboard from '@/modules/user/pages/TaskHome';
import TaskDetail from '@/modules/user/pages/TaskDetail';
import EmployeeCalendar from '@/modules/user/pages/Calendar';
import EmployeeNotes from '@/modules/user/pages/Notes';
import EmployeeProfile from '@/modules/user/pages/Profile';
import PersonalAccount from '@/modules/user/pages/PersonalAccount';
import Notifications from '@/modules/user/pages/Notifications';
import Security from '@/modules/user/pages/Security';
import Preferences from '@/modules/user/pages/Preferences';
import HelpLegal from '@/modules/user/pages/HelpLegal';
import AddTask from '@/modules/user/pages/AddTask';
import NotificationsList from '@/modules/user/pages/NotificationsList';

// Super Admin Pages
import SuperAdminDashboard from '@/modules/superadmin/pages/Dashboard';
import AdminAccounts from '@/modules/superadmin/pages/AdminAccounts';
import PlansManagement from '@/modules/superadmin/pages/PlansManagement';
import SuperAdminSettings from '@/modules/superadmin/pages/Settings';

const AppRouter = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/employee/login" element={<EmployeeLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/superadmin/login" element={<SuperAdminLogin />} />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout role="admin" />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="employees" element={<EmployeeManagement />} />
                <Route path="tasks" element={<TaskManagement />} />
                <Route path="tasks/:id" element={<TaskCompletion />} />
                <Route path="reports" element={<Reports />} />
                <Route path="calendar" element={<AdminCalendar />} />
                <Route path="subscription" element={<Subscription />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Employee Routes */}
            <Route
                path="/employee"
                element={
                    <ProtectedRoute allowedRoles={['employee']}>
                        <EmployeeLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<EmployeeDashboard />} />
                <Route path="tasks/:id" element={<TaskDetail />} />
                <Route path="tasks/new" element={<AddTask />} />
                <Route path="calendar" element={<EmployeeCalendar />} />
                <Route path="notes" element={<EmployeeNotes />} />
                <Route path="notifications" element={<NotificationsList />} />
                <Route path="profile" element={<EmployeeProfile />} />
                <Route path="profile/account" element={<PersonalAccount />} />
                <Route path="profile/notifications" element={<Notifications />} />
                <Route path="profile/security" element={<Security />} />
                <Route path="profile/preferences" element={<Preferences />} />
                <Route path="profile/help" element={<HelpLegal />} />
            </Route>

            {/* Super Admin Routes */}
            <Route
                path="/superadmin"
                element={
                    <ProtectedRoute allowedRoles={['superadmin']}>
                        <AdminLayout role="superadmin" />
                    </ProtectedRoute>
                }
            >
                <Route index element={<SuperAdminDashboard />} />
                <Route path="admins" element={<AdminAccounts />} />
                <Route path="plans" element={<PlansManagement />} />
                <Route path="settings" element={<SuperAdminSettings />} />
                <Route path="reports" element={<div>System Reports (Coming Soon)</div>} />
                <Route path="calendar" element={<div>System Calendar (Coming Soon)</div>} />
            </Route>

            {/* Default Redirection */}
            <Route path="/" element={<NotFoundRedirect />} />
            <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
    );
};

export default AppRouter;

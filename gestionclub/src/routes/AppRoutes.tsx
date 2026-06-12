import { lazy, Suspense } from "react";
import { Routes, Route } from 'react-router-dom';

// Layouts y Protecciones
import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import { ManagerRoute } from './ManagerRoute';
import AdminRoute from './AdminRoute';

// Carga perezosa (Lazy Loading) para mejorar el performance
const HomePage = lazy(() => import('../pages/public/HomePage'));
const LoginPage = lazy(() => import('../pages/public/LoginPage'));
const RegisterPage = lazy(() => import('../pages/public/RegisterPage'));
const Dashboard = lazy(() => import('../pages/private/Dashboard'));
const ClubCatalogPage = lazy(() => import('../pages/private/ClubCatalogPage'));
const ClubDetailPage = lazy(() => import('../pages/private/ClubDetails'));
const CreateClub = lazy(() => import('../pages/private/CreateClub'));
const ProfilePage = lazy(() => import('../pages/private/ProfilePage'));
const TrainingsPage = lazy(() => import('../pages/private/TrainingsPage'));
const TrainingNew = lazy(() => import('../pages/private/TrainingNew'));
const ResourcesPage = lazy(() => import('../pages/private/ResourcesPage'));
const ResourceNew = lazy(() => import('../pages/private/ResourceNew'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const AdminClubs = lazy(() => import('../pages/admin/AdminClubs'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="state-message"><div className="spinner" /></div>}>
      <Routes>
        {/* Rutas Públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Rutas Privadas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clubs" element={<ClubCatalogPage />} />
            <Route path="/club/:id" element={<ClubDetailPage />} />
            <Route path="/trainings" element={<TrainingsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Gestión (Admin + Fundador) */}
            <Route element={<ManagerRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/clubs" element={<AdminClubs />} />
              <Route path="/clubs/new" element={<CreateClub />} />
              <Route path="/clubs/:id/edit" element={<CreateClub />} />
              <Route path="/trainings/new" element={<TrainingNew />} />
              <Route path="/resources/new" element={<ResourceNew />} />
            </Route>

            {/* Gestión Exclusiva Admin */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
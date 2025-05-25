import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import PersonsPage from './pages/PeoplePage';
import ContractsPage from './pages/ContractsPage';
import CreateContractPage from './pages/CreateContractPage';
import EditContractPage from './pages/EditContractPage';
import SettingsPage from './pages/SettingsPage';
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="persons" element={<PersonsPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="contracts/new" element={<CreateContractPage />} />
          <Route path="contracts/:id/edit" element={<EditContractPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="receipts" element={<div className="p-6">Receipts content coming soon</div>} />
          <Route path="donations" element={<div className="p-6">Donations content coming soon</div>} />
          <Route path="help" element={<div className="p-6">Help content coming soon</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
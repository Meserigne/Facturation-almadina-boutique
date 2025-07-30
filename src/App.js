import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/UI/ToastManager';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import Reports from './pages/Reports';
import FinancialStatement from './pages/FinancialStatement';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
          <Router>
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/invoices/create" element={<CreateInvoice />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/financial-statement" element={<FinancialStatement />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          </Router>
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;

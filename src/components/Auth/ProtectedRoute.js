import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Login from '../../pages/Login';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();

  // Afficher un loader pendant la vérification de session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si non authentifié, afficher la page de connexion
  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  // Si authentifié, afficher le contenu protégé
  return children;
};

export default ProtectedRoute;

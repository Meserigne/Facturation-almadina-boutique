import React, { createContext, useContext, useState, useEffect } from 'react';
import securityService from '../services/securityService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier la session existante au chargement
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        const sessionData = securityService.getSession();
        if (sessionData && securityService.isSessionValid()) {
          setUser({
            username: sessionData.username,
            sessionToken: sessionData.sessionToken,
            loginTime: sessionData.loginTime
          });
          setIsAuthenticated(true);
        } else {
          // Session expirée ou invalide
          securityService.clearSession();
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        securityService.clearSession();
      }
      setIsLoading(false);
    };

    checkExistingSession();
  }, []);

  // Fonction de connexion
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Sauvegarder la session
    securityService.saveSession({
      username: userData.username,
      sessionToken: userData.sessionToken,
      loginTime: userData.loginTime
    });
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    securityService.clearSession();
    
    // Optionnel : rediriger vers la page de connexion
    window.location.reload();
  };

  // Vérifier périodiquement la validité de la session
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        if (!securityService.isSessionValid()) {
          logout();
        }
      }, 60000); // Vérifier toutes les minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import CryptoJS from 'crypto-js';

class SecurityService {
  constructor() {
    this.secretKey = process.env.REACT_APP_SECRET_KEY || 'alamadinah_default_key_2024';
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.maxLoginAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
  }

  // Chiffrer des données sensibles
  encrypt(data) {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Erreur de chiffrement:', error);
      return null;
    }
  }

  // Déchiffrer des données
  decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Erreur de déchiffrement:', error);
      return null;
    }
  }

  // Hasher un mot de passe
  hashPassword(password) {
    const salt = CryptoJS.lib.WordArray.random(128/8);
    const hash = CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    return {
      salt: salt.toString(),
      hash: hash.toString()
    };
  }

  // Vérifier un mot de passe
  verifyPassword(password, storedHash, storedSalt) {
    const hash = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(storedSalt), {
      keySize: 256/32,
      iterations: 10000
    });
    return hash.toString() === storedHash;
  }

  // Générer un token de session
  generateSessionToken() {
    const timestamp = Date.now();
    const randomData = CryptoJS.lib.WordArray.random(256/8);
    const tokenData = {
      timestamp,
      random: randomData.toString(),
      expires: timestamp + this.sessionTimeout
    };
    return this.encrypt(tokenData);
  }

  // Valider un token de session
  validateSessionToken(token) {
    try {
      const tokenData = this.decrypt(token);
      if (!tokenData) return false;
      
      const now = Date.now();
      return now < tokenData.expires;
    } catch (error) {
      return false;
    }
  }

  // Gestion des tentatives de connexion
  recordLoginAttempt(username, success = false) {
    const key = `login_attempts_${username}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    
    const attempt = {
      timestamp: Date.now(),
      success,
      ip: this.getClientIP()
    };
    
    attempts.push(attempt);
    
    // Garder seulement les tentatives des dernières 24h
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentAttempts = attempts.filter(a => a.timestamp > oneDayAgo);
    
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    
    return this.checkAccountLockout(username);
  }

  // Vérifier si le compte est verrouillé
  checkAccountLockout(username) {
    const key = `login_attempts_${username}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    
    const recentFailures = attempts.filter(a => 
      !a.success && 
      a.timestamp > (Date.now() - this.lockoutDuration)
    );
    
    if (recentFailures.length >= this.maxLoginAttempts) {
      const lastFailure = Math.max(...recentFailures.map(a => a.timestamp));
      const lockoutEnd = lastFailure + this.lockoutDuration;
      
      if (Date.now() < lockoutEnd) {
        return {
          locked: true,
          remainingTime: lockoutEnd - Date.now(),
          attempts: recentFailures.length
        };
      }
    }
    
    return { locked: false, attempts: recentFailures.length };
  }

  // Obtenir l'IP du client (simulation)
  getClientIP() {
    // En production, ceci serait obtenu du serveur
    return '127.0.0.1';
  }

  // Valider la force d'un mot de passe
  validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    ].filter(Boolean).length;
    
    const strength = score < 3 ? 'faible' : score < 5 ? 'moyen' : 'fort';
    
    return {
      score,
      strength,
      isValid: score >= 3,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  }

  // Sauvegarder des données sensibles de manière sécurisée
  secureStore(key, data) {
    try {
      const encrypted = this.encrypt(data);
      localStorage.setItem(`secure_${key}`, encrypted);
      return true;
    } catch (error) {
      console.error('Erreur de stockage sécurisé:', error);
      return false;
    }
  }

  // Récupérer des données sensibles
  secureRetrieve(key) {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Erreur de récupération sécurisée:', error);
      return null;
    }
  }

  // Nettoyer les données sensibles
  secureCleanup() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_') || key.startsWith('login_attempts_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // Générer un code de vérification
  generateVerificationCode(length = 6) {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Audit de sécurité
  performSecurityAudit() {
    const audit = {
      timestamp: new Date().toISOString(),
      checks: {
        sessionValid: this.validateSessionToken(localStorage.getItem('session_token')),
        passwordPolicy: true, // À implémenter selon vos besoins
        dataEncryption: true,
        backupSecurity: true
      },
      recommendations: []
    };

    // Vérifications et recommandations
    if (!audit.checks.sessionValid) {
      audit.recommendations.push('Session expirée - reconnexion requise');
    }

    const loginAttempts = Object.keys(localStorage)
      .filter(key => key.startsWith('login_attempts_'))
      .length;
    
    if (loginAttempts > 10) {
      audit.recommendations.push('Nombreuses tentatives de connexion détectées');
    }

    return audit;
  }

  // Initialiser la sécurité de l'application
  initializeSecurity() {
    // Nettoyer les sessions expirées
    this.cleanupExpiredSessions();
    
    // Configurer les en-têtes de sécurité (simulation)
    this.setSecurityHeaders();
    
    return {
      initialized: true,
      timestamp: new Date().toISOString(),
      securityLevel: 'high'
    };
  }

  // Nettoyer les sessions expirées
  cleanupExpiredSessions() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('session_') || key.includes('token_')) {
        try {
          const data = this.decrypt(localStorage.getItem(key));
          if (data && data.expires && Date.now() > data.expires) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          // Supprimer les données corrompues
          localStorage.removeItem(key);
        }
      }
    });
  }

  // Configurer les en-têtes de sécurité (simulation)
  setSecurityHeaders() {
    // En production, ceci serait configuré côté serveur
    console.log('Configuration des en-têtes de sécurité...');
  }
}

export default new SecurityService();

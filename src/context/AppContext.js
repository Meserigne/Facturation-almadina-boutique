import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Initial state
const initialState = {
  products: [
    { 
      id: 1, 
      name: 'Abaya Moderne Noire', 
      category: 'Abayas', 
      price: 25000, 
      stock: 25, 
      description: 'Abaya élégante en tissu fluide, coupe moderne',
      sku: 'ABY-001',
      supplier: 'Fournisseur Dubai',
      minStock: 5,
      image: '/images/abaya-black.jpg',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Voile Soie Premium', 
      category: 'Voiles & Hijabs', 
      price: 8500, 
      stock: 40, 
      description: 'Voile en soie haute qualité, plusieurs coloris',
      sku: 'VIL-001',
      supplier: 'Soie de Lyon',
      minStock: 10,
      image: '/images/hijab-silk.jpg',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    { 
      id: 3, 
      name: 'Robe Longue Chic', 
      category: 'Robes', 
      price: 22000, 
      stock: 20, 
      description: 'Robe longue élégante pour occasions spéciales',
      sku: 'ROB-001',
      supplier: 'Atelier Marrakech',
      minStock: 3,
      image: '/images/dress-elegant.jpg',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12'
    },
    { 
      id: 4, 
      name: 'Ensemble Tunique-Pantalon', 
      category: 'Ensembles', 
      price: 18500, 
      stock: 15, 
      description: 'Ensemble moderne tunique + pantalon assorti',
      sku: 'ENS-001',
      supplier: 'Mode Istanbul',
      minStock: 5,
      image: '/images/ensemble-modern.jpg',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-08'
    },
    { 
      id: 5, 
      name: 'Tenue Enfant Eid', 
      category: 'Vêtements Enfant', 
      price: 12000, 
      stock: 30, 
      description: 'Ensemble festif pour enfant, tailles 2-12 ans',
      sku: 'ENF-001',
      supplier: 'Kids Fashion',
      minStock: 8,
      image: '/images/kids-eid.jpg',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-05'
    },
    { 
      id: 6, 
      name: 'Box Ramadan Famille', 
      category: 'Box Ramadan', 
      price: 35000, 
      stock: 20, 
      description: 'Box complète avec dattes, miel et accessoires religieux',
      sku: 'BOX-001',
      supplier: 'Produits du Maghreb',
      minStock: 5,
      image: '/images/ramadan-box.jpg',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03'
    },
    { 
      id: 7, 
      name: 'Chapelet Tasbih Bois', 
      category: 'Accessoires Religieux', 
      price: 5500, 
      stock: 50, 
      description: 'Chapelet artisanal en bois d\'olivier, 99 perles',
      sku: 'ACC-001',
      supplier: 'Artisanat Palestine',
      minStock: 15,
      image: '/images/tasbih-wood.jpg',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    },
    { 
      id: 8, 
      name: 'Pantalon Large Femme', 
      category: 'Pantalons', 
      price: 15000, 
      stock: 25, 
      description: 'Pantalon large confortable, plusieurs tailles',
      sku: 'PAN-001',
      supplier: 'Textile Casablanca',
      minStock: 8,
      image: '/images/pants-wide.jpg',
      createdAt: '2023-12-28',
      updatedAt: '2023-12-28'
    }
  ],
  clients: [
    { 
      id: 1, 
      name: 'Aminata Traoré', 
      email: 'aminata.traore@gmail.com', 
      phone: '+225 0748526934', 
      address: 'Cocody Riviera, Abidjan',
      clientType: 'Particulier',
      registrationDate: '2023-11-15',
      totalPurchases: 125000,
      lastPurchase: '2024-01-20',
      notes: 'Cliente fidèle, préfère les abayas noires'
    },
    { 
      id: 2, 
      name: 'Fatoumata Koné', 
      email: 'fatoumata.kone@yahoo.fr', 
      phone: '+225 0587462139', 
      address: 'Yopougon Selmer, Abidjan',
      clientType: 'Particulier',
      registrationDate: '2023-12-01',
      totalPurchases: 89000,
      lastPurchase: '2024-01-18',
      notes: 'Commande souvent pour ses filles'
    },
    { 
      id: 3, 
      name: 'Mariam Ouattara', 
      email: 'mariam.ouattara@orange.ci', 
      phone: '+225 0769854213', 
      address: 'Plateau Centre-ville, Abidjan',
      clientType: 'Professionnel',
      registrationDate: '2023-10-20',
      totalPurchases: 245000,
      lastPurchase: '2024-01-22',
      notes: 'Revendeuse, commandes en gros'
    },
    { 
      id: 4, 
      name: 'Khadija Diabaté', 
      email: 'khadija.diabate@gmail.com', 
      phone: '+225 0654789123', 
      address: 'Marcory Zone 4, Abidjan',
      clientType: 'Particulier',
      registrationDate: '2023-09-10',
      totalPurchases: 67000,
      lastPurchase: '2024-01-15',
      notes: 'Préfère les couleurs vives'
    }
  ],
  invoices: [],
  categories: [
    'Abayas',
    'Voiles & Hijabs',
    'Robes',
    'Tuniques',
    'Ensembles',
    'Pantalons',
    'Vêtements Enfant',
    'Box Ramadan',
    'Accessoires Religieux',
    'Livres Islamiques'
  ],
  paymentMethods: [
    { id: 'orange_money', name: 'Orange Money', icon: '📱' },
    { id: 'mtn_money', name: 'MTN Mobile Money', icon: '📱' },
    { id: 'moov_money', name: 'Moov Money', icon: '📱' },
    { id: 'wave', name: 'Wave', icon: '💳' },
    { id: 'especes', name: 'Espèces', icon: '💵' },
    { id: 'virement', name: 'Virement bancaire', icon: '🏦' },
    { id: 'cheque', name: 'Chèque', icon: '📝' }
  ],
  settings: {
    businessInfo: {
      name: 'Al Madinah Boutique',
      address: 'Cocody Riviera, Abidjan, Côte d\'Ivoire',
      phone: '+225 27 22 48 15 63',
      email: 'contact@alamadinah.ci',
      website: 'www.alamadinah.ci',
      logo: '/images/logo.png',
      taxNumber: 'CI-ABJ-2023-001234',
      currency: 'F CFA'
    },
    invoiceSettings: {
      prefix: 'ALM',
      startNumber: 1,
      taxRate: 18,
      showTax: true,
      termsAndConditions: 'Paiement à 30 jours. Retard de paiement entraîne des pénalités.',
      footerNote: 'Merci pour votre confiance - Al Madinah Boutique'
    },
    paymentSettings: {
      enabled: false,
      mode: 'test',
      masterKey: '',
      privateKey: '',
      publicKey: '',
      token: ''
    },
    barcodeSettings: {
      productFormat: 'CODE128',
      invoiceFormat: 'CODE128',
      showOnProducts: true,
      showOnInvoices: true,
      productPrefix: 'ALM',
      invoicePrefix: 'INV'
    },
    notifications: {
      lowStock: true,
      newOrder: true,
      paymentReminder: true,
      stockThreshold: 5
    }
  },
  ui: {
    sidebarCollapsed: false,
    theme: 'light',
    language: 'fr'
  }
};

// Action types
const actionTypes = {
  // Products
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  UPDATE_STOCK: 'UPDATE_STOCK',
  
  // Clients
  ADD_CLIENT: 'ADD_CLIENT',
  UPDATE_CLIENT: 'UPDATE_CLIENT',
  DELETE_CLIENT: 'DELETE_CLIENT',
  
  // Invoices
  ADD_INVOICE: 'ADD_INVOICE',
  UPDATE_INVOICE: 'UPDATE_INVOICE',
  DELETE_INVOICE: 'DELETE_INVOICE',
  
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // UI
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, { ...action.payload, id: Date.now() }]
      };
      
    case actionTypes.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
      
    case actionTypes.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
      
    case actionTypes.UPDATE_STOCK:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id 
            ? { ...product, stock: action.payload.stock }
            : product
        )
      };
      
    case actionTypes.ADD_CLIENT:
      return {
        ...state,
        clients: [...state.clients, { ...action.payload, id: Date.now() }]
      };
      
    case actionTypes.UPDATE_CLIENT:
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        )
      };
      
    case actionTypes.DELETE_CLIENT:
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload)
      };
      
    case actionTypes.ADD_INVOICE:
      return {
        ...state,
        invoices: [...state.invoices, action.payload]
      };
      
    case actionTypes.UPDATE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.map(invoice =>
          invoice.id === action.payload.id ? action.payload : invoice
        )
      };
      
    case actionTypes.DELETE_INVOICE:
      return {
        ...state,
        invoices: state.invoices.filter(invoice => invoice.id !== action.payload)
      };
      
    case actionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
      
    case actionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed }
      };
      
    case actionTypes.SET_THEME:
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload }
      };
      
    case actionTypes.SET_LANGUAGE:
      return {
        ...state,
        ui: { ...state.ui, language: action.payload }
      };
      
    default:
      return state;
  }
}

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('alamadinah-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Merge saved data with initial state
        Object.keys(parsedData).forEach(key => {
          if (key !== 'ui') {
            dispatch({ type: `SET_${key.toUpperCase()}`, payload: parsedData[key] });
          }
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      products: state.products,
      clients: state.clients,
      invoices: state.invoices,
      settings: state.settings
    };
    localStorage.setItem('alamadinah-data', JSON.stringify(dataToSave));
  }, [state.products, state.clients, state.invoices, state.settings]);

  // Action creators
  const actions = {
    // Products
    addProduct: (product) => dispatch({ type: actionTypes.ADD_PRODUCT, payload: product }),
    updateProduct: (product) => dispatch({ type: actionTypes.UPDATE_PRODUCT, payload: product }),
    deleteProduct: (id) => dispatch({ type: actionTypes.DELETE_PRODUCT, payload: id }),
    updateStock: (id, stock) => dispatch({ type: actionTypes.UPDATE_STOCK, payload: { id, stock } }),
    
    // Clients
    addClient: (client) => dispatch({ type: actionTypes.ADD_CLIENT, payload: client }),
    updateClient: (client) => dispatch({ type: actionTypes.UPDATE_CLIENT, payload: client }),
    deleteClient: (id) => dispatch({ type: actionTypes.DELETE_CLIENT, payload: id }),
    
    // Invoices
    addInvoice: (invoice) => dispatch({ type: actionTypes.ADD_INVOICE, payload: invoice }),
    updateInvoice: (invoice) => dispatch({ type: actionTypes.UPDATE_INVOICE, payload: invoice }),
    deleteInvoice: (id) => dispatch({ type: actionTypes.DELETE_INVOICE, payload: id }),
    
    // Settings
    updateSettings: (settings) => dispatch({ type: actionTypes.UPDATE_SETTINGS, payload: settings }),
    
    // UI
    toggleSidebar: () => dispatch({ type: actionTypes.TOGGLE_SIDEBAR }),
    setTheme: (theme) => dispatch({ type: actionTypes.SET_THEME, payload: theme }),
    setLanguage: (language) => dispatch({ type: actionTypes.SET_LANGUAGE, payload: language })
  };

  const value = {
    ...state,
    actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;

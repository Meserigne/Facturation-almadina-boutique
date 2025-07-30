# Al Madinah Boutique - Système de Facturation Professionnel

Une application de facturation moderne et complète pour boutiques de mode islamique, développée avec React et Tailwind CSS.

## 🌟 Fonctionnalités

### ✅ Fonctionnalités Implémentées

- **📊 Tableau de bord interactif** avec métriques en temps réel
- **📦 Gestion complète des produits** (CRUD, catégories, stock, images)
- **👥 Gestion des clients** (particuliers/professionnels, historique)
- **🧾 Création et gestion des factures** avec calcul automatique
- **📈 Rapports et statistiques** détaillés avec graphiques
- **⚙️ Paramètres configurables** (entreprise, facturation, notifications)
- **🎨 Interface moderne et responsive** avec Tailwind CSS
- **💾 Sauvegarde automatique** dans le localStorage
- **🔍 Recherche et filtres** avancés sur tous les modules
- **📱 Design mobile-first** adaptatif

### 🚀 Fonctionnalités Avancées à Venir

- **🔐 Authentification et gestion des utilisateurs**
- **📄 Export PDF des factures** avec génération automatique
- **📧 Envoi automatique de factures par email**
- **💳 Intégration des paiements mobiles** (Orange Money, MTN, Wave)
- **📊 Tableaux de bord avancés** avec KPIs personnalisés
- **🔔 Notifications push** en temps réel
- **☁️ Synchronisation cloud** et sauvegarde automatique
- **📱 Application mobile** (React Native)
- **🌍 Multi-langues** (Français, Anglais, Arabe)
- **🎯 Gestion des promotions** et codes de réduction
- **📋 Gestion des commandes** et suivi des livraisons
- **💼 Gestion multi-boutiques** pour les franchises

## 🛠️ Technologies Utilisées

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS avec thème personnalisé
- **Icons**: Heroicons, Lucide React
- **Charts**: Recharts pour les graphiques
- **State Management**: React Context + useReducer
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## 🚀 Installation

1. **Cloner le projet** (si applicable)
```bash
git clone [url-du-repo]
cd alamadinah-billing-pro
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer l'application en développement**
```bash
npm start
```

4. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Forms/          # Formulaires (Product, Client)
│   ├── Invoice/        # Composants de facturation
│   ├── Layout/         # Layout principal (Header, Sidebar)
│   └── UI/             # Composants UI (ConfirmDialog, etc.)
├── context/            # Context React pour l'état global
├── pages/              # Pages principales de l'application
│   ├── Dashboard.js    # Tableau de bord
│   ├── Products.js     # Gestion des produits
│   ├── Clients.js      # Gestion des clients
│   ├── Invoices.js     # Liste des factures
│   ├── CreateInvoice.js # Création de factures
│   ├── Reports.js      # Rapports et statistiques
│   └── Settings.js     # Paramètres
├── App.js              # Composant principal
└── index.js            # Point d'entrée
```

## 🎨 Design et UX

### Palette de Couleurs
- **Primary**: Bleu (#0ea5e9) - Navigation et actions principales
- **Success**: Vert (#22c55e) - Confirmations et revenus
- **Warning**: Orange (#f59e0b) - Alertes et stock faible
- **Danger**: Rouge (#ef4444) - Erreurs et suppressions

### Typographie
- **Police**: Inter (Google Fonts)
- **Tailles**: Système de tailles cohérent avec Tailwind

### Composants
- **Cards**: Ombres douces avec hover effects
- **Buttons**: États hover et focus bien définis
- **Forms**: Validation en temps réel
- **Tables**: Responsive avec tri et filtres
- **Modals**: Animations fluides

## 📊 Fonctionnalités Détaillées

### Gestion des Produits
- ✅ CRUD complet (Créer, Lire, Modifier, Supprimer)
- ✅ Catégorisation automatique
- ✅ Gestion du stock avec alertes
- ✅ Images de produits
- ✅ SKU et fournisseurs
- ✅ Recherche et filtres avancés

### Gestion des Clients
- ✅ Profils clients détaillés
- ✅ Types de clients (Particulier/Professionnel)
- ✅ Historique des achats
- ✅ Notes personnalisées
- ✅ Statistiques par client

### Facturation
- ✅ Création intuitive de factures
- ✅ Sélection de produits avec stock en temps réel
- ✅ Calculs automatiques (sous-total, TVA, total)
- ✅ Modes de paiement locaux (Mobile Money)
- ✅ Numérotation automatique
- ✅ Aperçu avant impression

### Rapports et Analytics
- ✅ Métriques de performance
- ✅ Graphiques interactifs
- ✅ Top produits et clients
- ✅ Évolution du chiffre d'affaires
- ✅ Export des données

## 🔧 Configuration

### Paramètres d'Entreprise
- Informations de la boutique
- Coordonnées et logo
- Numéro de TVA

### Paramètres de Facturation
- Préfixe et numérotation
- Taux de TVA
- Conditions générales
- Notes de pied de page

### Notifications
- Alertes de stock faible
- Nouvelles commandes
- Rappels de paiement

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à tous les écrans :
- **Desktop**: Interface complète avec sidebar
- **Tablet**: Navigation adaptée
- **Mobile**: Interface optimisée tactile

## 🔒 Sécurité et Données

- **Stockage local**: Données sauvegardées dans le navigateur
- **Validation**: Formulaires avec validation côté client
- **Backup**: Export/import des données

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Déploiement
L'application peut être déployée sur :
- Netlify
- Vercel
- GitHub Pages
- Serveur web classique

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou support :
- Email: support@alamadinah.ci
- Téléphone: +225 27 22 48 15 63

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Al Madinah Boutique** - *Votre partenaire pour une gestion moderne et efficace*

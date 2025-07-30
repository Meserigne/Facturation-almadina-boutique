# Guide de Déploiement - Al Madinah Boutique

## 🚀 Déploiement sur GitHub

### Étape 1: Créer un dépôt GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur "New repository" (Nouveau dépôt)
3. Nommez votre dépôt : `alamadinah-boutique`
4. Description : "Application de facturation professionnelle pour Al Madinah Boutique - Gestion produits, clients, factures avec upload d'images local"
5. Choisissez **Public** ou **Private** selon vos préférences
6. **NE PAS** cocher "Initialize with README" (nous avons déjà un README)
7. Cliquez sur "Create repository"

### Étape 2: Connecter votre projet local au dépôt GitHub

Après avoir créé le dépôt, GitHub vous donnera des commandes. Utilisez celles-ci :

```bash
# Ajouter l'origine distante (remplacez USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/alamadinah-boutique.git

# Pousser le code vers GitHub
git branch -M main
git push -u origin main
```

### Étape 3: Déploiement automatique avec GitHub Pages

1. Dans votre dépôt GitHub, allez dans **Settings** > **Pages**
2. Source : **Deploy from a branch**
3. Branch : **main** / **root**
4. Cliquez sur **Save**

Votre application sera disponible à : `https://USERNAME.github.io/alamadinah-boutique`

### Étape 4: Déploiement avec Netlify (Recommandé)

1. Allez sur [Netlify.com](https://netlify.com)
2. Cliquez sur "New site from Git"
3. Connectez votre compte GitHub
4. Sélectionnez le dépôt `alamadinah-boutique`
5. Build command : `npm run build`
6. Publish directory : `build`
7. Cliquez sur "Deploy site"

Netlify vous donnera une URL personnalisée que vous pourrez changer.

### Étape 5: Déploiement avec Vercel (Alternative)

1. Allez sur [Vercel.com](https://vercel.com)
2. Importez votre projet GitHub
3. Vercel détectera automatiquement que c'est une app React
4. Cliquez sur "Deploy"

## 🔧 Configuration pour la Production

### Variables d'Environnement

Si vous utilisez des services externes, ajoutez ces variables :

```env
REACT_APP_PAYDUNYA_MASTER_KEY=your_master_key
REACT_APP_PAYDUNYA_PRIVATE_KEY=your_private_key
REACT_APP_PAYDUNYA_PUBLIC_KEY=your_public_key
REACT_APP_SECRET_KEY=your_encryption_key
```

### Build de Production

```bash
npm run build
```

## 📱 Fonctionnalités Déployées

✅ **Gestion Complète**
- Produits avec upload d'images local
- Clients et facturation
- Bilan comptable automatique

✅ **Sécurité & Sauvegarde**
- Chiffrement des données sensibles
- Système de sauvegarde automatique
- Gestion des sessions

✅ **Communication**
- Newsletter intégrée
- SMS et WhatsApp (simulation)
- Templates personnalisables

✅ **Paiements**
- Intégration PayDunya
- Support Mobile Money
- Modes test et production

✅ **Code-barres**
- Génération automatique
- Formats multiples (CODE128, EAN13, etc.)
- Configuration personnalisable

## 🌐 Domaine Personnalisé

### Avec Netlify
1. Dans Netlify Dashboard > Domain settings
2. Add custom domain : `facturation.almadinahboutique.com`
3. Suivez les instructions DNS

### Avec GitHub Pages
1. Settings > Pages > Custom domain
2. Entrez : `facturation.almadinahboutique.com`
3. Configurez les DNS chez votre hébergeur

## 📞 Support

Pour toute question sur le déploiement :
- Vérifiez que toutes les dépendances sont installées
- Consultez les logs de build en cas d'erreur
- Testez localement avec `npm start` avant de déployer

---

**Al Madinah Boutique** - Application de facturation professionnelle
Spécialisée dans la mode islamique et les accessoires religieux

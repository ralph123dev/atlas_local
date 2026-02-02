# Documentation du Projet : Nexora (Atlas Local)


## Technologies Utilisées
- **Framework** : React Native avec Expo (Managed Workflow).
- **Langage** : TypeScript pour un typage statique fort.
- **Navigation** : Système de navigation personnalisé basé sur un `NavigationContext` et une gestion d'état centralisée dans `App.tsx`.
- **Cartographie** : `react-native-maps` avec intégration de l'API Google Maps.
- **Animations** : `react-native-reanimated` pour des transitions fluides et des effets visuels modernes (ex: effet de transition de thème).
- **Icônes** : `lucide-react-native`.
- **Styles** : StyleSheet standard de React Native.

## Structure du Projet
- `/app` : Contient les différents écrans de l'application (`home.tsx`, `ask.tsx`, `weather.tsx`, etc.) ainsi que les Contextes React.
- `/components` : Composants réutilisables (Navigation, Menus, Écrans de contribution).
- `/assets` : Images, logos et ressources statiques.

## Fonctionnalités Principales

### 1. Exploration (Explorer)
Située dans `app/home.tsx`, cette fonctionnalité utilise Google Maps pour afficher la position de l'utilisateur et les points d'intérêt aux alentours (restaurants, cafés, etc.).
- **Recherche** : Recherche de lieux via géocodage.
- **Street View** : Intégration d'une vue à 360° via une WebView.
- **Mode 3D** : Bascule de l'inclinaison de la carte pour une vue en relief.

### 2. Interface de Chat (Ask)
Située dans `app/ask.tsx`, c'est une interface de messagerie complète.
- **Envoi/Réception** : Simulation de réponses d'une IA.
- **Édition/Suppression** : Possibilité de modifier ou supprimer ses propres messages.
- **Pièces Jointes** : Menu pour simuler l'envoi d'images, vidéos et documents.
- **Enregistrement Vocal** : Interface pour l'enregistrement de messages audio.

### 3. Système de Thèmes
Géré par `app/ThemeContext.tsx`, l'application supporte plusieurs modes :
- **Clair (Light)**
- **Sombre (Dark)**
- **Bleu (Blue)**
L'application utilise une animation de type "Ripple" (onde) lors du changement de thème pour une transition visuelle premium.

### 4. Météo et Événements
- **Météo** : Affiche les informations météorologiques locales (implémentation dans `app/weather.tsx`).
- **Événements** : Liste des événements à venir (implémentation dans `app/events.tsx`).

## Flux de Travail et Navigation
La navigation ne repose pas sur `react-navigation` mais sur un état simple `currentPath` dans `App.tsx`. Cela permet un contrôle total sur les animations de transition entre les écrans.

Chaque écran utilise le `NavigationContext` pour naviguer vers d'autres routes via les fonctions `push` ou `replace`.

## Instructions pour les Développeurs
- **Clé API** : La clé API Google Maps est actuellement codée en dur dans `app/home.tsx`. Pour la production, elle devrait être déplacée dans un fichier de variables d'environnement (`.env`).
- **Styles** : Les styles sont dynamiques et dépendent souvent de l'état `theme`. Utilisez toujours le `ThemeContext` pour adapter les couleurs des composants.
- **Nettoyage** : Les en-têtes de fichiers redondants ont été supprimés et les commentaires traduits en français pour une meilleure lisibilité par l'équipe actuelle.

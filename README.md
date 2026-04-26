# 🎋 BambooFlow — Frontend

> Cultivez votre focus. Une application de gestion de tâches et de productivité avec timer Pomodoro intégré.

[![Demo Live](https://img.shields.io/badge/-Demo%20Live-000000?style=for-the-badge)](https://bambooflow-app.vercel.app/)
[![Backend Repo](https://img.shields.io/badge/-Backend%20Repo-3E3742?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nabila-tamajnit/BambooFlow_backend)

<br>

![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Jotai](https://img.shields.io/badge/-Jotai-000000?style=for-the-badge)
![React Router](https://img.shields.io/badge/-React%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/-Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

---

### 🎥 Démonstration

<video src="https://github.com/user-attachments/assets/4fbaec86-45bd-4134-b3d3-5783d765ffcf" width="800" controls></video>

---

## ✨ Fonctionnalités

- **Gestion de tâches** : Création, édition, suppression et complétion de tâches avec priorités (urgent, moyen, faible) et catégories personnalisées.
- **Timer Pomodoro** : Sessions focus 25 min, pauses courtes et longues, compteur de sessions avec suggestions automatiques de mode.
- **Authentification JWT** : Connexion sécurisée, routes protégées, persistance de session via token avec vérification d'expiration.
- **Interface responsive** : Design pensé mobile-first avec sidebar, modales et formulaires adaptatifs.
- **Panda companion** : Mascotte animée qui réagit à l'état du timer pour rendre l'expérience productive et engageante.

---

## 💡 Compétences clés

- **Gestion d'état globale** : Architecture Jotai avec `atomWithStorage` pour la persistance du token et du profil utilisateur.
- **Routing protégé** : Composant `ProtectedPage` avec double vérification Jotai + localStorage pour éviter les flash au refresh.
- **Communication API** : Centralisation des appels HTTP via des services dédiés (authService, taskService, categoryService).
- **UX robuste** : Gestion des cold starts serveur avec détection de requêtes lentes et banner informatif non-intrusif.

---

## 🛠️ Installation

```bash
# Cloner le projet
git clone https://github.com/nabila-tamajnit/bambooflow-frontend

# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env
# → renseigner VITE_API_URL=http://localhost:3000/api

# Lancer le serveur local
npm run dev
```

---

## 🔗 Repo lié

Le backend (API REST Express/MongoDB) est disponible ici :
**[bambooflow-backend →](https://github.com/nabila-tamajnit/bambooflow-backend)**

---

## 👤 Auteur

**Nabila Tamajnit** - Étudiante Full Stack @ Interface3

# API Vitrine — Offres d'Emploi et Candidatures

Ce document répertorie toutes les API développées dans l'ERP destinées à être consommées par le site vitrine (`https://super-market.pro`). 

> [!NOTE]
> Le site vitrine doit être configuré pour envoyer et recevoir les cookies (`credentials: 'include'` avec fetch ou axios) car l'authentification se fait via des sessions sécurisées avec protection CSRF.

L'URL de base pour l'API est : **`https://erp.super-market.pro`** (ou `http://127.0.0.1:8000` en développement).

---

## 0. Catalogue Produits et Stock en Temps Réel

Ce point de terminaison ne nécessite aucune authentification. Il alimente la page Catalogue et l'aperçu produits du site vitrine.

### 0.1 Liste des produits et stocks
* **Endpoint** : `GET /api/public/products/`
* **Description** : Renvoie la liste des articles actifs avec leur prix de vente, catégorie et stock actuel disponible.
* **Format de réponse (200 OK)** :
```json
[
  {
    "id": 14,
    "reference": "ART014",
    "nom": "Riz Ngonda 25% 50KG",
    "categorie": "Riz & Céréales",
    "conditionnement": "Unité",
    "prix": 19700,
    "quantite_en_stock": 25,
    "en_stock": true,
    "image": "https://erp.super-market.pro/media/products/riz_ngonda.webp"
  }
]
```

---

## 1. Offres d'Emploi Publiques

Ces points de terminaison ne nécessitent aucune authentification.

### 1.1 Liste des offres
* **Endpoint** : `GET /api/public/jobs/`
* **Description** : Récupère la liste de toutes les offres d'emploi actuellement publiées et actives (triées de la plus récente à la plus ancienne).
* **Réponse (200 OK)** :
```json
[
  {
    "id": 1,
    "titre": "Chef de Rayon",
    "description": "Description détaillée...",
    "departement": "Ventes",
    "date_debut": "2026-09-01",
    "date_fin": "2026-12-31",
    "profil_recherche": "Bac+2 en gestion...",
    "competences": "Management, Organisation",
    "type_contrat": "CDI",
    "lieu": "Douala",
    "salaire_de_base": "250000.00",
    "etat": "publiee"
  }
]
```

### 1.2 Détail d'une offre
* **Endpoint** : `GET /api/public/jobs/<id>/`
* **Description** : Récupère les informations détaillées d'une offre spécifique.
* **Erreurs** : `404 Not Found` si l'offre n'existe pas ou n'est plus publiée.

---

## 2. Candidatures

L'envoi de candidature peut se faire de manière anonyme (candidat externe) ou en étant connecté (les données du profil seront automatiquement associées).

### 2.1 Postuler à une offre
* **Endpoint** : `POST /api/public/jobs/<id>/apply/`
* **Description** : Permet de soumettre une candidature avec des fichiers joints (multipart/form-data).
* **Format requis** : `multipart/form-data`
* **Paramètres (Body)** :
  * `nom` (texte, requis)
  * `prenom` (texte, requis)
  * `email` (texte, requis)
  * `telephone` (texte, optionnel)
  * `cv` (fichier PDF/Word, requis, max 5 Mo)
  * `lettre_motivation` (fichier PDF/Word, optionnel, max 5 Mo)
  * `diplome` (fichier, optionnel, max 5 Mo)
* **Réponse (201 Created)** : `{"message": "Candidature envoyée avec succès."}`
* **Erreurs** : `400 Bad Request` (fichier trop grand, format invalide) ou `404 Not Found` (offre invalide).

---

## 3. Authentification Candidat (Espace Personnel)

Ces endpoints permettent à un candidat d'avoir un compte sur le site vitrine pour suivre ses candidatures. L'authentification utilise les cookies de session.

### 3.1 Inscription
* **Endpoint** : `POST /api/public/candidates/register/`
* **Description** : Crée un compte candidat exclusif au site vitrine.
* **Body (JSON)** :
```json
{
  "email": "candidat@email.com",
  "password": "motdepasse123",
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+237600000000"
}
```
* **Réponse (201 Created)** : `{"message": "Compte candidat créé avec succès."}`
* **Erreurs** : `409 Conflict` (email déjà utilisé).

### 3.2 Connexion (Login)
* **Endpoint** : `POST /api/public/candidates/login/`
* **Description** : Connecte le candidat et génère un cookie de session ainsi qu'un token CSRF.
* **Body (JSON)** :
```json
{
  "email": "candidat@email.com",
  "password": "motdepasse123"
}
```
* **Réponse (200 OK)** : `{"message": "Connecté avec succès."}` (Renvoie également un header `X-CSRFToken`).
* **Erreurs** : `403 Forbidden` (bloqué si l'utilisateur essaie de se connecter avec un compte administrateur/RH interne de l'ERP).

> [!IMPORTANT]
> Après un login réussi, le serveur définit un cookie de session HTTPOnly. Pour les requêtes POST/PUT/DELETE ultérieures (ex: Logout), le frontend doit extraire le token CSRF du header ou du cookie et l'envoyer dans le header `X-CSRFToken`.

### 3.3 Informations du profil (Me)
* **Endpoint** : `GET /api/public/candidates/me/`
* **Description** : Récupère les infos du candidat actuellement connecté.
* **Headers** : Doit inclure le cookie de session.
* **Réponse (200 OK)** :
```json
{
  "id": 15,
  "nom": "Doe",
  "prenom": "John",
  "email": "candidat@email.com",
  "telephone": "+237600000000"
}
```
* **Erreurs** : `401 Unauthorized` (non connecté).

### 3.4 Historique des candidatures
* **Endpoint** : `GET /api/public/candidates/applications/`
* **Description** : Liste les candidatures soumises par le candidat connecté, triées de la plus récente à la plus ancienne.
* **Headers** : Doit inclure le cookie de session.
* **Réponse (200 OK)** :
```json
[
  {
    "id": 42,
    "nom": "Doe",
    "prenom": "John",
    "email": "candidat@email.com",
    "telephone": "+237600000000",
    "offre": 1,
    "offre_titre": "Chef de Rayon",
    "date_candidature": "2026-09-10T14:30:00Z",
    "statut": "en_attente",
    "cv": "/media/cvs/mon_cv.pdf",
    "lettre_motivation": null,
    "diplome": null
  }
]
```

### 3.5 Déconnexion (Logout)
* **Endpoint** : `POST /api/public/candidates/logout/`
* **Description** : Détruit la session du candidat.
* **Headers** : Nécessite le cookie de session ET le `X-CSRFToken`.
* **Réponse (200 OK)** : `{"message": "Déconnecté avec succès."}`

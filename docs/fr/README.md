# Foma Render Engine

**Foma Render Engine** est un micro-service de rendu d'emails haute performance, conçu pour l'écosystème **Fordima Inc**. Il transforme des templates simplifiés au format `.fre` (HTML/CSS standard) en emails robustes, compatibles avec tous les clients messagerie (Gmail, Outlook, Apple Mail, etc.).

## Points Forts

* **Système Layout/View** : Séparez la structure globale (header/footer) du contenu spécifique.

* **Format .fre** : Utilisez du HTML et CSS standard sans vous soucier de la complexité des emails.

* **Auto-Inlining**: Intègre automatiquement le CSS dans le HTML via **Juice**.

* **Moteur Handlebars** : Injection de données dynamique et logique de template simple.

* **Docker Ready** : Déploiement instantané et isolation complète.

## Structure du Projet

Le moteur s'attend à trouver un dossier `templates/` à la racine :

```Plaintext
/templates
├── layout.fre      # La structure globale (doit contenir {{{body}}})
├── otp.fre         # Exemple : Template pour les codes de vérification
└── welcome.fre     # Exemple : Template de bienvenue
```

## Installation & Démarrage

Avec Docker (Recommandé)

1. Construire l'image :
    ```bash
    docker compose build
    ```

2. Lancer le service :
    ```bash
    docker compose up
    ```

Le serveur sera disponible sur `http://localhost:3000`.

## Utilisation de l'API

### Rendre un Template

**Endpoint** :` POST /render`

**Corps de la requête (JSON)** :

```json
{
  "template": "otp",
  "data": {
    "userName": "Fordi Malanda",
    "code": "882941",
    "companyName": "FomaBank",
    "logoUrl": "https://cdn.foma.dev/logo.png"
  }
}
```

**Exemple de réponse** :

```json
{
  "success": true,
  "html": "<!DOCTYPE html><html>...</html>"
}
```

## Créer un fichier .fre

1. **Le Layout** (`layout.fre`)

Il définit la charte graphique. **Important** : Vous devez inclure `{{{body}}}` là où le contenu spécifique doit être injecté.

```html
<html>
  <style> .main { color: #333; } </style>
  <body>
    <div class="main">
      {{{body}}}
    </div>
  </body>
</html>
```

2. **La Vue** (`otp.fre`)

Pas besoin de balises <html> ou <body>, concentrez-vous sur le message.

```html
<h1>Code : {{code}}</h1>
<p>Bonjour {{userName}}, voici votre code Foma.</p>
```

## Configuration Technique

**Runtime** : Node.js 22 (Alpine)

**Framework** : Fastify

**Moteurs** : Handlebars (Logic), Juice (CSS Inlining)

**Port** : 3000
# DENTALCARE

DENTALCARE est une démonstration commerciale de site dentaire premium construite avec React, TypeScript, Vite, Tailwind CSS, Framer Motion et React Three Fiber. Le site est une landing page statique, responsive et multilingue (français par défaut, anglais, arabe avec RTL), avec scène dentaire 3D procédurale, contenus de démonstration, formulaire de contact local et assistant conversationnel prêt à être relié à un workflow n8n existant.

## Démarrage local

```bash
pnpm install
pnpm dev
```

Le serveur écoute sur `0.0.0.0:3000`. Le build de production est généré dans `dist` avec :

```bash
pnpm build
```

Le manifeste de route est servi sur `/manus-routes.json` et la page publique est `/`.

## Configuration du chatbot

Le navigateur ne reçoit aucune clé privée. Le site accepte uniquement un webhook public n8n, configuré par variable d’environnement :

```bash
VITE_N8N_WEBHOOK_URL=https://votre-instance.example/webhook/dentalcare
VITE_N8N_DEMO_MODE=false
VITE_N8N_TIMEOUT_MS=9000
```

Sans `VITE_N8N_WEBHOOK_URL`, le chatbot reste en **mode démonstration**. Il produit des réponses locales déterministes, n’effectue aucune réservation, modification ou annulation et affiche explicitement ce statut. Avec un webhook configuré, l’interface affiche « connexion non testée » jusqu’à ce qu’un test réel confirme le payload et la réponse.

Le mapping public envoyé par défaut est :

```json
{
  "message": "Bonjour",
  "sessionId": "dc-session-id",
  "language": "fr",
  "intent": "question"
}
```

Le mapping est centralisé dans `src/config/chatbot.ts`. Le service `src/services/chatbotService.ts` valide plusieurs formes de réponse n8n (`message`, `text`, `output`, `response`, `answer`, ou des enveloppes `data`/`result`/`body`) et rejette les réponses vides ou malformées. Une confirmation de réservation, modification ou annulation n’est jamais présentée comme réelle sans un indicateur explicite de succès dans la réponse n8n (`confirmed: true` ou `success: true`).

Le workflow n8n existant reste la seule couche autorisée à appeler Google Calendar et Airtable. Le frontend ne contacte directement ni Google Calendar ni Airtable et ne reconstruit pas le workflow.

## Production et CORS

1. Définir `VITE_N8N_WEBHOOK_URL` dans l’environnement de build du frontend.
2. Garder les secrets et credentials dans n8n, jamais dans `VITE_`.
3. Autoriser l’origine HTTPS du site sur le webhook n8n et accepter `Content-Type: application/json`.
4. Vérifier une réponse JSON non vide contenant un champ texte supporté par l’adapter.
5. Tester séparément une question, une demande de rendez-vous, une modification et une annulation ; ne considérer l’action réussie qu’après confirmation retournée par le workflow.

En cas d’erreur CORS, vérifier l’en-tête `Access-Control-Allow-Origin`, la réponse au préflight `OPTIONS` et l’URL publique HTTPS. En cas d’erreur HTTP, consulter le statut du webhook et garder le message utilisateur affiché pour permettre une nouvelle tentative. En cas de timeout, vérifier la durée du workflow n8n, puis ajuster `VITE_N8N_TIMEOUT_MS` sans exposer de credential.

## Transparence produit

Les profils d’équipe, témoignages, visuels de clinique, coordonnées et textes de contact sont explicitement illustratifs. Le site ne publie pas de chiffres, certifications, adresse réelle, téléphone réel, note vérifiée ou affirmation médicale non fournie. Le formulaire de contact simule uniquement les états de validation et de préparation d’envoi tant qu’aucun backend n’est connecté.

## Structure utile

- `src/App.tsx` orchestre les sections et les interactions de la landing page.
- `src/components/ToothScene.tsx` contient la scène Three.js procédurale et son fallback.
- `src/components/Chatbot.tsx` contient l’UI, les quick actions, les états de saisie et le retry.
- `src/services/chatbotService.ts` contient le transport, le timeout, l’adapter et la validation de réponse.
- `src/i18n/translations.ts` centralise les copies français, anglais et arabe.
- `public/manus-routes.json` décrit la route page servie par Webdev.

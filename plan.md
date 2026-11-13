# Plan d’implémentation — DENTALCARE

## Périmètre et approche

DENTALCARE sera une landing page monopage React/TypeScript/Vite, servie comme frontend statique sur le port 3000. Le site privilégie une première impression premium, claire et rassurante, sans compromettre l’accessibilité, la vitesse ou la lisibilité. Le chatbot restera fonctionnel en mode démonstration sans backend et passera par un webhook n8n public configurable lorsqu’il est fourni par l’environnement ; aucune clé privée, connexion directe à Google Calendar ou Airtable, ni confirmation artificielle de réservation ne sera introduite.

Le projet est volontairement initialisé sans serveur ni base de données : les données de démonstration sont statiques et les opérations réelles sont déléguées au workflow n8n existant. La publication sera déclarée comme un build statique Vite (`dist`) avec une commande d’installation/build autonome et un manifeste `/manus-routes.json` contenant uniquement la route `/`.

## Exploration stylistique

- **Clinique éditoriale silencieuse** — blanc minéral, typographie magazine et photographie lumineuse, avec une présence digitale discrète. Probabilité : 0,06.
- **Néon biomédical futuriste** — surfaces très sombres, cyan lumineux et interface plus spectaculaire, au risque de réduire la chaleur humaine. Probabilité : 0,04.
- **Precision Calm / chosen** — luxe médical contemporain, bleu nuit, surfaces nacrées, 3D contrôlée et micro-interactions précises. Probabilité : 0,08.

### Direction retenue : Precision Calm

- **Design movement** : premium healthcare editorial, à mi-chemin entre une clinique privée internationale et un objet de technologie bien conçu.
- **Core principles** : confiance visible, précision sans froideur, profondeur contrôlée, contenu toujours prioritaire sur l’effet.
- **Color philosophy** : le navy profond ancre la crédibilité médicale ; le bleu médical crée la confiance ; le cyan devient une signature rare pour les accents, les états actifs et les reflets de la scène 3D ; les fonds pâles maintiennent calme et confort.
- **Layout paradigm** : composition éditoriale asymétrique avec un axe de lecture vertical et des bandes de contenu qui alternent pleine largeur, split layouts et cartes compactes ; éviter la succession uniforme de grilles centrées.
- **Signature elements** : logo monogramme « D » en ruban dentaire SVG ; filet cyan lumineux comme repère de section ; objets circulaires translucides et anneaux orbitaux autour de la dent procédurale.
- **Interaction philosophy** : chaque interaction confirme une action, révèle une information ou guide le prochain pas ; les hover states restent courts, doux et non essentiels à la compréhension.
- **Animation** : entrées par fondu et translation courte, stagger des groupes, flottement très lent de la 3D, easing cubic-bezier doux ; `prefers-reduced-motion` supprime les transformations non essentielles.
- **Typography system** : Manrope pour titres et navigation, Inter pour le corps ; titres fluides avec `clamp()`, largeur de texte limitée à environ 58–66 caractères ; Cairo/IBM Plex Sans Arabic activé en RTL.
- **Brand essence** : l’expérience digitale premium qui rend les soins dentaires plus confortables, intelligents et humains ; personnalité : précise, apaisante, attentive.
- **Brand voice** : directe, chaleureuse et sûre, sans promesses médicales excessives. Exemples : « Votre sourire, notre priorité. » et « Une technologie discrète, une attention qui se ressent. »
- **Wordmark & logo** : wordmark DENTALCARE en capitales espacées accompagné d’un monogramme SVG composé de deux arcs évoquant une dent et un sourire, sans emoji ni symbole hospitalier.
- **Signature brand color** : `#57C7E8`, utilisé parcimonieusement comme cyan clinique reconnaissable.

## Architecture proposée

```text
/
├── index.html                         # SEO, OG, fonts, root markup
├── package.json                       # Vite/React/TypeScript + scripts
├── pnpm-workspace.yaml                # politique de scripts pnpm
├── tsconfig.json / vite.config.ts
├── tailwind.config.ts / postcss.config.js
├── app.config.ts                      # logoUrl littéral avant checkpoint
├── public/
│   ├── manus-routes.json
│   ├── favicon.svg
│   └── og-cover.svg
├── src/
│   ├── main.tsx                       # montage, ErrorBoundary, langue
│   ├── App.tsx                        # orchestration de la page
│   ├── index.css                       # tokens CSS, typographie, a11y, RTL
│   ├── types/index.ts
│   ├── config/chatbot.ts               # configuration publique du webhook
│   ├── services/chatbotService.ts      # adapter n8n, timeout, validation
│   ├── i18n/translations.ts            # fr/en/ar complet
│   ├── hooks/                          # langue, reduced motion, active section
│   ├── components/
│   │   ├── layout/                     # Header, Footer, SectionHeading
│   │   ├── hero/                       # Hero, ToothScene, fallback
│   │   ├── services/                   # ServicesSection, ServiceCard
│   │   ├── about/                      # AboutSection
│   │   ├── technology/                # TechnologySection
│   │   ├── team/                       # TeamSection
│   │   ├── testimonials/              # carousel accessible
│   │   ├── faq/                        # accordion
│   │   ├── contact/                    # validation + états
│   │   ├── chatbot/                    # launcher, window, messages
│   │   └── ui/                         # Button, Badge, Logo, icons
│   └── utils/                          # storage langue, ids, validation
└── README.md                           # setup, n8n, CORS, production
```

## Choix d’implémentation

1. **Fondations** : installer React, React DOM, TypeScript, Vite, Tailwind, lucide-react, framer-motion, three, `@react-three/fiber`, `@react-three/drei` et les types associés. Les dépendances seront verrouillées avec pnpm et la politique de scripts sera déclarée avant installation.
2. **Système visuel** : centraliser les couleurs, rayons, ombres, espacements, focus rings et transitions dans `index.css` et Tailwind ; utiliser des classes utilitaires seulement pour composer des composants cohérents.
3. **Hero 3D** : construire une molaire procédurale composée de volumes d’émail et de sillons simples, avec éclairage studio, anneaux fins et particules limitées. Détecter WebGL et la largeur d’écran ; proposer une carte de fallback CSS lisible sur mobile/absence WebGL. Ne charger le canvas qu’au niveau du hero et disposer les ressources au démontage.
4. **Visuels** : utiliser quelques visuels éditoriaux cohérents pour l’intérieur de clinique, les services et les portraits illustratifs, avec des alt texts explicites et sans identité réelle. Les visuels seront générés ou intégrés avant le code des sections qui les consomment ; aucun placeholder générique ne restera dans le rendu final.
5. **Internationalisation** : dictionnaires complets `fr`, `en`, `ar`, avec un hook `useLanguage`, persistance de la préférence, `lang` et `dir` mis à jour sur `document.documentElement`, et miroir des icônes directionnelles en arabe.
6. **Interactions** : navigation par ancres avec fermeture du menu mobile, indicateur de section active, accordéon FAQ, carrousel témoignages clavier/tactile, formulaire contact avec validation, et CTA rendez-vous qui ouvre le chatbot avec intent `booking`.
7. **Chatbot** : état local typé pour les messages, intents et états d’envoi ; mode démo déterministe lorsque le webhook est absent ; service séparé avec `AbortController`, timeout, erreurs HTTP/réseau, adaptateur pour réponses `message`, `output`, `text` ou structures n8n communes, rejet des réponses vides/malformées et conservation du texte en échec. Le mode connecté sera explicitement marqué « webhook configuré — connexion non testée » tant qu’aucun succès n’a été vérifié.
8. **SEO/accessibilité** : HTML sémantique, un seul H1, H2 de sections, labels visibles, `aria-live` pour le chatbot et les états de formulaire, navigation clavier, focus visible, contrastes suffisants, métadonnées title/description/OG/Twitter, favicon SVG et contenu public présent dans `index.html` autour du root.
9. **Validation** : enregistrer les diagnostics TypeScript gérés par l’hôte avant le premier code, lancer le serveur Vite sur `0.0.0.0:3000`, vérifier `/manus-routes.json`, lancer `pnpm build`, vérifier le HTML de sortie et corriger les diagnostics/imports. Une passe read-only finale contrôlera les exigences du brief et les connexions entre composants.
10. **Livraison** : configurer `build.command` avec installation/build et `outputDirectory: dist`, garder `auto_publish` inchangé, pousser un checkpoint sur `main` une fois le build propre. La publication publique ne sera pas déclenchée automatiquement.

## Limites assumées et transparence

- Le site est un produit de démonstration : profils, témoignages, visuels, coordonnées et contenus sont explicitement illustratifs.
- Sans `VITE_N8N_WEBHOOK_URL`, le chatbot répond uniquement en mode démo et n’effectue aucune opération réelle.
- La connexion n8n n’est pas déclarée active sans test effectif du webhook et confirmation de payload.
- Aucun serveur Manus, aucune base de données et aucun stockage de données patients ne sont nécessaires pour cette version frontend.

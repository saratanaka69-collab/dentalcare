# TODO — DENTALCARE

## Fondations, identité et navigation

- [x] Le projet est une application React/TypeScript/Vite maintenable, avec les dépendances prévues (Tailwind CSS, Three.js, React Three Fiber, Drei, Framer Motion, Lucide React), des design tokens centralisés et une structure de composants réutilisables.
- [x] Le header est sticky, transparent au sommet puis devient une surface glass blanche au scroll, avec logo SVG custom, navigation vers Accueil, Services, La clinique, Notre équipe, FAQ et Contact, sélecteur de langue, CTA rendez-vous, état actif, fermeture mobile après navigation et focus accessible.
- [x] La page contient un `public/manus-routes.json` valide déclarant la route `/` et ce manifeste reste synchronisé avec les routes réelles.

## Hero et expérience visuelle

- [x] Le hero affiche exactement « Votre sourire, notre priorité. », le paragraphe fourni, « Prendre rendez-vous », « Découvrir nos soins », le statement de confiance et un indicateur de scroll.
- [x] Le hero présente une dent 3D procédurale anatomiquement reconnaissable avec matériau émail/céramique, éclairage studio, flottement doux, rotation lente, parallax subtil, anneaux orbitaux et particules limitées ; il prévoit lazy loading, fallback WebGL, qualité mobile réduite, reduced-motion et nettoyage des ressources.
- [x] Les sections utilisent la palette DENTALCARE, une hiérarchie Manrope/Inter, des surfaces premium, des bordures fines, des focus states, des états hover/loading/error/success et aucun effet visuel ne bloque l’accès au contenu.

## Contenus cliniques démonstration

- [x] La bande de confiance contient Soins personnalisés, Technologies modernes, Accompagnement humain et Confort du patient sans chiffres, certifications, récompenses ou autres affirmations inventées.
- [x] La section services contient six cartes : Soins préventifs, Esthétique dentaire, Orthodontie, Implantologie, Blanchiment dentaire et Soins dentaires généraux ; chaque carte contient titre, description, visuel pertinent, lien fonctionnel et interaction hover sobre.
- [x] La section about affiche « Une nouvelle vision des soins dentaires. », le texte fourni, un visuel de clinique et les valeurs Expertise et précision, Écoute et accompagnement, Innovation et confort, sans inventer d’histoire réelle.
- [x] La section technologie explique Technologie moderne, Parcours patient simplifié et Accompagnement personnalisé sans prétendre que la clinique possède un équipement précis.
- [x] L’équipe présente trois identités fictives explicitement illustratives, avec portraits placeholder/illustratifs, rôle et introduction, sans les présenter comme de vrais praticiens diplômés.
- [x] Le carrousel présente des témoignages fictifs clairement marqués démonstration, avec citations, prénoms fictifs, boutons précédent/suivant, clavier, tactile, labels accessibles et fallback reduced-motion ; aucune note vérifiée ou preuve de patient réel n’est impliquée.

## Rendez-vous, FAQ et contact

- [x] Le CTA affiche « Prêt à prendre soin de votre sourire ? », le texte fourni et « Réserver mon rendez-vous » ; le clic ouvre le chatbot avec l’intent booking et aucune réservation n’est confirmée sans succès n8n.
- [x] La FAQ est un accordion accessible avec les cinq questions demandées, des réponses concises de démonstration et aucune information de diagnostic personnalisé.
- [x] Le formulaire Contact contient Nom, Email, Téléphone, Sujet et Message avec labels accessibles, champs requis, validation email, messages d’erreur utiles, loading, success et error ; les coordonnées restent explicitement des placeholders de démonstration et aucune transmission n’est prétendue sans backend.

## Internationalisation et accessibilité

- [x] Toutes les chaînes visibles sont centralisées et disponibles en français par défaut, anglais et arabe ; la préférence est persistée, le `lang` est mis à jour, l’arabe active RTL avec alignement, police et icônes directionnelles appropriés, et le menu reste utilisable.
- [x] Le site utilise HTML sémantique, hiérarchie H1/H2, labels, boutons accessibles, clavier, focus visible, contraste suffisant, aria-live pour les mises à jour chatbot/formulaires et respect de `prefers-reduced-motion`.

## Chatbot et intégration n8n

- [x] Le launcher bottom-right ouvre et ferme une fenêtre chatbot premium qui contient header, identité, fermer/minimiser, historique, quick actions, input, envoi, loading, erreur et retry.
- [x] Le message de bienvenue français fourni est présent ; les quick actions déclenchent les intents rendez-vous, modification, annulation et question ; les messages ont bulles, timestamps, typing indicator, auto-scroll, Enter-to-send, état disabled et prévention des doublons.
- [x] `src/services/chatbotService.ts` sépare l’appel réseau, le payload configurable, la validation, l’adapter de réponse, le timeout, les erreurs HTTP/réseau et la conservation du message en erreur.
- [x] `src/config/chatbot.ts` lit `VITE_N8N_WEBHOOK_URL`, permet mode démo/production, timeout et mapping public ; aucun secret, token n8n, Google Calendar ou Airtable n’est exposé.
- [x] Sans webhook, le chatbot indique clairement le mode démo et produit des réponses déterministes sans confirmer d’action réelle ; avec webhook, les confirmations sont affichées uniquement après succès de la réponse n8n.
- [x] Le README documente configuration webhook, mode production, mapping, test de connexion et résolution des erreurs CORS/HTTP, sans prétendre que l’intégration est active avant test.

## SEO, performance, sécurité et livraison

- [x] `index.html` contient un contenu public significatif, title, meta description, Open Graph, Twitter Card, favicon/logo et métadonnées sans fausse adresse, téléphone ou donnée médicale.
- [x] Les visuels possèdent des alt texts, sont limités aux usages prévus et ne présentent pas de personnes réelles comme des professionnels de santé réels.
- [x] Le rendu ne crée pas de débordement horizontal sur mobile, réduit la qualité 3D sur petits écrans, charge les effets lourds au besoin et fournit du contenu de fallback.
- [x] Le projet démarre sur `0.0.0.0:3000`, le manifeste route est servi en JSON, `pnpm build` produit `dist/index.html`, les imports TypeScript sont propres, aucun bouton requis ne reste décoratif et les erreurs réseau/timeout/réponse invalide sont gérées.
- [x] La configuration de build statique est prête pour le checkpoint ; aucune publication automatique n’est activée et la connexion n8n n’est pas revendiquée comme testée.

# Studio Whip & Shea - Marketing AI Studio

Bienvenue dans le **Studio Whip & Shea**, une plateforme de création publicitaire ultra-premium propulsée par l'Intelligence Artificielle. Ce studio permet de générer des visuels et des vidéos marketing pour des produits cosmétiques (spécifiquement la crème de karité gourmande) avec un rendu professionnel et appétissant.

## Créateur & Copyright

**Créé par : B.Maayoud**

### Mentions Légales et Droits d'Auteur
Tous les droits de cette création sont réservés à **B.Maayoud**.
- Toute utilisation commerciale ou personnelle de ce projet est soumise à un accord préalable et à un paiement.
- Il est strictement interdit de modifier, de toucher ou d'utiliser ce code et ce design sans l'accord explicite du créateur.
- L'abus de cette création est passible de poursuites.
- **Contact pour licence & usage : lebm940@gmail.com**

---

## Guide de Configuration API Professionnel

Pour que le studio fonctionne à 100% (Images et Vidéos), vous devez configurer une clé API Google Gemini.

### 1. Obtenir votre clé
- Rendez-vous sur [Google AI Studio](https://aistudio.google.com/).
- Connectez-vous avec votre compte Google.
- Cliquez sur **"Get API Key"**.

### 2. Compatibilité des Modèles
- **Images (Studio Photo)** : Utilise `gemini-2.5-flash-image`. Ce modèle est généralement disponible avec les clés gratuites.
- **Vidéos (Studio Vidéo)** : Utilise `veo-3.1-fast-generate-preview`. 
  - *Note importante* : L'accès à Veo peut nécessiter que votre projet Google Cloud ait la **facturation activée** ou que vous fassiez partie d'un programme d'accès anticipé. Si la vidéo ne génère pas, vérifiez les permissions de votre clé sur AI Studio.

### 3. Installation dans le Logiciel
- Ouvrez l'onglet **Paramètres** dans l'application.
- Collez votre clé `AIzaSy...`.
- Cliquez sur **"Tester"** pour vérifier la validité immédiate de la clé.
- Si le test affiche "Clé Valide", vous pouvez commencer vos rendus.

---

## Transformer en Logiciel Windows (.exe)

Pour transformer ce studio en une application de bureau téléchargeable :

1. **Installer Electron** :
   ```bash
   npm install --save-dev electron
   ```
2. **Configurer Electron** : Créez un fichier `main.js` pour charger l'URL de l'application.
3. **Packager l'application** : Utilisez `electron-builder`.
   ```bash
   npx electron-builder
   ```

---
*Propulsé par Gemini AI & Imaginé par B.Maayoud (lebm940@gmail.com)*

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Menu, 
  X, 
  Upload, 
  ArrowRight, 
  Image as ImageIcon,
  Wand2,
  Loader2,
  CheckCircle2,
  Star,
  Zap,
  Video,
  Download,
  Key,
  Palette,
  Camera,
  ChevronLeft,
  ChevronRight,
  Layers,
  Settings,
  Library,
  Trash2,
  ExternalLink,
  Save,
  UserCog,
  History,
  Eye,
  EyeOff,
  Pencil,
  Trophy,
  BookOpen,
  Target,
  Award,
  Check,
  Monitor,
  Smartphone
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

import { ALL_PROMPTS, CATEGORIES, PromptTemplate } from './prompts';

// --- Global Types ---
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// --- Types ---
interface HistoryItem {
  id: string;
  theme: string;
  images: string[];
  timestamp: number;
  type: 'image' | 'video';
  videoUrl?: string;
}

interface StudioState {
  mode: 'image' | 'video' | 'library' | 'settings' | 'prompts' | 'admin' | 'templates' | 'download';
  originalImage: string | null;
  generatedImages: string[];
  currentImageIndex: number;
  generatedVideo: string | null;
  isProcessing: boolean;
  prompt: string;
  error: string | null;
  hasKey: boolean;
  apiKey: string;
  history: HistoryItem[];
  isKeyValidating: boolean;
  keyStatus: 'valid' | 'invalid' | null;
  user: { id: string; username: string; role: string; email: string; token: string } | null;
  authMode: 'login' | 'register' | 'admin-login';
  adminUsers: any[];
  selectedUserHistory: HistoryItem[];
  editingUser: any | null;
  showPassword: { [key: string]: boolean };
  progressPoints: number;
  completedExercises: string[];
}

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
    <div className="relative">
      <div className="w-12 h-12 bg-gradient-to-br from-[#FF4D8D] to-[#FF85B3] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF4D8D]/20 group-hover:rotate-12 transition-transform duration-500">
        <Sparkles className="text-white w-7 h-7" />
      </div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFD1DC] rounded-full border-2 border-white" 
      />
    </div>
    <div className="flex flex-col">
      <span className="text-2xl font-black tracking-tight text-[#FF4D8D] leading-none">STUDIO WHIP & SHEA</span>
      <span className="text-[10px] font-bold tracking-[0.2em] text-[#6D4C52] uppercase">Marketing Studio</span>
    </div>
  </div>
);

const PROMPT_GUIDE = [
  {
    id: "structure",
    title: "L'Anatomie d'un Prompt Expert",
    content: "Un prompt professionnel se décompose en 6 couches : [Sujet] + [Action] + [Environnement] + [Éclairage] + [Caméra] + [Texture].",
    details: "Pour les cookies, ne dites pas 'un cookie'. Dites 'Un cookie artisanal épais aux pépites de chocolat noir fondues'. Pour les cosmétiques, précisez le matériau du contenant (verre dépoli, aluminium brossé).",
    example: "Pot de crème Whip & Shea en verre dépoli, ouvert, posé sur un bloc de marbre rose, éclairage softbox latéral, macro 85mm.",
    points: 10
  },
  {
    id: "lighting",
    title: "Maîtrise de la Lumière Marketing",
    content: "La lumière vend le produit. Utilisez 'Rim Lighting' pour détacher le produit du fond et 'Caustics' pour le luxe.",
    details: "Le 'Rim Light' crée un filet de lumière sur les bords, idéal pour les flacons. Les 'Caustics' sont les reflets de lumière à travers le verre ou l'eau.",
    example: "Éclairage de contour (rim light) précis, reflets de caustiques cristallines sur fond minimaliste.",
    points: 15
  },
  {
    id: "textures",
    title: "Textures & Appétence (Gourmandise)",
    content: "Utilisez des adjectifs sensoriels : onctueux, soyeux, fondant, croustillant, nacré.",
    details: "Pour Gemini, décrivez la viscosité. 'Texture de crème fouettée formant des pics soyeux' ou 'Cœur de chocolat coulant et visqueux'.",
    example: "Texture onctueuse et brillante, pics de crème soyeux, rendu ultra-réaliste.",
    points: 20
  }
];

const PROMPT_EXERCISES = [
  {
    id: "ex1",
    title: "L'Explosion d'Ingrédients",
    task: "Créez un prompt pour un cookie qui montre une explosion de ses ingrédients de base (pépites, noix, etc.) sans mélanger les styles.",
    hint: "Utilisez 'Dynamic explosion of [ingredients]' et 'High-speed photography'.",
    targetPoints: 50
  },
  {
    id: "ex2",
    title: "Le Luxe Cosmétique",
    task: "Rendez un pot de crème Karité si luxueux qu'il semble sortir d'une boutique Place Vendôme.",
    hint: "Mots-clés : 'Travertine pedestal', 'Luxury editorial', 'Vogue aesthetic', '8k hyper-realistic'.",
    targetPoints: 75
  },
  {
    id: "ex3",
    title: "Le Cookie Arc-en-ciel",
    task: "Imaginez un cookie multicolore réaliste, pas enfantin, mais haut de gamme et appétissant.",
    hint: "Utilisez 'Iridescent sugar crystals', 'Gourmet rainbow palette', 'Soft cinematic lighting'.",
    targetPoints: 100
  }
];

const ALTERNATIVES = [
  {
    name: "OpenAI DALL-E 3",
    how: "Via l'API OpenAI. Nécessite une clé API OpenAI et l'utilisation de la bibliothèque 'openai'.",
    pros: "Excellente compréhension des instructions complexes.",
    cons: "Moins de contrôle sur les variations subtiles que Gemini 2.5."
  },
  {
    name: "Stability AI (Stable Diffusion)",
    how: "Via l'API Stability.ai ou en local with Automatic1111.",
    pros: "Contrôle total (ControlNet, LoRA). Idéal pour garder un produit identique.",
    cons: "Plus complexe à configurer techniquement."
  },
  {
    name: "Midjourney",
    how: "Principalement via Discord ou leur nouvelle API alpha (très restreinte).",
    pros: "Le rendu le plus artistique et 'photographique' du marché.",
    cons: "Pas d'API publique simple pour une intégration directe en logiciel."
  }
];

const PROMPT_TEMPLATES = [
  {
    title: "Explosion d'Ingrédients Dynamique",
    category: "Adaptable",
    prompt: "Photographie haute vitesse (high-speed photography) d'un [VOTRE PRODUIT ICI], capturé au moment d'une explosion dynamique de ses ingrédients naturels (ex: éclats de chocolat, morceaux de noix, fruits frais). Éclaboussures artistiques de [LIQUIDE: ex lait ou miel], éclairage de studio ultra-net, fond neutre texturé, profondeur de champ cinématographique, rendu 8k hyper-réaliste, chaque particule est détaillée.",
    image: "https://picsum.photos/seed/ingredient-explosion/800/800"
  },
  {
    title: "Cookie Arc-en-ciel Gourmet",
    category: "Cookies",
    prompt: "Gros plan macro d'un cookie artisanal épais et moelleux, parsemé de cristaux de sucre irisés et de pépites multicolores aux teintes pastel élégantes. Texture de pâte parfaitement cuite avec des bords croustillants, posé sur un papier sulfurisé froissé, lumière naturelle douce de fin de journée, ambiance chaleureuse de boulangerie de luxe, rendu ultra-réaliste et appétissant.",
    image: "https://picsum.photos/seed/rainbow-cookie/800/800"
  },
  {
    title: "Pot Karité 'Or Blanc'",
    category: "Cosmétique",
    prompt: "Rendu publicitaire haut de gamme d'un pot de crème au beurre de karité Whip & Shea. Le pot est en verre dépoli avec un couvercle en bois de chêne clair, posé sur une plaque de marbre blanc veiné. À côté, une noix de karité brute ouverte révélant sa texture. Éclairage 'softbox' latéral créant des ombres douces et élégantes, atmosphère pure et organique, style éditorial luxe.",
    image: "https://picsum.photos/seed/shea-luxury/800/800"
  },
  {
    title: "Texture 'Whip' Onctueuse",
    category: "Cosmétique",
    prompt: "Macro-photographie de la texture d'une crème cosmétique fouettée (whipped cream texture), formant des pics soyeux et nacrés. Reflets de lumière subtils on the surface onctueuse, teintes blanc cassé et ivoire, pureté absolue, focus extrême sur les détails de la matière, rendu 8k Octane, esthétique minimaliste et sensorielle.",
    image: "https://picsum.photos/seed/cream-texture/800/800"
  },
  {
    title: "Cookie Cœur Coulant",
    category: "Cookies",
    prompt: "Un cookie au chocolat noir fraîchement sorti du four, coupé en deux, révélant un cœur de chocolat fondu visqueux et brillant qui s'écoule lentement. Vapeur légère s'échappant du biscuit, pépites de chocolat encore chaudes en surface, éclairage directionnel chaud, fond de cuisine rustique flou (bokeh), ultra-gourmand, style publicité TV.",
    image: "https://picsum.photos/seed/melting-cookie/800/800"
  },
  {
    title: "Soin Karité & Fleurs",
    category: "Cosmétique",
    prompt: "Produit cosmétique Whip & Shea flottant dans une eau cristalline parsemée de fleurs blanches et de feuilles de karité. Caustiques de lumière dansant au fond de l'eau, fraîcheur intense, pureté, teintes bleutées et blanches, rendu hyper-réaliste, atmosphère spa de luxe.",
    image: "https://picsum.photos/seed/water-cosmetic/800/800"
  },
  {
    title: "Le Cookie 'Peanut Butter'",
    category: "Cookies",
    prompt: "Cookie gourmand au beurre de cacahuète, surmonté d'un filet de caramel fondant et de cacahuètes grillées concassées. Texture granuleuse et riche, posé sur une table en bois sombre, éclairage dramatique de côté, contrastes élevés, rendu 8k, chaque grain de sel est visible.",
    image: "https://picsum.photos/seed/peanut-cookie/800/800"
  },
  {
    title: "L'Écrin Minimaliste",
    category: "Luxe",
    prompt: "Un seul produit Whip & Shea centré dans un espace vide architectural, murs en béton poli, une seule ligne de lumière néon blanche traversant la scène, reflets futuristes, minimalisme absolu, élégance radicale, rendu de haute précision.",
    image: "https://picsum.photos/seed/minimal-luxe/800/800"
  },
  {
    title: "Splash de Lait & Karité",
    category: "Cosmétique",
    prompt: "Capture haute vitesse d'un pot de crème Whip & Shea tombant dans un bain de lait crémeux, créant un splash sculptural parfait. Gouttelettes en suspension, texture liquide onctueuse, éclairage de studio blanc pur, fraîcheur et douceur, rendu publicitaire professionnel.",
    image: "https://picsum.photos/seed/milk-splash/800/800"
  },
  {
    title: "Cookie 'Banana Bread' Style",
    category: "Cookies",
    prompt: "Cookie moelleux à la banane et noix de pécan, décoré d'une tranche de banane caramélisée sur le dessus. Teintes dorées et brunes, texture riche et humide, lumière matinale douce, ambiance petit-déjeuner gourmet, rendu ultra-détaillé.",
    image: "https://picsum.photos/seed/banana-cookie/800/800"
  },
  {
    title: "Matcha & Chocolat Blanc",
    category: "Cookies",
    prompt: "Cookie artisanal au thé matcha d'un vert vibrant, parsemé de grosses pépites de chocolat blanc fondues. Contraste de couleurs saisissant, texture sablée et fondante, posé sur une natte en bambou, lumière zénithale douce, esthétique zen et gourmande.",
    image: "https://picsum.photos/seed/matcha-cookie/800/800"
  },
  {
    title: "Soin Karité 'Nuit Étoilée'",
    category: "Luxe",
    prompt: "Édition nocturne d'un produit Whip & Shea. Flacon sombre sur un miroir noir reflétant un ciel étoilé subtil. Éclairage bleu profond et argenté, mystérieux et luxueux, focus sur les reflets métalliques du logo, rendu cinématographique haute performance.",
    image: "https://picsum.photos/seed/night-care/800/800"
  },
  {
    title: "Explosion de Fruits Rouges",
    category: "Adaptable",
    prompt: "Un [PRODUIT] au centre d'un tourbillon dynamique de fraises, framboises et mûres éclatées. Gouttes de jus de fruits rouges en suspension, fraîcheur explosive, couleurs saturées et vibrantes, éclairage de studio haute vitesse, rendu 8k ultra-appétissant.",
    image: "https://picsum.photos/seed/berry-explosion/800/800"
  },
  {
    title: "Cookie 'Red Velvet' Royal",
    category: "Cookies",
    prompt: "Cookie Red Velvet d'un rouge profond, cœur fondant au cream cheese blanc éclatant. Texture veloutée, parsemé de miettes de biscuit, posé sur une assiette en porcelaine, lumière douce et romantique, rendu ultra-réaliste style pâtisserie fine.",
    image: "https://picsum.photos/seed/redvelvet-cookie/800/800"
  },
  {
    title: "Sérum Karité Éclat",
    category: "Cosmétique",
    prompt: "Gros plan sur un sérum au karité translucide et doré. Bulles d'air microscopiques en suspension, pipette en verre déposant une gauche parfaite, reflets de lumière prismatiques, pureté et efficacité scientifique, rendu macro professionnel.",
    image: "https://picsum.photos/seed/serum-glow/800/800"
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [studio, setStudio] = useState<StudioState>({
    mode: 'image',
    originalImage: null,
    generatedImages: [],
    currentImageIndex: 0,
    generatedVideo: null,
    isProcessing: false,
    prompt: '',
    error: null,
    hasKey: false,
    apiKey: '',
    history: [],
    isKeyValidating: false,
    keyStatus: null,
    user: null,
    authMode: 'login',
    adminUsers: [],
    selectedUserHistory: [],
    editingUser: null,
    showPassword: {},
    progressPoints: 0,
    completedExercises: [],
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('WHIP_SHEA_USER');
    if (savedUser) {
      try {
        setStudio(prev => ({ ...prev, user: JSON.parse(savedUser) }));
      } catch (e) {
        localStorage.removeItem('WHIP_SHEA_USER');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      const userData = { ...data.user, token: data.token };
      localStorage.setItem('WHIP_SHEA_USER', JSON.stringify(userData));
      setStudio(prev => ({ ...prev, user: userData, error: null }));
    } catch (err: any) {
      setStudio(prev => ({ ...prev, error: err.message }));
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const email = formData.get('email') as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStudio(prev => ({ ...prev, authMode: 'login', error: "Compte créé ! Connectez-vous." }));
    } catch (err: any) {
      setStudio(prev => ({ ...prev, error: err.message }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('WHIP_SHEA_USER');
    setStudio(prev => ({ ...prev, user: null, mode: 'image' }));
  };

  const deleteAccount = async () => {
    if (!confirm("Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible (RGPD).")) return;
    try {
      await fetch('/api/user/me', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${studio.user?.token}` }
      });
      handleLogout();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const completeExercise = (id: string, points: number) => {
    setStudio(prev => {
      if (prev.completedExercises.includes(id)) return prev;
      return {
        ...prev,
        progressPoints: prev.progressPoints + points,
        completedExercises: [...prev.completedExercises, id]
      };
    });
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${studio.user?.token}` }
      });
      const data = await res.json();
      setStudio(prev => ({ ...prev, adminUsers: data }));
    } catch (e) {
      console.error("Admin fetch failed", e);
    }
  };

  const deleteUserAdmin = async (id: string) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${studio.user?.token}` }
      });
      fetchAdminUsers();
    } catch (e) {
      alert("Erreur suppression");
    }
  };

  const fetchUserHistoryAdmin = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/history/${userId}`, {
        headers: { 'Authorization': `Bearer ${studio.user?.token}` }
      });
      const data = await res.json();
      setStudio(prev => ({ ...prev, selectedUserHistory: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const updateUserAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studio.editingUser) return;
    
    const formData = new FormData(e.currentTarget);
    const updateData = {
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string || undefined
    };

    try {
      const res = await fetch(`/api/admin/users/${studio.editingUser.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studio.user?.token}` 
        },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        setStudio(prev => ({ ...prev, editingUser: null }));
        fetchAdminUsers();
      }
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  useEffect(() => {
    if ((studio.mode as string) === 'admin' && studio.user?.role === 'admin') {
      fetchAdminUsers();
    }
  }, [studio.mode]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('WHIP_SHEA_API_KEY');
      const savedHistory = localStorage.getItem('WHIP_SHEA_HISTORY');
      
      setStudio(prev => ({
        ...prev,
        apiKey: savedKey || '',
        hasKey: !!savedKey,
        history: savedHistory ? JSON.parse(savedHistory) : [],
      }));
    } catch (e) {
      console.error("Error loading from localStorage", e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (studio.history.length > 0) {
      try {
        localStorage.setItem('WHIP_SHEA_HISTORY', JSON.stringify(studio.history));
      } catch (e) {
        console.warn("LocalStorage quota exceeded, history might not be fully saved.", e);
        // If quota exceeded, we keep it in memory but stop trying to save the whole thing
      }
    }
  }, [studio.history]);

  const saveApiKey = (key: string) => {
    try {
      localStorage.setItem('WHIP_SHEA_API_KEY', key);
      setStudio(prev => ({ ...prev, apiKey: key, hasKey: !!key, error: null, keyStatus: null }));
    } catch (e) {
      setStudio(prev => ({ ...prev, error: "Impossible de sauvegarder la clé localement." }));
    }
  };

  const validateApiKey = async () => {
    if (!studio.apiKey) return;
    setStudio(prev => ({ ...prev, isKeyValidating: true, keyStatus: null }));
    try {
      const ai = new GoogleGenAI({ apiKey: studio.apiKey });
      // Simple test call to verify key
      await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ parts: [{ text: 'test' }] }],
        config: { maxOutputTokens: 1 }
      });
      setStudio(prev => ({ ...prev, isKeyValidating: false, keyStatus: 'valid' }));
    } catch (e) {
      console.error("API Key validation failed", e);
      setStudio(prev => ({ ...prev, isKeyValidating: false, keyStatus: 'invalid' }));
    }
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setStudio(prev => ({
      ...prev,
      history: [newItem, ...prev.history],
    }));
  };

  const deleteHistoryItem = (id: string) => {
    setStudio(prev => ({
      ...prev,
      history: prev.history.filter(item => item.id !== id),
    }));
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setStudio(prev => ({ ...prev, hasKey: true }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudio(prev => ({
          ...prev,
          originalImage: reader.result as string,
          generatedImages: [],
          currentImageIndex: 0,
          generatedVideo: null,
          error: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!studio.prompt) return;
    const activeKey = studio.apiKey || process.env.GEMINI_API_KEY;
    if (!activeKey) {
      setStudio(prev => ({ ...prev, mode: 'settings', error: "Veuillez configurer votre clé API dans les paramètres." }));
      return;
    }

    setStudio(prev => ({ ...prev, isProcessing: true, error: null, generatedImages: [], currentImageIndex: 0 }));

    try {
      const ai = new GoogleGenAI({ apiKey: activeKey });
      
      const variations = [
        "Vue de face, focus produit principal",
        "Vue de dessus artistique, composition équilibrée",
        "Gros plan macro sur la texture et les détails",
        "Mise en situation lifestyle, ambiance luxueuse"
      ];

      const systemInstruction = `Tu es un photographe publicitaire de classe mondiale. Ta mission est de générer 4 images d'un même produit. 
      IMPORTANT : Le produit (packaging, forme, détails) doit être IDENTIQUE sur toutes les images. 
      STYLE : Ultra-premium, gourmand, appétissant, éclairage studio parfait. 
      DÉCOR : Marbre blanc, accessoires de luxe, fruits ou ingrédients frais liés au produit. 
      PAS D'ANIMAUX. Le rendu doit donner envie de consommer ou d'utiliser le produit immédiatement. 
      S'il s'agit de nourriture (ex: cookies), rends-les croustillants et fondants. S'il s'agit de cosmétiques, rends-les onctueux et soyeux.`;

      const validImages: string[] = [];
      
      // Sequential generation to avoid rate limits (429 errors)
      for (const variation of variations) {
        try {
          let contents: any;
          if (studio.originalImage) {
            const base64Data = studio.originalImage.split(',')[1];
            const mimeType = studio.originalImage.split(';')[0].split(':')[1];
            contents = {
              parts: [
                { inlineData: { data: base64Data, mimeType } },
                { text: `${systemInstruction} \n Variation/Angle : ${variation}. \n Instructions spécifiques : ${studio.prompt}` }
              ]
            };
          } else {
            contents = {
              parts: [{ text: `${systemInstruction} \n Variation/Angle : ${variation}. \n Instructions spécifiques : ${studio.prompt}` }]
            };
          }

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents,
            config: { imageConfig: { aspectRatio: "1:1" } }
          });

          for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              validImages.push(`data:image/png;base64,${part.inlineData.data}`);
              // Update UI as images come in
              setStudio(prev => ({ ...prev, generatedImages: [...validImages] }));
              break;
            }
          }
          
          // Small delay between requests to be safe
          if (variations.indexOf(variation) < variations.length - 1) {
            await new Promise(r => setTimeout(r, 1000));
          }
        } catch (e: any) {
          console.error("Variation failed", e);
          if (e.message?.includes("429")) {
            throw new Error("Quota dépassé (429). Veuillez attendre une minute ou utiliser une clé API avec plus de limites.");
          }
        }
      }

      if (validImages.length === 0) throw new Error("Aucune image n'a pu être générée.");

      setStudio(prev => ({
        ...prev,
        isProcessing: false
      }));

      addToHistory({
        theme: studio.prompt,
        images: validImages,
        type: 'image'
      });

    } catch (err: any) {
      console.error("Generation error:", err);
      setStudio(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: err.message || "Erreur lors de la génération. Vérifiez votre clé API et votre connexion." 
      }));
    }
  };

  const generateVideo = async () => {
    if (!studio.prompt) return;
    const activeKey = studio.apiKey || process.env.GEMINI_API_KEY;
    if (!activeKey) {
      setStudio(prev => ({ ...prev, mode: 'settings', error: "Veuillez configurer votre clé API dans les paramètres." }));
      return;
    }

    setStudio(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const ai = new GoogleGenAI({ apiKey: activeKey });
      
      let videoConfig: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Professional commercial for ${studio.prompt}. Cinematic, slow motion, delicious and appetizing visuals, 4k, professional lighting, commercial grade. NO ANIMALS. Focus on the product and its texture.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      };

      if (studio.originalImage) {
        const base64Data = studio.originalImage.split(',')[1];
        const mimeType = studio.originalImage.split(';')[0].split(':')[1];
        videoConfig.image = { imageBytes: base64Data, mimeType };
      }

      let operation = await ai.models.generateVideos(videoConfig);

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setStudio(prev => ({ ...prev, generatedVideo: downloadLink, isProcessing: false }));
        addToHistory({
          theme: studio.prompt,
          images: [],
          type: 'video',
          videoUrl: downloadLink
        });
      } else {
        throw new Error("Video generation failed.");
      }
    } catch (err: any) {
      setStudio(prev => ({ ...prev, isProcessing: false, error: "Erreur lors de la génération de la vidéo." }));
    }
  };

  if (!studio.user) {
    return (
      <div className="min-h-screen bg-[#FFF8F9] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-12 rounded-[60px] border-2 border-[#FFD1DC] shadow-2xl">
          <div className="text-center mb-10">
            <Logo className="justify-center mb-8" />
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {studio.authMode === 'login' ? 'Connexion Client' : studio.authMode === 'register' ? 'Inscription' : 'Accès Admin'}
            </h2>
          </div>

          <form onSubmit={studio.authMode === 'register' ? handleRegister : handleLogin} className="space-y-6">
            {studio.authMode === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#6D4C52] ml-2">Email</label>
                <input name="email" type="email" required className="w-full p-5 bg-[#FFF8F9] border-2 border-[#FFD1DC] rounded-[24px] focus:border-[#FF4D8D] outline-none transition-all" />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#6D4C52] ml-2">Nom d'utilisateur</label>
              <input name="username" type="text" required className="w-full p-5 bg-[#FFF8F9] border-2 border-[#FFD1DC] rounded-[24px] focus:border-[#FF4D8D] outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#6D4C52] ml-2">Mot de passe</label>
              <input name="password" type="password" required className="w-full p-5 bg-[#FFF8F9] border-2 border-[#FFD1DC] rounded-[24px] focus:border-[#FF4D8D] outline-none transition-all" />
            </div>

            {studio.error && <p className="text-red-500 text-center font-bold text-xs">{studio.error}</p>}

            <button type="submit" className="w-full py-5 bg-[#FF4D8D] text-white rounded-[24px] font-black text-lg shadow-xl shadow-[#FF4D8D]/20 hover:scale-[1.02] transition-all">
              {studio.authMode === 'login' || studio.authMode === 'admin-login' ? 'Se Connecter' : "S'inscrire"}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-4 text-center">
            {studio.authMode === 'login' ? (
              <>
                <button onClick={() => setStudio(prev => ({ ...prev, authMode: 'register', error: null }))} className="text-xs font-bold text-[#FF4D8D] hover:underline">Pas de compte ? S'inscrire</button>
                <button onClick={() => setStudio(prev => ({ ...prev, authMode: 'admin-login', error: null }))} className="text-[10px] font-black uppercase tracking-widest text-[#6D4C52]/40 hover:text-[#FF4D8D]">Accès Administration</button>
              </>
            ) : (
              <button onClick={() => setStudio(prev => ({ ...prev, authMode: 'login', error: null }))} className="text-xs font-bold text-[#FF4D8D] hover:underline">Déjà un compte ? Se connecter</button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F9] text-[#3D1A1F] font-sans selection:bg-[#FFD1DC] selection:text-[#FF4D8D]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-[#FFD1DC]/30">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
            <button 
              onClick={() => setStudio(prev => ({ ...prev, mode: 'download' }))}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest ${studio.mode === 'download' ? 'bg-[#FF4D8D] text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
            >
              <Download className="w-4 h-4" /> Télécharger
            </button>
            <button onClick={() => setStudio(prev => ({ ...prev, mode: 'image' }))} className={`hover:text-[#FF4D8D] transition-colors ${studio.mode === 'image' ? 'text-[#FF4D8D]' : ''}`}>Studio</button>
            <button onClick={() => setStudio(prev => ({ ...prev, mode: 'templates' }))} className={`hover:text-[#FF4D8D] transition-colors flex items-center gap-2 ${studio.mode === 'templates' ? 'text-[#FF4D8D]' : ''}`}>
              <Palette className="w-4 h-4" /> Catalogue
            </button>
            <button onClick={() => setStudio(prev => ({ ...prev, mode: 'prompts' }))} className={`hover:text-[#FF4D8D] transition-colors flex items-center gap-2 ${studio.mode === 'prompts' ? 'text-[#FF4D8D]' : ''}`}>
              <Wand2 className="w-4 h-4" /> Ingénierie
            </button>
            <button onClick={() => setStudio(prev => ({ ...prev, mode: 'library' }))} className={`hover:text-[#FF4D8D] transition-colors flex items-center gap-2 ${studio.mode === 'library' ? 'text-[#FF4D8D]' : ''}`}>
              <Library className="w-4 h-4" /> Bibliothèque
            </button>
            <button onClick={() => setStudio(prev => ({ ...prev, mode: 'settings' }))} className={`hover:text-[#FF4D8D] transition-colors flex items-center gap-2 ${studio.mode === 'settings' ? 'text-[#FF4D8D]' : ''}`}>
              <Settings className="w-4 h-4" /> Paramètres
            </button>
            {studio.user.role === 'admin' && (
              <button onClick={() => setStudio(prev => ({ ...prev, mode: 'admin' as any }))} className="px-4 py-2 bg-[#3D1A1F] text-white rounded-xl flex items-center gap-2 hover:bg-black transition-all">
                <Zap className="w-4 h-4 text-[#FF4D8D]" /> Admin
              </button>
            )}
            <button onClick={handleLogout} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-24 left-0 w-full bg-white border-b border-[#FFD1DC] p-6 space-y-4 shadow-xl"
            >
              <button 
                onClick={() => { setStudio(prev => ({ ...prev, mode: 'download' })); setIsMenuOpen(false); }}
                className="w-full p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs"
              >
                <Download className="w-4 h-4" /> Télécharger l'Application
              </button>
              <button onClick={() => { setStudio(prev => ({ ...prev, mode: 'image' })); setIsMenuOpen(false); }} className="w-full p-4 bg-[#FFF8F9] rounded-2xl font-black uppercase tracking-widest text-xs text-left">Studio</button>
              <button onClick={() => { setStudio(prev => ({ ...prev, mode: 'templates' })); setIsMenuOpen(false); }} className="w-full p-4 bg-[#FFF8F9] rounded-2xl font-black uppercase tracking-widest text-xs text-left flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#FF4D8D]" /> Catalogue
              </button>
              <button onClick={() => { setStudio(prev => ({ ...prev, mode: 'prompts' })); setIsMenuOpen(false); }} className="w-full p-4 bg-[#FFF8F9] rounded-2xl font-black uppercase tracking-widest text-xs text-left">Ingénierie</button>
              <button onClick={() => { setStudio(prev => ({ ...prev, mode: 'library' })); setIsMenuOpen(false); }} className="w-full p-4 bg-[#FFF8F9] rounded-2xl font-black uppercase tracking-widest text-xs text-left">Bibliothèque</button>
              <button onClick={() => { setStudio(prev => ({ ...prev, mode: 'settings' })); setIsMenuOpen(false); }} className="w-full p-4 bg-[#FFF8F9] rounded-2xl font-black uppercase tracking-widest text-xs text-left">Paramètres</button>
              <button onClick={handleLogout} className="w-full p-4 bg-red-50 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs text-left">Déconnexion</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#FF4D8D] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFB6C1] rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#FFD1DC] text-[#FF4D8D] rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-8 shadow-sm">
              <Palette className="w-3 h-3" />
              L'Art de la Publicité Produit
            </div>
            <h1 className="text-6xl md:text-[120px] font-black leading-[0.8] tracking-tighter mb-8">
              MARKETING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D8D] via-[#FF85B3] to-[#FFB6C1]">STUDIO</span>
            </h1>
            <p className="text-xl text-[#6D4C52] max-w-2xl mx-auto font-medium mb-12">
              Générez des visuels et vidéos publicitaires ultra-professionnels pour vos produits Whip & Shea. Des rendus si onctueux qu'ils déclenchent l'achat immédiat.
            </p>
            <div className="flex justify-center gap-6">
              <a href="#studio" className="px-10 py-5 bg-[#FF4D8D] text-white rounded-[24px] font-black text-lg shadow-2xl shadow-[#FF4D8D]/40 hover:scale-105 transition-all flex items-center gap-3">
                Entrer dans le Studio <ArrowRight className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Studio Content */}
      <section id="studio" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {studio.mode === 'download' ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto">
              <div className="bg-white rounded-[60px] border-2 border-[#FFD1DC] overflow-hidden shadow-2xl">
                <div className="grid md:grid-cols-2">
                  <div className="p-12 md:p-20 space-y-10 bg-gradient-to-br from-white to-[#FFF8F9]">
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-[#FF4D8D] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#FF4D8D]/20">
                        <Download className="w-8 h-8" />
                      </div>
                      <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Studio <span className="text-[#FF4D8D]">Desktop</span></h2>
                      <p className="text-[#6D4C52] font-medium text-lg leading-relaxed">
                        Utilisez Studio Whip & Shea comme une application native sur votre PC, Mac ou Mobile. Plus rapide, plus fluide, et toujours à portée de main.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-black uppercase text-[10px] tracking-widest text-[#3D1A1F]">Accès Direct</p>
                          <p className="text-xs text-[#6D4C52]">Lancez l'app depuis votre barre des tâches ou écran d'accueil.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-black uppercase text-[10px] tracking-widest text-[#3D1A1F]">Mode Hors-Ligne</p>
                          <p className="text-xs text-[#6D4C52]">Consultez votre bibliothèque et vos prompts même sans connexion.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-black uppercase text-[10px] tracking-widest text-[#3D1A1F]">Expérience Native</p>
                          <p className="text-xs text-[#6D4C52]">Une interface optimisée, sans les barres d'outils du navigateur.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 space-y-4">
                      {deferredPrompt ? (
                        <button 
                          onClick={installApp}
                          className="w-full py-6 bg-[#FF4D8D] text-white rounded-[32px] font-black text-xl shadow-2xl shadow-[#FF4D8D]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                          <Monitor className="w-6 h-6" /> Installer Maintenant
                        </button>
                      ) : (
                        <div className="space-y-6">
                          <div className="p-6 bg-emerald-50 border-2 border-emerald-100 rounded-[32px] text-center">
                            <p className="text-emerald-600 font-black uppercase text-xs tracking-widest">Prêt pour l'installation manuelle</p>
                            <p className="text-[10px] text-emerald-500 mt-1">Si le bouton automatique n'apparaît pas, suivez le guide ci-dessous.</p>
                          </div>
                          
                          <div className="bg-white p-8 rounded-[40px] border border-[#FFD1DC] space-y-6">
                            <h4 className="font-black text-xs uppercase tracking-widest text-[#FF4D8D]">Guide d'installation manuelle</h4>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="w-6 h-6 bg-[#FFF8F9] rounded-full flex items-center justify-center text-[10px] font-black border border-[#FFD1DC]">1</div>
                                <p className="text-[10px] font-bold text-[#6D4C52]">Cliquez sur l'icône de partage ou les trois points (⋮) de votre navigateur.</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="w-6 h-6 bg-[#FFF8F9] rounded-full flex items-center justify-center text-[10px] font-black border border-[#FFD1DC]">2</div>
                                <p className="text-[10px] font-bold text-[#6D4C52]">Sélectionnez "Installer l'application" ou "Ajouter à l'écran d'accueil".</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="w-6 h-6 bg-[#FFF8F9] rounded-full flex items-center justify-center text-[10px] font-black border border-[#FFD1DC]">3</div>
                                <p className="text-[10px] font-bold text-[#6D4C52]">Confirmez l'installation. L'icône Whip & Shea apparaîtra sur votre bureau.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden md:block relative bg-[#3D1A1F] overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#FF4D8D_0%,transparent_70%)]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center p-20">
                      <div className="relative w-full aspect-[4/3] bg-white rounded-2xl shadow-2xl border-4 border-[#FFD1DC] overflow-hidden">
                        <div className="h-6 bg-[#FFF8F9] border-b border-[#FFD1DC] flex items-center px-3 gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <div className="w-2 h-2 rounded-full bg-yellow-400" />
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                        <div className="p-4 space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#FF4D8D] rounded-lg" />
                            <div className="h-3 w-24 bg-[#FFD1DC] rounded" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-20 bg-[#FFF8F9] rounded-xl border border-[#FFD1DC]" />
                            <div className="h-20 bg-[#FFF8F9] rounded-xl border border-[#FFD1DC]" />
                          </div>
                          <div className="h-32 bg-[#FFF8F9] rounded-xl border border-[#FFD1DC]" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <Monitor className="w-8 h-8 text-white/40" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Desktop</span>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="flex flex-col items-center gap-2">
                        <Smartphone className="w-8 h-8 text-white/40" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Mobile</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <button 
                  onClick={() => setStudio(prev => ({ ...prev, mode: 'image' }))}
                  className="text-[#6D4C52] font-black uppercase text-[10px] tracking-[0.2em] hover:text-[#FF4D8D] transition-colors"
                >
                  ← Retourner au Studio
                </button>
              </div>
            </motion.div>
          ) : studio.mode === 'templates' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter">Catalogue <span className="text-[#FF4D8D]">Expert</span></h2>
                  <p className="text-[#6D4C52] font-medium mt-2">Plus de 100 prompts optimisés pour des résultats publicitaires époustouflants.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Toutes", ...CATEGORIES].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-[#FF4D8D] text-white' : 'bg-white border border-[#FFD1DC] text-[#6D4C52] hover:bg-[#FFD1DC]/20'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ALL_PROMPTS.filter(p => selectedCategory === "Toutes" || p.category === selectedCategory).map((template, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-[40px] border-2 border-[#FFD1DC] overflow-hidden hover:border-[#FF4D8D] transition-all shadow-xl hover:shadow-2xl hover:shadow-[#FF4D8D]/10"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img src={template.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={template.title} referrerPolicy="no-referrer" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[8px] font-black uppercase tracking-widest text-[#FF4D8D] border border-[#FFD1DC]">
                          {template.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h3 className="text-xl font-black uppercase tracking-tighter text-[#3D1A1F]">{template.title}</h3>
                      <p className="text-xs text-[#6D4C52] line-clamp-3 font-medium leading-relaxed italic">"{template.prompt}"</p>
                      <div className="pt-4 flex gap-3">
                        <button 
                          onClick={() => {
                            setStudio(prev => ({ ...prev, mode: 'image', prompt: template.prompt }));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex-1 py-4 bg-[#FF4D8D] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <Wand2 className="w-4 h-4" /> Utiliser ce Prompt
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(template.prompt);
                            alert("Prompt copié !");
                          }}
                          className="p-4 bg-[#FFF8F9] text-[#FF4D8D] rounded-2xl border border-[#FFD1DC] hover:bg-[#FFD1DC] transition-all"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : studio.mode === 'settings' ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-12">
              <div className="bg-[#FFF8F9] p-12 rounded-[60px] border-2 border-[#FFD1DC]">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-[#FF4D8D] rounded-2xl flex items-center justify-center text-white">
                    <Settings className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">Paramètres Studio & API</h2>
                </div>
                
                <div className="space-y-10">
                  {/* API Key Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6D4C52] ml-2">Clé API Gemini (Google AI Studio)</label>
                      {studio.keyStatus === 'valid' && <span className="text-emerald-500 text-[10px] font-black uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Clé Valide</span>}
                      {studio.keyStatus === 'invalid' && <span className="text-red-500 text-[10px] font-black uppercase flex items-center gap-1"><X className="w-3 h-3" /> Clé Invalide</span>}
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <input 
                          type="password"
                          value={studio.apiKey}
                          onChange={(e) => saveApiKey(e.target.value)}
                          placeholder="AIzaSy..."
                          className="w-full p-6 bg-white border-2 border-[#FFD1DC] rounded-[24px] focus:border-[#FF4D8D] outline-none transition-all font-mono text-sm"
                        />
                        <Key className="absolute right-6 top-1/2 -translate-y-1/2 text-[#FFD1DC] w-5 h-5" />
                      </div>
                      <button 
                        onClick={validateApiKey}
                        disabled={!studio.apiKey || studio.isKeyValidating}
                        className="px-8 bg-white border-2 border-[#FFD1DC] text-[#FF4D8D] rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-[#FFD1DC] transition-all disabled:opacity-50"
                      >
                        {studio.isKeyValidating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tester"}
                      </button>
                    </div>
                  </div>

                  {/* Alternatives Section */}
                  <div className="space-y-6">
                    <h4 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-[#FF4D8D]">
                      <Layers className="w-4 h-4" /> Alternatives à Gemini
                    </h4>
                    <div className="grid md:grid-cols-3 gap-6">
                      {ALTERNATIVES.map((alt, i) => (
                        <div key={i} className="p-6 bg-white rounded-[32px] border border-[#FFD1DC] space-y-3">
                          <p className="font-black text-sm uppercase text-[#FF4D8D]">{alt.name}</p>
                          <p className="text-[10px] leading-relaxed text-[#6D4C52]">{alt.how}</p>
                          <div className="pt-2 space-y-1">
                            <p className="text-[9px] font-bold text-emerald-600">PROS: {alt.pros}</p>
                            <p className="text-[9px] font-bold text-red-600">CONS: {alt.cons}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RGPD Section */}
                  <div className="p-8 bg-white rounded-[40px] border border-[#FFD1DC] flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-widest text-red-500 mb-2">Zone de Danger (RGPD)</h4>
                      <p className="text-xs text-[#6D4C52]">Supprimez définitivement votre compte et toutes vos données.</p>
                    </div>
                    <button onClick={deleteAccount} className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Supprimer mon compte</button>
                  </div>

                  <button 
                    onClick={() => setStudio(prev => ({ ...prev, mode: 'image' }))}
                    className="w-full py-6 bg-[#FF4D8D] text-white rounded-[32px] font-black text-xl shadow-2xl shadow-[#FF4D8D]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                  >
                    <Save className="w-6 h-6" /> Enregistrer & Retourner au Studio
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (studio.mode as string) === 'admin' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-5xl font-black uppercase tracking-tighter">Panel <span className="text-[#FF4D8D]">Administration</span></h2>
                <div className="flex gap-4">
                  {studio.editingUser && (
                    <button onClick={() => setStudio(prev => ({ ...prev, editingUser: null }))} className="px-6 py-3 bg-white border border-[#FFD1DC] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FFD1DC] transition-colors">Annuler Edition</button>
                  )}
                  {studio.selectedUserHistory.length > 0 && (
                    <button onClick={() => setStudio(prev => ({ ...prev, selectedUserHistory: [] }))} className="px-6 py-3 bg-white border border-[#FFD1DC] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FFD1DC] transition-colors">Fermer Bibliothèque</button>
                  )}
                  <button onClick={() => setStudio(prev => ({ ...prev, mode: 'image' }))} className="px-6 py-3 bg-[#FFF8F9] border border-[#FFD1DC] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FFD1DC] transition-colors">Quitter Admin</button>
                </div>
              </div>

              {studio.editingUser ? (
                <div className="max-w-2xl mx-auto bg-white p-12 rounded-[60px] border-2 border-[#FFD1DC] shadow-xl">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-[#FF4D8D] rounded-2xl flex items-center justify-center text-white">
                      <UserCog className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Modifier l'Utilisateur</h3>
                  </div>
                  <form onSubmit={updateUserAdmin} className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#6D4C52] ml-2">Nom d'utilisateur</label>
                      <input name="username" defaultValue={studio.editingUser.username} required className="w-full p-6 bg-[#FFF8F9] border-2 border-[#FFD1DC] rounded-[24px] focus:border-[#FF4D8D] outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#6D4C52] ml-2">Email</label>
                      <input name="email" type="email" defaultValue={studio.editingUser.email} required className="w-full p-6 bg-[#FFF8F9] border-2 border-[#FFD1DC] rounded-[24px] focus:border-[#FF4D8D] outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#6D4C52] ml-2">Nouveau Mot de Passe (Optionnel)</label>
                      <input name="password" type="text" placeholder="Laisser vide pour ne pas changer" className="w-full p-6 bg-[#FFF8F9] border-2 border-[#FFD1DC] rounded-[24px] focus:border-[#FF4D8D] outline-none transition-all font-bold" />
                    </div>
                    <button type="submit" className="w-full py-6 bg-[#FF4D8D] text-white rounded-[32px] font-black text-xl shadow-2xl shadow-[#FF4D8D]/20 hover:scale-[1.02] transition-all">Sauvegarder les modifications</button>
                  </form>
                </div>
              ) : studio.selectedUserHistory.length > 0 ? (
                <div className="space-y-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#3D1A1F] rounded-2xl flex items-center justify-center text-white">
                      <History className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Bibliothèque de l'Utilisateur</h3>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {studio.selectedUserHistory.map((item) => (
                      <div key={item.id} className="bg-white rounded-[40px] border border-[#FFD1DC] overflow-hidden shadow-lg group">
                        <div className="aspect-square bg-[#FFF8F9] relative overflow-hidden">
                          {item.type === 'image' ? (
                            <img src={item.images[0]} className="w-full h-full object-cover" alt={item.theme} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="w-16 h-16 text-[#FF4D8D]" />
                            </div>
                          )}
                        </div>
                        <div className="p-8">
                          <p className="font-black text-xs uppercase tracking-widest text-[#FF4D8D] mb-2">{item.type === 'image' ? 'Pack Photo' : 'Vidéo Pub'}</p>
                          <h4 className="font-bold text-sm text-[#3D1A1F] line-clamp-1 mb-4">{item.theme}</h4>
                          <p className="text-[10px] font-bold text-[#6D4C52]/40 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[60px] border-2 border-[#FFD1DC] overflow-hidden shadow-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-[#FFF8F9] border-b border-[#FFD1DC]">
                      <tr>
                        <th className="p-8 font-black text-[10px] uppercase tracking-widest text-[#6D4C52]">Utilisateur</th>
                        <th className="p-8 font-black text-[10px] uppercase tracking-widest text-[#6D4C52]">Email</th>
                        <th className="p-8 font-black text-[10px] uppercase tracking-widest text-[#6D4C52]">Mot de Passe</th>
                        <th className="p-8 font-black text-[10px] uppercase tracking-widest text-[#6D4C52]">Rôle</th>
                        <th className="p-8 font-black text-[10px] uppercase tracking-widest text-[#6D4C52]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#FFD1DC]/30">
                      {studio.adminUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#FFF8F9]/50 transition-colors">
                          <td className="p-8">
                            <div className="font-bold text-sm">{u.username}</div>
                            <div className="text-[10px] opacity-40 uppercase tracking-tighter">ID: {u.id}</div>
                          </td>
                          <td className="p-8 text-sm opacity-60">{u.email}</td>
                          <td className="p-8">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-xs bg-[#FFF8F9] px-3 py-1 rounded-lg border border-[#FFD1DC]">
                                {studio.showPassword[u.id] ? u.plainPassword : "••••••••"}
                              </span>
                              <button 
                                onClick={() => setStudio(prev => ({ 
                                  ...prev, 
                                  showPassword: { ...prev.showPassword, [u.id]: !prev.showPassword[u.id] } 
                                }))}
                                className="text-[#FF4D8D] hover:scale-110 transition-transform"
                              >
                                {studio.showPassword[u.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                          <td className="p-8">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'admin' ? 'bg-[#3D1A1F] text-white' : 'bg-[#FFD1DC] text-[#FF4D8D]'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-8">
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => fetchUserHistoryAdmin(u.id)}
                                title="Voir Bibliothèque"
                                className="p-3 text-[#FF4D8D] hover:bg-[#FFD1DC] rounded-xl transition-all"
                              >
                                <Library className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => setStudio(prev => ({ ...prev, editingUser: u }))}
                                title="Modifier Infos"
                                className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              {u.role !== 'admin' ? (
                                <button 
                                  onClick={() => deleteUserAdmin(u.id)} 
                                  title="Supprimer"
                                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              ) : (
                                <span className="text-[10px] font-black uppercase opacity-20">Protégé</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          ) : studio.mode === 'library' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-5xl font-black uppercase tracking-tighter">Ma <span className="text-[#FF4D8D]">Bibliothèque</span></h2>
                <button onClick={() => setStudio(prev => ({ ...prev, mode: 'image' }))} className="px-6 py-3 bg-[#FFF8F9] border border-[#FFD1DC] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#FFD1DC] transition-colors">Retour au Studio</button>
              </div>

              {studio.history.length === 0 ? (
                <div className="py-40 text-center bg-[#FFF8F9] rounded-[60px] border-2 border-dashed border-[#FFD1DC]">
                  <Library className="w-20 h-20 mx-auto mb-6 text-[#FFD1DC]" />
                  <p className="font-black uppercase tracking-widest text-[#6D4C52]/40">Aucune création enregistrée</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {studio.history.map((item) => (
                    <motion.div key={item.id} layout className="bg-white rounded-[40px] border border-[#FFD1DC] overflow-hidden shadow-lg group">
                      <div className="aspect-square bg-[#FFF8F9] relative overflow-hidden">
                        {item.type === 'image' ? (
                          <img src={item.images[0]} className="w-full h-full object-cover" alt={item.theme} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-16 h-16 text-[#FF4D8D]" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button 
                            onClick={() => {
                              setStudio(prev => ({
                                ...prev,
                                mode: item.type,
                                generatedImages: item.images,
                                generatedVideo: item.videoUrl || null,
                                currentImageIndex: 0,
                                prompt: item.theme
                              }));
                            }}
                            className="p-4 bg-white rounded-2xl text-[#FF4D8D] hover:scale-110 transition-transform"
                          >
                            <ExternalLink className="w-6 h-6" />
                          </button>
                          <button 
                            onClick={() => deleteHistoryItem(item.id)}
                            className="p-4 bg-red-500 rounded-2xl text-white hover:scale-110 transition-transform"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                      <div className="p-8">
                        <p className="font-black text-xs uppercase tracking-widest text-[#FF4D8D] mb-2">{item.type === 'image' ? 'Pack Photo' : 'Vidéo Pub'}</p>
                        <h4 className="font-bold text-sm text-[#3D1A1F] line-clamp-1 mb-4">{item.theme}</h4>
                        <p className="text-[10px] font-bold text-[#6D4C52]/40 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-16">
              {/* Controls */}
              <div className="lg:col-span-5 space-y-10">
                <div className="flex p-1 bg-[#FFF8F9] rounded-3xl border border-[#FFD1DC]">
                  <button 
                    onClick={() => setStudio(prev => ({ ...prev, mode: 'image' }))}
                    className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${studio.mode === 'image' ? 'bg-[#FF4D8D] text-white shadow-lg' : 'text-[#6D4C52] hover:bg-white'}`}
                  >
                    <Camera className="w-4 h-4" /> Image Studio
                  </button>
                  <button 
                    onClick={() => setStudio(prev => ({ ...prev, mode: 'video' }))}
                    className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${studio.mode === 'video' ? 'bg-[#FF4D8D] text-white shadow-lg' : 'text-[#6D4C52] hover:bg-white'}`}
                  >
                    <Video className="w-4 h-4" /> Video Studio
                  </button>
                </div>

                <div className="space-y-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative h-64 bg-[#FFF8F9] border-4 border-dashed border-[#FFD1DC] rounded-[40px] flex flex-col items-center justify-center cursor-pointer hover:border-[#FF4D8D] transition-all overflow-hidden"
                  >
                    {studio.originalImage ? (
                      <img src={studio.originalImage} className="w-full h-full object-cover" alt="Source" />
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-[#FF4D8D]" />
                        </div>
                        <p className="font-black text-xs uppercase tracking-widest text-[#6D4C52]">Produit de Référence (Optionnel)</p>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between ml-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6D4C52]">Concept Marketing Expert</label>
                      <button onClick={() => setStudio(prev => ({ ...prev, mode: 'prompts' }))} className="text-[10px] font-black uppercase text-[#FF4D8D] hover:underline flex items-center gap-1">
                        <Wand2 className="w-3 h-3" /> Académie Expert
                      </button>
                    </div>
                    <textarea 
                      value={studio.prompt}
                      onChange={(e) => setStudio(prev => ({ ...prev, prompt: e.target.value }))}
                      placeholder={studio.mode === 'image' ? "Ex: Cookies aux pépites de chocolat croustillants sur un plateau en bois..." : "Ex: Travelling lent sur la texture onctueuse..."}
                      className="w-full p-8 bg-[#FFF8F9] border-2 border-[#FFD1DC] rounded-[32px] focus:border-[#FF4D8D] outline-none transition-all min-h-[180px] font-bold text-lg placeholder:text-[#6D4C52]/30"
                    />

                    {/* Quick Templates Preview */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#6D4C52]/40 ml-2">Templates Populaires</p>
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {PROMPT_TEMPLATES.slice(0, 5).map((template, i) => (
                          <button 
                            key={i}
                            onClick={() => setStudio(prev => ({ ...prev, prompt: template.prompt }))}
                            className="flex-shrink-0 w-40 group text-left space-y-2"
                          >
                            <div className="aspect-square rounded-2xl overflow-hidden border border-[#FFD1DC] group-hover:border-[#FF4D8D] transition-colors">
                              <img src={template.image} alt={template.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-tight line-clamp-1 group-hover:text-[#FF4D8D]">{template.title}</p>
                          </button>
                        ))}
                        <button 
                          onClick={() => setStudio(prev => ({ ...prev, mode: 'prompts' }))}
                          className="flex-shrink-0 w-40 aspect-square rounded-2xl border-2 border-dashed border-[#FFD1DC] flex flex-col items-center justify-center gap-2 text-[#FF4D8D] hover:bg-[#FFF8F9] transition-all"
                        >
                          <ArrowRight className="w-6 h-6" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Voir Tout</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={studio.mode === 'image' ? generateImage : generateVideo}
                    disabled={!studio.prompt || studio.isProcessing}
                    className="w-full py-6 bg-[#FF4D8D] text-white rounded-[32px] font-black text-xl shadow-2xl shadow-[#FF4D8D]/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {studio.isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Wand2 className="w-7 h-7" />}
                    {studio.isProcessing ? "Création en cours..." : `Générer ${studio.mode === 'image' ? 'le Pack Photo' : 'la Vidéo'}`}
                  </button>
                  
                  {studio.error && <p className="text-red-500 text-center font-bold text-xs">{studio.error}</p>}
                </div>
              </div>

              {/* Preview Area */}
              <div className="lg:col-span-7">
                <div className="relative min-h-[600px] bg-[#FFF8F9] rounded-[60px] border-2 border-[#FFD1DC] flex items-center justify-center overflow-hidden shadow-inner group">
                  {studio.generatedImages.length > 0 && studio.mode === 'image' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                      <AnimatePresence mode="wait">
                        <motion.img 
                          key={studio.currentImageIndex}
                          initial={{ opacity: 0, scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          src={studio.generatedImages[studio.currentImageIndex]} 
                          className="w-full h-full object-cover" 
                          alt={`Generated ${studio.currentImageIndex}`} 
                        />
                      </AnimatePresence>

                      {/* Carousel Controls */}
                      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                        <button 
                          onClick={() => setStudio(prev => ({ ...prev, currentImageIndex: (prev.currentImageIndex - 1 + prev.generatedImages.length) % prev.generatedImages.length }))}
                          className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl text-[#FF4D8D] pointer-events-auto hover:scale-110 transition-transform disabled:opacity-30"
                        >
                          <ChevronLeft className="w-8 h-8" />
                        </button>
                        <button 
                          onClick={() => setStudio(prev => ({ ...prev, currentImageIndex: (prev.currentImageIndex + 1) % prev.generatedImages.length }))}
                          className="p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl text-[#FF4D8D] pointer-events-auto hover:scale-110 transition-transform"
                        >
                          <ChevronRight className="w-8 h-8" />
                        </button>
                      </div>

                      {/* Image Counter & Actions */}
                      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                          <span className="font-black text-[#FF4D8D]">{studio.currentImageIndex + 1} / {studio.generatedImages.length}</span>
                          <div className="flex gap-1">
                            {studio.generatedImages.map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full ${i === studio.currentImageIndex ? 'bg-[#FF4D8D]' : 'bg-[#FFD1DC]'}`} />
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = studio.generatedImages[studio.currentImageIndex];
                              link.download = `whip-shea-marketing-${studio.currentImageIndex + 1}.png`;
                              link.click();
                            }}
                            className="p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl text-[#FF4D8D] hover:scale-110 transition-transform flex items-center gap-2"
                          >
                            <Download className="w-6 h-6" />
                            <span className="font-black text-xs uppercase tracking-widest hidden md:block">Télécharger</span>
                          </button>
                          <button 
                            onClick={() => {
                              studio.generatedImages.forEach((img, idx) => {
                                const link = document.createElement('a');
                                link.href = img;
                                link.download = `whip-shea-pack-${idx + 1}.png`;
                                link.click();
                              });
                            }}
                            className="p-6 bg-[#FF4D8D] text-white rounded-3xl shadow-xl hover:scale-110 transition-transform flex items-center gap-2"
                          >
                            <Layers className="w-6 h-6" />
                            <span className="font-black text-xs uppercase tracking-widest hidden md:block">Tout Télécharger</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {studio.generatedVideo && studio.mode === 'video' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                      <video src={studio.generatedVideo} controls autoPlay loop className="w-full h-full object-cover" />
                      <a 
                        href={studio.generatedVideo} 
                        target="_blank"
                        className="absolute bottom-8 right-8 p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl text-[#FF4D8D] hover:scale-110 transition-transform"
                      >
                        <Download className="w-8 h-8" />
                      </a>
                    </motion.div>
                  )}

                  {!studio.generatedImages.length && !studio.generatedVideo && !studio.isProcessing && (
                    <div className="text-center p-20 opacity-20">
                      {studio.mode === 'image' ? <ImageIcon className="w-32 h-32 mx-auto mb-8" /> : <Video className="w-32 h-32 mx-auto mb-8" />}
                      <p className="font-black uppercase tracking-[0.3em] text-sm">Prêt pour le rendu marketing</p>
                    </div>
                  )}

                  {studio.isProcessing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-xl flex items-center justify-center z-30">
                      <div className="text-center p-12">
                        <div className="relative w-32 h-32 mx-auto mb-10">
                          <div className="absolute inset-0 border-8 border-[#FFD1DC] rounded-full" />
                          <div className="absolute inset-0 border-8 border-[#FF4D8D] rounded-full border-t-transparent animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-[#FF4D8D] animate-pulse" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-widest text-[#FF4D8D] mb-2">Rendu en cours</h3>
                        <p className="font-bold text-[#6D4C52] mb-6">L'IA sculpte votre visuel marketing...</p>
                        <div className="space-y-2 text-[10px] font-black uppercase tracking-widest text-[#6D4C52]/40">
                          <p>Étape 1: Analyse du concept</p>
                          <p>Étape 2: Composition de la scène</p>
                          <p>Étape 3: Rendu haute fidélité</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Académie de Prompting (Full Page) */}
          {studio.mode === 'prompts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                    ACADÉMIE <span className="text-[#FF4D8D]">INGÉNIERIE</span>
                  </h2>
                  <p className="text-lg font-bold text-[#6D4C52] uppercase tracking-widest">Devenez un maître du prompt marketing</p>
                </div>
                <div className="bg-[#3D1A1F] text-white p-8 rounded-[40px] flex items-center gap-6 shadow-2xl">
                  <div className="w-16 h-16 bg-[#FF4D8D] rounded-2xl flex items-center justify-center">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Score d'Expertise</p>
                    <p className="text-4xl font-black">{studio.progressPoints} <span className="text-[#FF4D8D] text-lg">PTS</span></p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-4 bg-[#FFF8F9] border border-[#FFD1DC] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((studio.progressPoints / 500) * 100, 100)}%` }}
                  className="h-full bg-gradient-to-r from-[#FF4D8D] to-[#FF85B3]"
                />
              </div>

              <div className="grid lg:grid-cols-3 gap-12">
                {/* Theory Section */}
                <div className="lg:col-span-2 space-y-12">
                  <div className="flex items-center gap-4 mb-8">
                    <BookOpen className="w-8 h-8 text-[#FF4D8D]" />
                    <h3 className="text-2xl font-black uppercase tracking-tight">Cours Théoriques</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {PROMPT_GUIDE.map((guide) => (
                      <div key={guide.id} className="group p-8 bg-white rounded-[40px] border-2 border-[#FFD1DC] hover:border-[#FF4D8D] transition-all space-y-6 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FFF8F9] rounded-full group-hover:scale-150 transition-transform opacity-50" />
                        <div className="relative z-10">
                          <h4 className="font-black text-lg uppercase tracking-tight text-[#FF4D8D] mb-2">{guide.title}</h4>
                          <p className="text-sm font-bold text-[#6D4C52] mb-4">{guide.content}</p>
                          <p className="text-xs text-[#6D4C52]/60 leading-relaxed mb-6">{guide.details}</p>
                          <div className="p-6 bg-[#FFF8F9] rounded-2xl border border-[#FFD1DC]/50 italic text-xs text-[#6D4C52]/80">
                            " {guide.example} "
                          </div>
                          <button 
                            onClick={() => completeExercise(guide.id, guide.points)}
                            disabled={studio.completedExercises.includes(guide.id)}
                            className={`mt-6 w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                              studio.completedExercises.includes(guide.id) 
                              ? 'bg-emerald-50 text-emerald-500' 
                              : 'bg-[#FF4D8D] text-white hover:scale-105'
                            }`}
                          >
                            {studio.completedExercises.includes(guide.id) ? <Check className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                            {studio.completedExercises.includes(guide.id) ? 'Maîtrisé' : `Valider (+${guide.points} pts)`}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exercises Section */}
                <div className="space-y-12">
                  <div className="flex items-center gap-4 mb-8">
                    <Target className="w-8 h-8 text-[#FF4D8D]" />
                    <h3 className="text-2xl font-black uppercase tracking-tight">Entraînements</h3>
                  </div>
                  <div className="space-y-6">
                    {PROMPT_EXERCISES.map((ex) => (
                      <div key={ex.id} className="p-8 bg-[#3D1A1F] text-white rounded-[40px] border border-white/10 space-y-4 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                          <Zap className="w-12 h-12" />
                        </div>
                        <h4 className="font-black text-sm uppercase tracking-widest text-[#FF4D8D]">{ex.title}</h4>
                        <p className="text-xs leading-relaxed opacity-80">{ex.task}</p>
                        <div className="p-4 bg-white/5 rounded-2xl text-[10px] font-medium italic text-[#FFD1DC]">
                          Astuce : {ex.hint}
                        </div>
                        <button 
                          onClick={() => {
                            setStudio(prev => ({ ...prev, mode: 'image', prompt: '' }));
                            // Scroll to top
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="w-full py-4 bg-white text-[#3D1A1F] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#FF4D8D] hover:text-white transition-all"
                        >
                          Lancer l'Exercice
                        </button>
                        {!studio.completedExercises.includes(ex.id) && (
                          <button 
                            onClick={() => completeExercise(ex.id, ex.targetPoints)}
                            className="mt-2 w-full py-2 border border-white/20 rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-white/10 transition-all"
                          >
                            Marquer comme Terminé (+{ex.targetPoints} pts)
                          </button>
                        )}
                        {studio.completedExercises.includes(ex.id) && (
                          <div className="absolute inset-0 bg-emerald-500/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                            <CheckCircle2 className="w-12 h-12 mb-2" />
                            <p className="font-black uppercase tracking-widest">Exercice Terminé</p>
                            <p className="text-[10px] opacity-80">+{ex.targetPoints} points gagnés</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-12 bg-gradient-to-br from-[#FF4D8D] to-[#FF85B3] text-white rounded-[60px] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Prêt à tester vos compétences ?</h3>
                  <p className="font-bold opacity-90">Utilisez vos connaissances pour créer le visuel parfait.</p>
                </div>
                <button 
                  onClick={() => setStudio(prev => ({ ...prev, mode: 'image' }))}
                  className="px-12 py-6 bg-white text-[#FF4D8D] rounded-[32px] font-black text-lg uppercase tracking-widest hover:scale-110 transition-transform shadow-xl"
                >
                  Retour au Studio
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Showcase */}
      <section id="showcase" className="py-32 px-6 bg-[#FFF8F9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase">PORTFOLIO <span className="text-[#FF4D8D]">CRÉATIF</span></h2>
            <p className="text-lg font-bold text-[#6D4C52] uppercase tracking-widest mb-8">Exemples de rendus publicitaires gourmands</p>
            <div className="w-24 h-2 bg-[#FF4D8D] mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { img: "https://picsum.photos/seed/whip-strawberry/800/800", label: "Nuage de Fraise", desc: "Rose poudré & Fraises fraîches", color: "from-[#FF4D8D]/60" },
              { img: "https://picsum.photos/seed/whip-mango/800/800", label: "Délice de Mangue", desc: "Jaune onctueux & Éclat solaire", color: "from-[#FFB347]/60" },
              { img: "https://picsum.photos/seed/whip-blueberry/800/800", label: "Douceur Myrtille", desc: "Violet velouté & Fruits des bois", color: "from-[#A18CD1]/60" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15, scale: 1.02 }}
                className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl border-[12px] border-white group cursor-pointer"
              >
                <img src={item.img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={item.label} referrerPolicy="no-referrer" />
                <div className={`absolute inset-0 bg-gradient-to-t ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-12`}>
                  <p className="text-white font-black text-3xl uppercase tracking-tighter leading-none mb-2">{item.label}</p>
                  <p className="text-white/90 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">{item.desc}</p>
                  <div className="flex items-center gap-2 text-white/60 text-[8px] font-black uppercase tracking-widest">
                    <Star className="w-2 h-2 fill-current" />
                    Rendu Studio Premium
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3D1A1F] text-white pt-32 pb-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-20 mb-24">
            <div className="col-span-2">
              <Logo className="mb-10 brightness-0 invert" />
              <p className="text-[#FFD1DC]/60 max-w-md text-lg leading-relaxed font-medium">
                Studio Whip & Shea est votre partenaire marketing pour sublimer vos cosmétiques. Nous générons des visuels de vente haute performance grâce à l'IA.
              </p>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-10 text-[#FF4D8D]">Studio</h4>
              <ul className="space-y-6 font-bold text-sm">
                <li><a href="#studio" className="hover:text-[#FF4D8D] transition-colors">Image Lab</a></li>
                <li><a href="#studio" className="hover:text-[#FF4D8D] transition-colors">Video Lab</a></li>
                <li><a href="#showcase" className="hover:text-[#FF4D8D] transition-colors">Showcase</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-10 text-[#FF4D8D]">Contact</h4>
              <ul className="space-y-6 font-bold text-sm text-[#FFD1DC]/60">
                <li>studio@whipshea.ai</li>
                <li>@studiowhipshea</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD1DC]/40">
            <p>© 2026 STUDIO WHIP & SHEA. CRÉÉ PAR B.MAAYOUD. TOUS DROITS RÉSERVÉS.</p>
            <p className="text-center md:text-right">Contact : lebm940@gmail.com | Usage interdit sans accord préalable. Modification et abus strictement prohibés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

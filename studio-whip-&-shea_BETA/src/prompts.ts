export interface PromptTemplate {
  title: string;
  category: string;
  prompt: string;
  image: string;
}

export const CATEGORIES = [
  "Cookies Gourmet",
  "Cosmétique de Luxe",
  "Boissons & Cocktails",
  "Gastronomie & Plats",
  "Technologie & Gadgets",
  "Mode & Accessoires",
  "Lifestyle & Ambiance",
  "Saisonnier (Noël, Été)",
  "Minimaliste & Abstrait"
];

export const ALL_PROMPTS: PromptTemplate[] = [
  // --- COOKIES GOURMET ---
  {
    title: "L'Explosion de Pépites",
    category: "Cookies Gourmet",
    prompt: "Photographie haute vitesse d'un cookie artisanal épais, capturé au moment où il se brise en deux, révélant un cœur fondant. Une explosion dynamique de pépites de chocolat noir et de fleur de sel entoure le biscuit. Éclairage de studio ultra-net, fond en bois sombre texturé, rendu 8k hyper-réaliste.",
    image: "https://picsum.photos/seed/cookie-1/800/800"
  },
  {
    title: "Le Cookie 'Cloud' Moelleux",
    category: "Cookies Gourmet",
    prompt: "Un cookie extrêmement épais et moelleux, texture 'cakey', parsemé de grosses pépites de chocolat blanc. Posé sur un nuage de farine légère, lumière matinale douce, tons pastels et crème, ambiance cocooning et douce, rendu ultra-détaillé.",
    image: "https://picsum.photos/seed/cookie-2/800/800"
  },
  {
    title: "Rêve de Pistache",
    category: "Cookies Gourmet",
    prompt: "Cookie vert vibrant au thé matcha et éclats de pistaches grillées. Un filet de crème de pistache onctueuse coule sur le dessus. Éclairage zénithale doux, fond en pierre naturelle, esthétique zen et gourmande, macro 85mm.",
    image: "https://picsum.photos/seed/cookie-3/800/800"
  },
  {
    title: "S'mores de Luxe",
    category: "Cookies Gourmet",
    prompt: "Cookie géant surmonté d'une guimauve grillée parfaitement dorée et d'un carré de chocolat fondu. Texture croustillante et collante, lumière de feu de camp chaleureuse, bokeh artistique en arrière-plan, rendu cinématographique.",
    image: "https://picsum.photos/seed/cookie-4/800/800"
  },
  {
    title: "Le 'Red Velvet' Suprême",
    category: "Cookies Gourmet",
    prompt: "Cookie rouge velours profond avec un glaçage au cream cheese blanc pur. Contraste de couleurs saisissant, texture veloutée, posé sur une assiette en porcelaine noire, éclairage dramatique, style éditorial food.",
    image: "https://picsum.photos/seed/cookie-5/800/800"
  },
  {
    title: "Double Chocolat & Or",
    category: "Cookies Gourmet",
    prompt: "Cookie tout chocolat noir intense, décoré de feuilles d'or comestibles. Texture riche et dense, éclairage luxueux avec des reflets dorés, fond en velours noir, ambiance prestigieuse et décadente.",
    image: "https://picsum.photos/seed/cookie-6/800/800"
  },
  {
    title: "Caramel Beurre Salé Coulant",
    category: "Cookies Gourmet",
    prompt: "Cookie aux noix de pécan avec un dôme de caramel au beurre salé qui s'affaisse et coule sur les côtés. Texture brillante et visqueuse, lumière chaude directionnelle, chaque grain de sel est visible, rendu ultra-appétissant.",
    image: "https://picsum.photos/seed/cookie-7/800/800"
  },
  {
    title: "Le Cookie 'Galaxy'",
    category: "Cookies Gourmet",
    prompt: "Cookie artistique avec un glaçage miroir aux teintes galactiques (bleu, violet, rose). Poussière d'étoiles en sucre argenté, posé sur une surface en verre noir, éclairage néon subtil, look futuriste et créatif.",
    image: "https://picsum.photos/seed/cookie-8/800/800"
  },

  // --- COSMÉTIQUE DE LUXE ---
  {
    title: "Sérum 'Éclat de Diamant'",
    category: "Cosmétique de Luxe",
    prompt: "Flacon de sérum en verre cristallin posé sur un socle de quartz brut. Des rayons de lumière traversent le flacon créant des prismes colorés. Atmosphère pure, éthérée, tons blancs et argentés, rendu Octane ultra-précis.",
    image: "https://picsum.photos/seed/cosmo-1/800/800"
  },
  {
    title: "Crème Karité 'Silk'",
    category: "Cosmétique de Luxe",
    prompt: "Un pot de crème Whip & Shea ouvert, la texture est lissée par une spatule en or rose. Des vagues de soie blanche entourent le produit. Éclairage doux et diffus, ambiance boudoir de luxe, rendu hyper-réaliste.",
    image: "https://picsum.photos/seed/cosmo-2/800/800"
  },
  {
    title: "L'Essence Botanique",
    category: "Cosmétique de Luxe",
    prompt: "Produit cosmétique entouré de fleurs de karité et de feuilles vertes fraîches avec des gouttes de rosée. Éclairage naturel de sous-bois, fraîcheur organique, pureté, style herboristerie de luxe.",
    image: "https://picsum.photos/seed/cosmo-3/800/800"
  },
  {
    title: "Masque 'Or Noir'",
    category: "Cosmétique de Luxe",
    prompt: "Texture de masque noir charbon brillant avec des particules d'or. Un pinceau professionnel applique la matière sur une surface en marbre noir. Éclairage dramatique, contrastes forts, esthétique spa haut de gamme.",
    image: "https://picsum.photos/seed/cosmo-4/800/800"
  },
  {
    title: "Brume de Fraîcheur",
    category: "Cosmétique de Luxe",
    prompt: "Capture d'un spray cosmétique en plein action, créant un nuage de micro-gouttelettes irisées. Le flacon est en aluminium brossé, fond bleu azur dégradé, sensation de fraîcheur instantanée, rendu haute vitesse.",
    image: "https://picsum.photos/seed/cosmo-5/800/800"
  },
  {
    title: "Le Rouge à Lèvres 'Sculpture'",
    category: "Cosmétique de Luxe",
    prompt: "Rouge à lèvres rouge profond sculpté comme une œuvre d'art, posé sur un piédestal en travertin. Éclairage de défilé de mode, ombres nettes, élégance intemporelle, rendu 8k.",
    image: "https://picsum.photos/seed/cosmo-6/800/800"
  },
  {
    title: "Huile Solaire Scintillante",
    category: "Cosmétique de Luxe",
    prompt: "Flacon d'huile corporelle avec des paillettes dorées en suspension, posé sur du sable blanc fin. Reflets du soleil couchant sur le verre, ambiance vacances de luxe, peau dorée suggérée en arrière-plan flou.",
    image: "https://picsum.photos/seed/cosmo-7/800/800"
  },

  // --- BOISSONS & COCKTAILS ---
  {
    title: "Le Splash de Citron",
    category: "Boissons & Cocktails",
    prompt: "Un verre de limonade fraîche avec des glaçons, une tranche de citron tombe dedans créant un splash dynamique et sculptural. Gouttelettes d'eau partout, éclairage d'été vif, fond jaune ensoleillé, rendu ultra-réaliste.",
    image: "https://picsum.photos/seed/drink-1/800/800"
  },
  {
    title: "Café Glacé 'Marble'",
    category: "Boissons & Cocktails",
    prompt: "Gros plan sur un verre de café glacé où le lait se mélange au café en créant des volutes artistiques. Gouttes de condensation sur le verre, paille en inox, lumière de café branché, tons bruns et crème.",
    image: "https://picsum.photos/seed/drink-2/800/800"
  },
  {
    title: "Cocktail 'Neon Night'",
    category: "Boissons & Cocktails",
    prompt: "Un cocktail coloré (bleu et rose) avec une fumée de glace sèche s'échappant du verre. Éclairage néon de bar cyberpunk, reflets sur le comptoir humide, ambiance nocturne et électrique.",
    image: "https://picsum.photos/seed/drink-3/800/800"
  },
  {
    title: "Vin Rouge 'Velvet'",
    category: "Boissons & Cocktails",
    prompt: "Vin rouge versé dans un verre en cristal, capturé en mouvement. La robe du vin est sombre et riche, éclairage de cave à vin tamisé, fond en pierre, élégance et tradition.",
    image: "https://picsum.photos/seed/drink-4/800/800"
  },
  {
    title: "Smoothie 'Berry Blast'",
    category: "Boissons & Cocktails",
    prompt: "Smoothie aux fruits rouges dans un bocal en verre, surmonté de baies fraîches et de menthe. Texture épaisse et vibrante, lumière naturelle de jardin, style healthy et frais.",
    image: "https://picsum.photos/seed/drink-5/800/800"
  },

  // --- GASTRONOMIE & PLATS ---
  {
    title: "Burger 'Gourmet Stack'",
    category: "Gastronomie & Plats",
    prompt: "Un burger de luxe avec plusieurs couches : fromage fondant, bacon croustillant, oignons caramélisés. Le pain est brillant et parsemé de sésame. Éclairage de studio 'food porn', fond sombre, rendu ultra-appétissant.",
    image: "https://picsum.photos/seed/food-1/800/800"
  },
  {
    title: "Pasta 'Al Dente' Splash",
    category: "Gastronomie & Plats",
    prompt: "Pâtes fraîches sautées dans une poêle avec de la sauce tomate vibrante et du basilic. Explosion de sauce et de parmesan râpé, mouvement dynamique, éclairage de cuisine professionnelle, rendu haute vitesse.",
    image: "https://picsum.photos/seed/food-2/800/800"
  },
  {
    title: "Sushi 'Zen Master'",
    category: "Gastronomie & Plats",
    prompt: "Plateau de sushis variés posé sur une planche en bois noir. Décoration minimaliste avec du gingembre et du wasabi. Éclairage doux, esthétique japonaise pure, focus sur la texture du poisson frais.",
    image: "https://picsum.photos/seed/food-3/800/800"
  },
  {
    title: "Steak 'Sizzling'",
    category: "Gastronomie & Plats",
    prompt: "Un steak de bœuf parfaitement grillé avec des marques de grill, une noisette de beurre aux herbes fond dessus. Vapeur s'échappant de la viande, éclairage chaud et rustique, rendu 8k.",
    image: "https://picsum.photos/seed/food-4/800/800"
  },

  // --- TECHNOLOGIE & GADGETS ---
  {
    title: "Smartphone 'Infinity'",
    category: "Technologie & Gadgets",
    prompt: "Smartphone futuriste sans bordures, écran affichant une nébuleuse colorée. Corps en titane poli, posé sur une surface miroir, éclairage de présentation Apple-style, minimalisme technologique.",
    image: "https://picsum.photos/seed/tech-1/800/800"
  },
  {
    title: "Casque Audio 'Studio'",
    category: "Technologie & Gadgets",
    prompt: "Casque audio haut de gamme flottant dans les airs, entouré d'ondes sonores visuelles stylisées. Finition cuir et métal, éclairage studio pro, fond gris neutre, rendu Octane.",
    image: "https://picsum.photos/seed/tech-2/800/800"
  },
  {
    title: "Montre Connectée 'Sport'",
    category: "Technologie & Gadgets",
    prompt: "Smartwatch robuste avec des éclaboussures d'eau et de boue, suggérant l'aventure. Éclairage extérieur dynamique, focus sur l'écran lumineux, style publicitaire sport extrême.",
    image: "https://picsum.photos/seed/tech-3/800/800"
  },

  // --- MODE & ACCESSOIRES ---
  {
    title: "Sac à Main 'Vogue'",
    category: "Mode & Accessoires",
    prompt: "Sac à main en cuir de luxe posé sur un fauteuil design. Éclairage éditorial mode, tons neutres et sophistiqués, texture du cuir visible, ambiance appartement parisien.",
    image: "https://picsum.photos/seed/fashion-1/800/800"
  },
  {
    title: "Sneakers 'Streetwear'",
    category: "Mode & Accessoires",
    prompt: "Paire de baskets tendance posée sur du béton avec des graffitis en arrière-plan flou. Éclairage urbain dramatique, contrastes élevés, style publicité Nike/Adidas.",
    image: "https://picsum.photos/seed/fashion-2/800/800"
  },
  {
    title: "Lunettes de Soleil 'Summer'",
    category: "Mode & Accessoires",
    prompt: "Lunettes de soleil posées au bord d'une piscine turquoise. Reflets de palmiers sur les verres, lumière d'été intense, ambiance jet-set et luxe.",
    image: "https://picsum.photos/seed/fashion-3/800/800"
  },

  // --- LIFESTYLE & AMBIANCE ---
  {
    title: "Bougie 'Hygge'",
    category: "Lifestyle & Ambiance",
    prompt: "Bougie parfumée allumée dans un intérieur chaleureux avec des plaids et des livres. Lumière de flamme douce, ambiance relaxante et parfumée, rendu hyper-réaliste.",
    image: "https://picsum.photos/seed/life-1/800/800"
  },
  {
    title: "Espace de Travail 'Minimal'",
    category: "Lifestyle & Ambiance",
    prompt: "Bureau propre avec un laptop, une plante verte et une tasse de café. Lumière naturelle de fenêtre, esthétique minimaliste et productive, tons clairs.",
    image: "https://picsum.photos/seed/life-2/800/800"
  },

  // --- SAISONNIER ---
  {
    title: "Magie de Noël",
    category: "Saisonnier (Noël, Été)",
    prompt: "Produit emballé dans un papier cadeau luxueux sous un sapin illuminé. Bokeh de lumières de Noël, ambiance magique et festive, tons rouges et or.",
    image: "https://picsum.photos/seed/season-1/800/800"
  },
  {
    title: "Fraîcheur d'Été",
    category: "Saisonnier (Noël, Été)",
    prompt: "Produit posé sur une bouée colorée dans une mer bleue. Soleil éclatant, ciel sans nuages, sensation de vacances et de liberté.",
    image: "https://picsum.photos/seed/season-2/800/800"
  },

  // --- MINIMALISTE & ABSTRAIT ---
  {
    title: "Formes Géométriques",
    category: "Minimaliste & Abstrait",
    prompt: "Composition abstraite de sphères et de cubes en matériaux variés (verre, métal, pierre). Éclairage architectural, minimalisme radical, rendu de haute précision.",
    image: "https://picsum.photos/seed/abs-1/800/800"
  },
  {
    title: "Texture de Sable",
    category: "Minimaliste & Abstrait",
    prompt: "Dunes de sable parfaitement sculptées par le vent, ombres longues et graphiques. Esthétique désertique pure, tons ocres et dorés, rendu 8k.",
    image: "https://picsum.photos/seed/abs-2/800/800"
  },
  // --- ADDITIONAL PROMPTS ---
  {
    title: "Cookie 'Triple Berry' Cheesecake",
    category: "Cookies Gourmet",
    prompt: "Un cookie épais fourré au cheesecake, surmonté d'un coulis de framboise, myrtille et fraise. Texture crémeuse et fruitée, lumière de studio douce, fond blanc pur, rendu ultra-appétissant.",
    image: "https://picsum.photos/seed/cookie-9/800/800"
  },
  {
    title: "L'Éclat de Karité 'Or Pur'",
    category: "Cosmétique de Luxe",
    prompt: "Beurre de karité brut dans un bol en or martelé. Éclairage chaud et luxueux, reflets métalliques, texture riche et granuleuse, ambiance spa royal.",
    image: "https://picsum.photos/seed/cosmo-8/800/800"
  },
  {
    title: "Gin Tonic 'Botanical'",
    category: "Boissons & Cocktails",
    prompt: "Verre de gin tonic avec des baies de genièvre, du concombre et des fleurs de sureau. Bulles de gaz carbonique nettes, condensation givrée sur le verre, lumière de jardin au crépuscule.",
    image: "https://picsum.photos/seed/drink-6/800/800"
  },
  {
    title: "Pizza 'Artisanal Fire'",
    category: "Gastronomie & Plats",
    prompt: "Pizza cuite au feu de bois avec de la mozzarella di bufala fondante et du basilic frais. Bordure de pâte gonflée et léopardée, lumière de four à bois chaude, rendu 8k.",
    image: "https://picsum.photos/seed/food-5/800/800"
  },
  {
    title: "Drone 'Explorer'",
    category: "Technologie & Gadgets",
    prompt: "Drone de photographie professionnel en vol au-dessus d'une falaise escarpée. Design aérodynamique, éclairage de coucher de soleil, sensation de liberté et de technologie.",
    image: "https://picsum.photos/seed/tech-4/800/800"
  },
  {
    title: "Montre de Luxe 'Chronographe'",
    category: "Mode & Accessoires",
    prompt: "Gros plan sur le cadran d'une montre chronographe suisse. Détails mécaniques complexes, verre saphir avec reflets bleutés, bracelet en cuir d'alligator, éclairage de précision.",
    image: "https://picsum.photos/seed/fashion-4/800/800"
  },
  {
    title: "Intérieur 'Japandi'",
    category: "Lifestyle & Ambiance",
    prompt: "Salon minimaliste mélangeant styles japonais et scandinave. Bois clair, plantes vertes, lumière naturelle abondante, sérénité absolue.",
    image: "https://picsum.photos/seed/life-3/800/800"
  },
  {
    title: "Plage 'Tropical Paradise'",
    category: "Saisonnier (Noël, Été)",
    prompt: "Une chaise longue sous un parasol en paille sur une plage de sable blanc. Eau turquoise cristalline, ciel bleu azur, ambiance vacances de rêve.",
    image: "https://picsum.photos/seed/season-3/800/800"
  },
  {
    title: "Vagues de Liquide 'Chrome'",
    category: "Minimaliste & Abstrait",
    prompt: "Vagues de métal liquide chromé en mouvement. Reflets miroir parfaits, éclairage studio froid, esthétique futuriste et fluide.",
    image: "https://picsum.photos/seed/abs-3/800/800"
  },
  {
    title: "Cookie 'S'mores' Géant",
    category: "Cookies Gourmet",
    prompt: "Cookie géant avec des morceaux de chocolat Hershey's et des guimauves fondues étirables. Texture collante et grillée, lumière de feu de camp, rendu ultra-gourmand.",
    image: "https://picsum.photos/seed/cookie-10/800/800"
  },
  {
    title: "Parfum 'Essence Nocturne'",
    category: "Cosmétique de Luxe",
    prompt: "Flacon de parfum en verre noir profond avec des accents dorés. Posé sur un miroir noir, fumée mystérieuse en arrière-plan, éclairage dramatique.",
    image: "https://picsum.photos/seed/cosmo-9/800/800"
  },
  {
    title: "Thé Glacé 'Peach & Mint'",
    category: "Boissons & Cocktails",
    prompt: "Grand verre de thé glacé à la pêche avec beaucoup de glace et de menthe fraîche. Tranches de pêche flottantes, lumière d'après-midi dorée, fraîcheur intense.",
    image: "https://picsum.photos/seed/drink-7/800/800"
  },
  {
    title: "Ramen 'Authentic Ichiraku'",
    category: "Gastronomie & Plats",
    prompt: "Bol de ramen fumant avec œuf mollet, porc chashu et nori. Bouillon riche et brillant, baguettes soulevant des nouilles, éclairage de restaurant japonais traditionnel.",
    image: "https://picsum.photos/seed/food-6/800/800"
  },
  {
    title: "Clavier Mécanique 'RGB'",
    category: "Technologie & Gadgets",
    prompt: "Clavier mécanique personnalisé avec éclairage RGB multicolore. Keycaps transparents, ambiance gaming nocturne, focus sur les reflets lumineux.",
    image: "https://picsum.photos/seed/tech-5/800/800"
  },
  {
    title: "Escarpins 'Red Sole'",
    category: "Mode & Accessoires",
    prompt: "Paire de talons hauts vernis noirs avec semelle rouge iconique. Posés sur un tapis de velours rouge, éclairage de boutique de luxe, élégance fatale.",
    image: "https://picsum.photos/seed/fashion-5/800/800"
  },
  {
    title: "Bibliothèque 'Old World'",
    category: "Lifestyle & Ambiance",
    prompt: "Bibliothèque ancienne avec des milliers de livres reliés en cuir. Échelle en bois, lumière de lampe de bureau chaude, odeur de vieux papier suggérée.",
    image: "https://picsum.photos/seed/life-4/800/800"
  },
  {
    title: "Feu d'Artifice 'New Year'",
    category: "Saisonnier (Noël, Été)",
    prompt: "Explosion de feux d'artifice multicolores au-dessus d'une skyline de ville moderne. Reflets sur l'eau, célébration et joie, rendu haute vitesse.",
    image: "https://picsum.photos/seed/season-4/800/800"
  },
  {
    title: "Cristaux de Glace 'Macro'",
    category: "Minimaliste & Abstrait",
    prompt: "Gros plan extrême sur des cristaux de glace se formant sur une vitre. Structures géométriques naturelles, lumière bleue froide, pureté hivernale.",
    image: "https://picsum.photos/seed/abs-4/800/800"
  }
];

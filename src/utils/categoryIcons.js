import React from 'react';
import { 
  Wheat, 
  Wine, 
  Coffee, 
  Cookie, 
  Sparkles, 
  Droplet, 
  Utensils, 
  Milk, 
  Fish, 
  Flame, 
  Apple, 
  ShieldCheck, 
  PackageCheck, 
  Baby, 
  HeartHandshake, 
  ShoppingBag,
  Sparkle
} from 'lucide-react';

export const CATEGORY_CONFIG = {
  "Riz & Céréales": {
    icon: Wheat,
    color: "bg-amber-100 text-amber-800 border-amber-200",
    gradient: "from-amber-500 to-amber-700",
    badge: "Riz & Céréales"
  },
  "Boissons & Eaux": {
    icon: Droplet,
    color: "bg-sky-100 text-sky-800 border-sky-200",
    gradient: "from-sky-500 to-blue-700",
    badge: "Boissons"
  },
  "Boissons Alcoolisées": {
    icon: Wine,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    gradient: "from-purple-600 to-indigo-800",
    badge: "Alcools"
  },
  "Produits Laitiers & Lait Infantile": {
    icon: Milk,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    gradient: "from-blue-400 to-sky-600",
    badge: "Laitiers"
  },
  "Confiseries/Biscuits/Chocolats": {
    icon: Cookie,
    color: "bg-pink-100 text-pink-800 border-pink-200",
    gradient: "from-pink-500 to-rose-600",
    badge: "Douceurs"
  },
  "Épices & Assaisonnements": {
    icon: Flame,
    color: "bg-orange-100 text-orange-800 border-orange-200",
    gradient: "from-orange-500 to-red-600",
    badge: "Épices"
  },
  "Sauces & Condiments": {
    icon: Utensils,
    color: "bg-red-100 text-red-800 border-red-200",
    gradient: "from-red-500 to-amber-600",
    badge: "Sauces"
  },
  "Huiles & Matières Grasses": {
    icon: Droplet,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    gradient: "from-yellow-500 to-amber-600",
    badge: "Huiles"
  },
  "Conserves & Légumes": {
    icon: Apple,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    gradient: "from-emerald-500 to-teal-700",
    badge: "Conserves"
  },
  "Poissons/Conserves de Poisson & Fruits de Mer": {
    icon: Fish,
    color: "bg-cyan-100 text-cyan-800 border-cyan-200",
    gradient: "from-cyan-500 to-blue-600",
    badge: "Poissons"
  },
  "Café/Thé & Petit-Déjeuner": {
    icon: Coffee,
    color: "bg-amber-100 text-amber-900 border-amber-300",
    gradient: "from-amber-700 to-amber-900",
    badge: "Petit-Déjeuner"
  },
  "Sucreries & Levure": {
    icon: Sparkle,
    color: "bg-rose-100 text-rose-800 border-rose-200",
    gradient: "from-rose-400 to-pink-600",
    badge: "Sucreries"
  },
  "Entretien & Hygiène Maison": {
    icon: Sparkles,
    color: "bg-teal-100 text-teal-800 border-teal-200",
    gradient: "from-teal-500 to-emerald-700",
    badge: "Entretien"
  },
  "Hygiène Bébé & Féminine": {
    icon: Baby,
    color: "bg-violet-100 text-violet-800 border-violet-200",
    gradient: "from-violet-500 to-purple-600",
    badge: "Bébé & Féminin"
  },
  "Hygiène Corporelle": {
    icon: HeartHandshake,
    color: "bg-indigo-100 text-indigo-800 border-indigo-200",
    gradient: "from-indigo-500 to-blue-700",
    badge: "Soins"
  },
  "Papier & Jetables": {
    icon: PackageCheck,
    color: "bg-slate-100 text-slate-800 border-slate-200",
    gradient: "from-slate-500 to-slate-700",
    badge: "Jetables"
  },
  "Pâtes Alimentaires": {
    icon: Utensils,
    color: "bg-yellow-100 text-amber-800 border-yellow-300",
    gradient: "from-amber-400 to-yellow-600",
    badge: "Pâtes"
  },
  "Divers & Accessoires": {
    icon: ShoppingBag,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    gradient: "from-gray-500 to-gray-700",
    badge: "Divers"
  },
  "Épicerie Générale": {
    icon: ShieldCheck,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    gradient: "from-emerald-600 to-green-800",
    badge: "Épicerie"
  }
};

export function getCategoryStyle(categoryName) {
  if (!categoryName) {
    return {
      icon: ShoppingBag,
      color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      gradient: "from-emerald-600 to-green-800",
      badge: "Article"
    };
  }

  // Exact match
  if (CATEGORY_CONFIG[categoryName]) {
    return CATEGORY_CONFIG[categoryName];
  }

  const lower = categoryName.toLowerCase();

  // Smart matching based on keywords
  if (lower.includes('savon') || lower.includes('entretien') || lower.includes('lessive') || lower.includes('javel') || lower.includes('propreté')) {
    return {
      icon: Sparkles,
      color: "bg-teal-100 text-teal-800 border-teal-200",
      gradient: "from-teal-500 to-emerald-700",
      badge: categoryName
    };
  }
  if (lower.includes('aliment') || lower.includes('nourriture') || lower.includes('biscuit') || lower.includes('chocolat') || lower.includes('snack')) {
    return {
      icon: Cookie,
      color: "bg-pink-100 text-pink-800 border-pink-200",
      gradient: "from-pink-500 to-rose-600",
      badge: categoryName
    };
  }
  if (lower.includes('riz') || lower.includes('céréal') || lower.includes('farine') || lower.includes('semoule') || lower.includes('grain')) {
    return {
      icon: Wheat,
      color: "bg-amber-100 text-amber-800 border-amber-200",
      gradient: "from-amber-500 to-amber-700",
      badge: categoryName
    };
  }
  if (lower.includes('boisson') || lower.includes('eau') || lower.includes('jus') || lower.includes('soda')) {
    return {
      icon: Droplet,
      color: "bg-sky-100 text-sky-800 border-sky-200",
      gradient: "from-sky-500 to-blue-700",
      badge: categoryName
    };
  }
  if (lower.includes('alcool') || lower.includes('vin') || lower.includes('bière') || lower.includes('biere') || lower.includes('liqueur')) {
    return {
      icon: Wine,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      gradient: "from-purple-600 to-indigo-800",
      badge: categoryName
    };
  }
  if (lower.includes('lait') || lower.includes('fromage') || lower.includes('yaourt') || lower.includes('beurre')) {
    return {
      icon: Milk,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      gradient: "from-blue-400 to-sky-600",
      badge: categoryName
    };
  }
  if (lower.includes('huile') || lower.includes('graisse') || lower.includes('margarine')) {
    return {
      icon: Droplet,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      gradient: "from-yellow-500 to-amber-600",
      badge: categoryName
    };
  }
  if (lower.includes('poisson') || lower.includes('sardine') || lower.includes('thon') || lower.includes('mer')) {
    return {
      icon: Fish,
      color: "bg-cyan-100 text-cyan-800 border-cyan-200",
      gradient: "from-cyan-500 to-blue-600",
      badge: categoryName
    };
  }
  if (lower.includes('épice') || lower.includes('epice') || lower.includes('assaison') || lower.includes('piment') || lower.includes('poivre')) {
    return {
      icon: Flame,
      color: "bg-orange-100 text-orange-800 border-orange-200",
      gradient: "from-orange-500 to-red-600",
      badge: categoryName
    };
  }
  if (lower.includes('sauce') || lower.includes('condiment') || lower.includes('mayo') || lower.includes('ketchup')) {
    return {
      icon: Utensils,
      color: "bg-red-100 text-red-800 border-red-200",
      gradient: "from-red-500 to-amber-600",
      badge: categoryName
    };
  }
  if (lower.includes('hygiène') || lower.includes('hygiene') || lower.includes('beauté') || lower.includes('beaute') || lower.includes('corps') || lower.includes('cheveu') || lower.includes('dent')) {
    return {
      icon: HeartHandshake,
      color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      gradient: "from-indigo-500 to-blue-700",
      badge: categoryName
    };
  }
  if (lower.includes('bébé') || lower.includes('bebe') || lower.includes('enfant') || lower.includes('couche')) {
    return {
      icon: Baby,
      color: "bg-violet-100 text-violet-800 border-violet-200",
      gradient: "from-violet-500 to-purple-600",
      badge: categoryName
    };
  }
  if (lower.includes('pâte') || lower.includes('pate') || lower.includes('spaghetti') || lower.includes('macaroni')) {
    return {
      icon: Utensils,
      color: "bg-yellow-100 text-amber-800 border-yellow-300",
      gradient: "from-amber-400 to-yellow-600",
      badge: categoryName
    };
  }

  // Fallback: use actual categoryName as badge
  return {
    icon: ShoppingBag,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    gradient: "from-emerald-600 to-green-800",
    badge: categoryName
  };
}

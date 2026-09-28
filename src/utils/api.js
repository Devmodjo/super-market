import axios from 'axios';

// Base URL configuration for ERP API
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // Default production URL or local development fallback
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://127.0.0.1:8000';
  }
  return 'https://erp.super-market.pro';
};

export const API_BASE_URL = getBaseUrl();

// Axios Instance configured for cross-origin session authentication & CSRF protection
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Interceptor to extract X-CSRFToken if returned in response headers
apiClient.interceptors.response.use(
  (response) => {
    const token = response.headers['x-csrftoken'] || response.headers['X-CSRFToken'];
    if (token && typeof window !== 'undefined') {
      sessionStorage.setItem('csrf_token', token);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fallback Job Offers for presentation or when backend is temporarily unreachable
export const FALLBACK_JOBS = [
  {
    id: 1,
    titre: "Chef de Rayon — Produits Frais",
    description: "Nous recherchons un Chef de Rayon dynamique pour piloter la gestion du rayon produits frais, optimiser l'approvisionnement, superviser l'équipe de vente et garantir le respect des normes d'hygiène et de qualité élevées de Super-Market Sarl.",
    departement: "Distribution & Ventes",
    date_debut: "2026-09-15",
    date_fin: "2026-11-30",
    profil_recherche: "Bac+2 / Bac+3 en Gestion Commerciale, Management des Ventes ou Agroalimentaire. Minimum 2 ans d'expérience dans la grande distribution.",
    competences: "Gestion des stocks, Management d'équipe, Merchandising, Rigueur hygiène HACCP",
    type_contrat: "CDI",
    lieu: "Douala (Bonapriso)",
    salaire_de_base: "300000 FCFA",
    etat: "publiee"
  },
  {
    id: 2,
    titre: "Responsable Approvisionnement & Logistique",
    description: "Sous la responsabilité de la direction logistique, vous assurez la planification des commandes fournisseurs, la régulation des flux de stock inter-agences et l'optimisation de la chaîne du froid.",
    departement: "Logistique & Chaîne Froid",
    date_debut: "2026-09-20",
    date_fin: "2026-12-15",
    profil_recherche: "Master ou Licence professionnelle en Supply Chain, Logistique ou Transit. Maîtrise des logiciels de gestion ERP et des outils d'inventaire.",
    competences: "ERP, Supply Chain, Négociation fournisseur, Audit de stock, Gestion de flotte",
    type_contrat: "CDI",
    lieu: "Yaoundé (Essos)",
    salaire_de_base: "350000 FCFA",
    etat: "publiee"
  },
  {
    id: 3,
    titre: "Assistant Comptable & Gestion Caisse",
    description: "Intégré à notre équipe financière, vous serez en charge de la tenue de la comptabilité courante, de la réconciliation des caisses journalières, et de la préparation des états financiers périodiques.",
    departement: "Finance & Comptabilité",
    date_debut: "2026-09-10",
    date_fin: "2026-10-31",
    profil_recherche: "BTS / DUT / Licence en Comptabilité et Gestion des Organisations (CGO). Rigueur, discrétion et maîtrise d'Excel avancée.",
    competences: "Comptabilité générale, Rapprochement bancaire, Saisie comptable, Excel, ERP Caisse",
    type_contrat: "CDD",
    lieu: "Douala (Akwa)",
    salaire_de_base: "220000 FCFA",
    etat: "publiee"
  },
  {
    id: 4,
    titre: "Télévendeuse & Chargé de Clientèle",
    description: "Vous assurerez la prise de commandes par téléphone et WhatsApp, la relance des clients fidèles, la gestion du suivi après-vente et la coordination avec les livreurs.",
    departement: "Service Client & Ventes",
    date_debut: "2026-09-01",
    date_fin: "2026-10-15",
    profil_recherche: "Bac+2 en Action Commerciale, Communication ou Secrétariat. Excellente élocution en français, aisance relationnelle et rapidité de saisie.",
    competences: "Relation client, Phoning, WhatsApp Business, Gestion des litiges, Esprit d'équipe",
    type_contrat: "CDI",
    lieu: "Douala",
    salaire_de_base: "180000 FCFA",
    etat: "publiee"
  }
];

// ==========================================
// API PUBLIC CATALOGUE & STOCK PRODUITS
// ==========================================

/**
 * GET /api/public/products/
 * Fetch live products and real-time stock from ERP
 */
export async function getLiveProducts() {
  try {
    const response = await apiClient.get('/api/public/products/');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.warn('ERP product API unavailable, using fallback data:', error.message);
    return null;
  }
}

// ==========================================
// API PUBLIC OFFRES D'EMPLOI
// ==========================================

/**
 * GET /api/public/jobs/
 * Fetch list of active published jobs
 */
export async function getJobs() {
  try {
    const response = await apiClient.get('/api/public/jobs/');
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data;
    }
    return FALLBACK_JOBS;
  } catch (error) {
    console.warn('Backend job API unavailable, using local structured data:', error.message);
    return FALLBACK_JOBS;
  }
}

/**
 * GET /api/public/jobs/<id>/
 * Fetch detailed job offer by ID
 */
export async function getJobDetail(jobId) {
  try {
    const response = await apiClient.get(`/api/public/jobs/${jobId}/`);
    return response.data;
  } catch (error) {
    // Fallback search
    const found = FALLBACK_JOBS.find(j => j.id === Number(jobId));
    if (found) return found;
    throw error;
  }
}

/**
 * POST /api/public/jobs/<id>/apply/
 * Submit application with multipart files
 */
export async function applyToJob(jobId, formData) {
  try {
    const response = await apiClient.post(`/api/public/jobs/${jobId}/apply/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error("Impossible de soumettre la candidature pour le moment. Veuillez réespayer.");
  }
}

// ==========================================
// API AUTHENTIFICATION CANDIDAT
// ==========================================

/**
 * POST /api/public/candidates/register/
 */
export async function registerCandidate(candidateData) {
  try {
    const response = await apiClient.post('/api/public/candidates/register/', candidateData);
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 409) {
        throw new Error("Cet e-mail est déjà utilisé par un autre compte candidat.");
      }
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error("Échec de l'inscription. Veuillez vérifier les informations saisies.");
  }
}

/**
 * POST /api/public/candidates/login/
 */
export async function loginCandidate(email, password) {
  try {
    const response = await apiClient.post('/api/public/candidates/login/', { email, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 403) {
        throw new Error("Accès refusé. Ce compte ne peut pas se connecter en tant que candidat.");
      }
      if (error.response.status === 401 || error.response.status === 400) {
        throw new Error("Identifiants incorrects (email ou mot de passe).");
      }
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error("Erreur de connexion. Veuillez réessayer.");
  }
}

/**
 * GET /api/public/candidates/me/
 */
export async function getCandidateProfile() {
  try {
    const response = await apiClient.get('/api/public/candidates/me/');
    return response.data;
  } catch (error) {
    return null;
  }
}

/**
 * GET /api/public/candidates/applications/
 */
export async function getCandidateApplications() {
  try {
    const response = await apiClient.get('/api/public/candidates/applications/');
    return response.data;
  } catch (error) {
    return [];
  }
}

/**
 * POST /api/public/candidates/logout/
 */
export async function logoutCandidate() {
  try {
    const response = await apiClient.post('/api/public/candidates/logout/');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
  }
}

// ==========================================
// API GESTIONNAIRE DE CATALOGUE & AUTH ERP
// ==========================================

/**
 * POST /api/public/auth/login/
 * Authenticate ERP users (gestionnaire_catalogue, admin, etc.) directly on Vitrine
 */
export async function loginErpUser(identifier, password) {
  const response = await apiClient.post('/api/public/auth/login/', { identifier, password });
  return response.data;
}

/**
 * POST /api/public/catalog/add-product/
 * Add a new product to showcase catalog (independent of physical stock)
 */
export async function addCatalogProduct(productData) {
  const config = productData instanceof FormData ? {
    headers: { 'Content-Type': 'multipart/form-data' }
  } : {};
  const response = await apiClient.post('/api/public/catalog/add-product/', productData, config);
  return response.data;
}

/**
 * GET /api/public/payment-numbers/
 * Retrieve current Orange Money configuration with merchant code for payment
 */
export async function getPaymentNumbers() {
  try {
    const response = await apiClient.get('/api/public/payment-numbers/');
    return response.data?.payment_numbers;
  } catch (error) {
    return {
      orange_money: {
        numero: '+237 690 00 00 00',
        nom: 'Supermarket SARL',
        code_marchand: '345892',
        instructions: 'Composez le #150*47*345892*Montant# ou effectuez un paiement marchand via Orange Money.'
      }
    };
  }
}

/**
 * POST /api/public/payment-numbers/
 * Update Orange Money merchant code and configuration (catalogue manager)
 */
export async function updatePaymentNumbers(paymentNumbers) {
  const response = await apiClient.post('/api/public/payment-numbers/', { payment_numbers: paymentNumbers });
  return response.data;
}

export default apiClient;


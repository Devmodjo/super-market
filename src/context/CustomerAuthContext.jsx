import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider,
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  db,
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from '../firebase';
import { loginErpUser } from '../utils/api';
import axios from 'axios';

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [customerProfile, setCustomerProfile] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    ville: 'Yaoundé',
    role: 'client',
    isCatalogueManager: false,
  });
  const [loading, setLoading] = useState(true);

  // Helper to persist client in Firestore
  const syncToFirestore = async (uid, data) => {
    if (!uid) return;
    try {
      const clientRef = doc(db, 'clients_vitrine', uid);
      await setDoc(clientRef, {
        ...data,
        uid,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.warn('Sync to Firestore skipped or failed:', err);
    }
  };

  // Helper to persist client in ERP database
  const syncToErp = async (profileData, email) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/public/clients/register/', {
        nom: profileData.nom || '',
        prenom: profileData.prenom || '',
        telephone: profileData.telephone || '',
        adresse: profileData.adresse || '',
        ville: profileData.ville || 'Yaoundé',
        email: email || profileData.email || '',
      });
    } catch (err) {
      console.warn('Sync to ERP client error:', err?.message);
    }
  };

  // Restore session: check for ERP session or Firebase Auth state
  useEffect(() => {
    // 1. Check local ERP session
    const savedErpSession = localStorage.getItem('erp_active_user');
    if (savedErpSession) {
      try {
        const erpUser = JSON.parse(savedErpSession);
        setCurrentUser(erpUser);
        const storedProfile = localStorage.getItem(`customer_profile_${erpUser.uid}`);
        if (storedProfile) {
          setCustomerProfile(JSON.parse(storedProfile));
        } else {
          setCustomerProfile({
            nom: erpUser.erpUser?.nom || '',
            prenom: erpUser.erpUser?.prenom || '',
            telephone: '',
            adresse: '',
            ville: 'Yaoundé',
            role: erpUser.role,
            isCatalogueManager: erpUser.isCatalogueManager,
          });
        }
        setLoading(false);
      } catch (e) {
        console.error('Error loading ERP user session:', e);
      }
    }

    // 2. Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If a Firebase user logs in, prioritize Firebase over local ERP session
        localStorage.removeItem('erp_active_user');
        setCurrentUser(user);

        let profile = null;

        // Try to fetch from Firestore first
        try {
          const docSnap = await getDoc(doc(db, 'clients_vitrine', user.uid));
          if (docSnap.exists()) {
            profile = docSnap.data();
          }
        } catch (e) {
          console.warn('Could not read from Firestore:', e);
        }

        // Fallback to localStorage
        if (!profile) {
          const stored = localStorage.getItem(`customer_profile_${user.uid}`);
          if (stored) {
            try {
              profile = JSON.parse(stored);
            } catch (e) {}
          }
        }

        // Default profile if none found
        if (!profile) {
          const names = (user.displayName || '').split(' ');
          const prenom = names[0] || '';
          const nom = names.slice(1).join(' ') || prenom;
          profile = {
            nom: nom,
            prenom: prenom,
            telephone: user.phoneNumber || '',
            adresse: '',
            ville: 'Yaoundé',
            email: user.email || '',
            role: 'client',
            isCatalogueManager: false,
          };
          syncToFirestore(user.uid, profile);
        }

        setCustomerProfile(profile);
        localStorage.setItem(`customer_profile_${user.uid}`, JSON.stringify(profile));
      } else {
        // If not logged in to Firebase and no ERP user saved
        if (!localStorage.getItem('erp_active_user')) {
          setCurrentUser(null);
          setCustomerProfile({
            nom: '',
            prenom: '',
            telephone: '',
            adresse: '',
            ville: 'Yaoundé',
            role: 'client',
            isCatalogueManager: false,
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveProfile = async (newProfile) => {
    setCustomerProfile(newProfile);
    if (currentUser) {
      localStorage.setItem(`customer_profile_${currentUser.uid}`, JSON.stringify(newProfile));
      // Save client profile to Firestore and ERP if not an ERP user
      if (!currentUser.isErpUser) {
        await syncToFirestore(currentUser.uid, {
          ...newProfile,
          email: currentUser.email || '',
        });
        await syncToErp(newProfile, currentUser.email);
      }
    }
  };

  /**
   * Login with email or username:
   * 1. Try Firebase Auth
   * 2. If Firebase fails or identifier has no '@', try ERP API (allowing gestionnaire_catalogue, admin, etc.)
   */
  const loginWithEmail = async (identifier, password) => {
    const trimmedId = (identifier || '').trim();

    // Try Firebase if it looks like an email
    if (trimmedId.includes('@')) {
      try {
        const cred = await signInWithEmailAndPassword(auth, trimmedId, password);
        // Load profile from Firestore
        try {
          const docSnap = await getDoc(doc(db, 'clients_vitrine', cred.user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCustomerProfile(data);
            localStorage.setItem(`customer_profile_${cred.user.uid}`, JSON.stringify(data));
          }
        } catch (e) {
          console.warn('Firestore fetch error:', e);
        }
        return cred.user;
      } catch (fbErr) {
        console.log('Firebase auth failed, attempting ERP backend login...', fbErr.code);
      }
    }

    // Attempt ERP login
    try {
      const erpResp = await loginErpUser(trimmedId, password);
      if (erpResp && erpResp.success) {
        const u = erpResp.user;
        const erpUserObj = {
          uid: `erp_${u.id}`,
          email: u.email,
          displayName: u.nom_complet || u.username,
          username: u.username,
          isErpUser: true,
          role: u.role,
          isCatalogueManager: u.is_catalogue_manager,
          erpUser: u,
        };

        const erpProfile = {
          nom: u.nom || '',
          prenom: u.prenom || '',
          telephone: '',
          adresse: '',
          ville: 'Yaoundé',
          role: u.role,
          isCatalogueManager: u.is_catalogue_manager,
        };

        setCurrentUser(erpUserObj);
        setCustomerProfile(erpProfile);
        localStorage.setItem('erp_active_user', JSON.stringify(erpUserObj));
        localStorage.setItem(`customer_profile_${erpUserObj.uid}`, JSON.stringify(erpProfile));
        return erpUserObj;
      }
    } catch (erpErr) {
      const msg = erpErr?.response?.data?.error;
      if (msg) {
        throw new Error(msg);
      }
    }

    throw new Error("Identifiant ou mot de passe incorrect.");
  };

  /**
   * Register a new client:
   * Creates Firebase Auth user AND registers them directly into Firestore
   */
  const registerWithEmail = async (email, password, profileData) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const fullName = `${profileData.prenom || ''} ${profileData.nom || ''}`.trim();
    if (fullName) {
      await updateProfile(cred.user, { displayName: fullName });
    }
    const fullProfile = {
      ...profileData,
      email: cred.user.email,
      role: 'client',
      isCatalogueManager: false,
    };
    
    // Save to state and localStorage
    setCustomerProfile(fullProfile);
    localStorage.setItem(`customer_profile_${cred.user.uid}`, JSON.stringify(fullProfile));

    // Save directly to Cloud Firestore collection 'clients_vitrine'
    try {
      await setDoc(doc(db, 'clients_vitrine', cred.user.uid), {
        ...fullProfile,
        uid: cred.user.uid,
        email: cred.user.email,
        createdAt: serverTimestamp(),
        source: 'vitrine_supermarket',
      }, { merge: true });
    } catch (fsErr) {
      console.warn('Error saving new client to Firestore:', fsErr);
    }

    // Persist into ERP Client table
    await syncToErp(fullProfile, cred.user.email);

    return cred.user;
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const names = (user.displayName || '').split(' ');
      const prenom = names[0] || '';
      const nom = names.slice(1).join(' ') || prenom;
      
      let profile = {
        nom: nom,
        prenom: prenom,
        telephone: user.phoneNumber || '',
        adresse: '',
        ville: 'Yaoundé',
        email: user.email || '',
        role: 'client',
        isCatalogueManager: false,
      };

      try {
        const docSnap = await getDoc(doc(db, 'clients_vitrine', user.uid));
        if (docSnap.exists()) {
          profile = docSnap.data();
        } else {
          await setDoc(doc(db, 'clients_vitrine', user.uid), {
            ...profile,
            uid: user.uid,
            createdAt: serverTimestamp(),
            source: 'vitrine_google_auth',
          }, { merge: true });
        }
      } catch (err) {
        console.warn('Firestore Google signin sync:', err);
      }

      setCustomerProfile(profile);
      localStorage.setItem(`customer_profile_${user.uid}`, JSON.stringify(profile));
      syncToErp(profile, user.email);
      return user;
    } catch (error) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        throw new Error("Un compte existe déjà avec cette adresse email en utilisant une autre méthode de connexion. Veuillez vous connecter avec mot de passe.");
      }
      throw error;
    }
  };

  const logout = async () => {
    if (currentUser?.isErpUser) {
      localStorage.removeItem('erp_active_user');
      setCurrentUser(null);
      setCustomerProfile({
        nom: '',
        prenom: '',
        telephone: '',
        adresse: '',
        ville: 'Yaoundé',
        role: 'client',
        isCatalogueManager: false,
      });
    } else {
      await signOut(auth);
    }
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        currentUser,
        customerProfile,
        isAuthenticated: !!currentUser,
        isCatalogueManager: !!(currentUser?.isCatalogueManager || customerProfile?.isCatalogueManager),
        isErpUser: !!currentUser?.isErpUser,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        saveProfile,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within a CustomerAuthProvider');
  }
  return context;
}

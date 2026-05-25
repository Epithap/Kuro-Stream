import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  serverTimestamp,
  where,
} from 'firebase/firestore';

const AuthContext = createContext(null);

const formatUserCode = (value) => value.toString().padStart(5, '0');

const getDefaultDailyQuests = () => [
  {
    id: 1,
    title: 'Baca 3 Chapter Manga',
    description: 'Baca 3 chapter manga dalam 24 jam',
    progress: 0,
    total: 3,
    rewardExp: 80,
    rewardDiamonds: 15,
    completed: false,
  },
  {
    id: 2,
    title: 'Tonton 1 Episode Anime',
    description: 'Tonton 1 episode anime hari ini',
    progress: 0,
    total: 1,
    rewardExp: 60,
    rewardDiamonds: 12,
    completed: false,
  },
  {
    id: 3,
    title: 'Tambah 3 Teman',
    description: 'Tambahkan 3 teman baru menggunakan kode mereka',
    progress: 0,
    total: 3,
    rewardExp: 100,
    rewardDiamonds: 20,
    completed: false,
  },
  {
    id: 4,
    title: 'Ikuti 1 Sesi Nobar',
    description: 'Ikuti satu sesi nobar atau undangan bersama teman',
    progress: 0,
    total: 1,
    rewardExp: 70,
    rewardDiamonds: 10,
    completed: false,
  },
  {
    id: 5,
    title: 'Buka Profil Lengkap',
    description: 'Kunjungi halaman profil dan cek statistik harian',
    progress: 0,
    total: 1,
    rewardExp: 50,
    rewardDiamonds: 8,
    completed: false,
  },
];

const firestoreRequestWithTimeout = async (promise, timeoutMs = 7000) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Firestore operation timed out')), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
};

const getNextUserCode = async () => {
  console.log('AuthContext: getNextUserCode start');
  try {
    const usersSnapshot = await firestoreRequestWithTimeout(getDocs(collection(db, 'users')), 3000);
    const code = formatUserCode(usersSnapshot.size + 1);
    console.log('AuthContext: getNextUserCode result', code);
    return code;
  } catch (error) {
    // Firestore is unavailable or slow; use a local fallback and continue.
    // eslint-disable-next-line no-console
    console.warn('AuthContext: getNextUserCode fallback due Firestore error:', error);
  }

  const fallbackCode = formatUserCode(Math.floor(10000 + Math.random() * 90000));
  console.log('AuthContext: fallback user code', fallbackCode);
  return fallbackCode;
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const DEMO_ACCOUNT_EMAIL = 'upik@gmail.com';
const DEMO_ACCOUNT_PASSWORD = '12345678';

const getDemoProfile = () => ({
  uid: 'admin-upik-676767',
  email: DEMO_ACCOUNT_EMAIL,
  displayName: 'Admin Upik',
  userCode: '676767',
  role: 'admin',
  level: 1,
  exp: 0,
  diamonds: 0,
  tier: 'Admin',
  title: 'Admin',
  questsCompleted: 0,
  questDailyCount: 0,
  lastQuestDate: new Date().toISOString().slice(0, 10),
  dailyQuests: getDefaultDailyQuests(),
  friends: [],
});

const isDemoAccount = (email, password) => {
  return normalizeEmail(email) === DEMO_ACCOUNT_EMAIL && String(password) === DEMO_ACCOUNT_PASSWORD;
};

const isAdminAccount = (email) => {
  const normalized = normalizeEmail(email);
  return normalized === 'upik@gmail.com';
};

const parseFirebaseError = (error) => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Email tidak valid. Periksa kembali format email.';
    case 'auth/user-not-found':
      return 'Akun tidak ditemukan. Coba daftar terlebih dahulu.';
    case 'auth/wrong-password':
      return 'Password salah. Coba lagi.';
    case 'auth/email-already-in-use':
      return 'Email sudah terdaftar. Silakan login atau gunakan email lain.';
    case 'auth/weak-password':
      return 'Password harus minimal 6 karakter.';
    case 'auth/invalid-credential':
      return 'Kredensial tidak valid. Pastikan email dan password benar.';
    case 'auth/network-request-failed':
      return 'Koneksi gagal. Periksa jaringan Anda.';
    default:
      return error?.message || 'Terjadi kesalahan autentikasi.';
  }
};

const createUserProfile = async (user, displayName) => {
  console.log('AuthContext: createUserProfile start', user.uid);
  const profileRef = doc(db, 'users', user.uid);
  console.log('AuthContext: fetching profile doc', user.uid);

  let profileSnap = null;
  try {
    profileSnap = await firestoreRequestWithTimeout(getDoc(profileRef));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('AuthContext: getDoc failed, falling back to new profile', error);
  }

  if (profileSnap?.exists()) {
    console.log('AuthContext: profile exists', user.uid);
    const profileData = profileSnap.data();
    return profileData;
  }

  console.log('AuthContext: profile not found, generating userCode');
  const isAdmin = isAdminAccount(user.email);
  const userCode = isAdmin ? '676767' : await getNextUserCode();
  console.log('AuthContext: generated userCode', userCode);
  const role = isAdmin ? 'admin' : userCode === '00001' ? 'admin' : 'user';

  const newProfile = {
    uid: user.uid,
    email: user.email,
    displayName: isAdmin ? 'Admin' : displayName || user.email?.split('@')[0] || 'Pengguna',
    userCode,
    role,
    level: 1,
    exp: 0,
    diamonds: 0,
    tier: 'karbit',
    questsCompleted: 0,
    questDailyCount: 0,
    lastQuestDate: new Date().toISOString().slice(0, 10),
    dailyQuests: getDefaultDailyQuests(),
    title: isAdmin ? 'Admin' : 'Novice',
    friends: [],
    createdAt: serverTimestamp(),
  };

  try {
    console.log('AuthContext: writing new profile to Firestore', user.uid);
    await firestoreRequestWithTimeout(setDoc(profileRef, newProfile));
    console.log('AuthContext: setDoc completed', user.uid);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('AuthContext: setDoc failed, storing local fallback profile', error);
  }

  console.log('AuthContext: createUserProfile returning local profile', user.uid);
  return newProfile;
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  const refreshProfile = async (currentUser) => {
    if (!currentUser) return null;
    console.log('AuthContext: refreshProfile start', currentUser.uid);
    const profileRef = doc(db, 'users', currentUser.uid);
    console.log('AuthContext: refreshProfile fetching profile', currentUser.uid);

    let profileSnap = null;
    try {
      profileSnap = await firestoreRequestWithTimeout(getDoc(profileRef));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('AuthContext: refreshProfile getDoc failed, creating profile fallback', error);
      return createUserProfile(currentUser);
    }

    if (!profileSnap?.exists()) {
      console.log('AuthContext: profile missing, creating profile', currentUser.uid);
      return createUserProfile(currentUser);
    }

    const profileData = profileSnap.data();
    const today = new Date().toISOString().slice(0, 10);
    const isAdmin = isAdminAccount(currentUser.email);
    const updated = {};

    if (isAdmin && profileData.role !== 'admin') {
      updated.role = 'admin';
      updated.userCode = '676767';
      updated.title = 'Admin';
      console.log('AuthContext: force admin values for admin email', currentUser.uid);
    }

    if (profileData.lastQuestDate !== today) {
      console.log('AuthContext: resetting daily quest data', currentUser.uid, profileData.lastQuestDate, today);
      updated.questDailyCount = 0;
      updated.lastQuestDate = today;
      updated.dailyQuests = getDefaultDailyQuests();
    }

    if (Object.keys(updated).length > 0) {
      try {
        await firestoreRequestWithTimeout(updateDoc(profileRef, updated));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('AuthContext: updateDoc failed during profile refresh update', error);
      }
    }

    if (Object.keys(updated).length > 0) {
      return { ...profileData, ...updated };
    }

    console.log('AuthContext: refreshProfile done', currentUser.uid);
    return profileData;
  };

  useEffect(() => {
    // Support demo mode via URL parameter
    const params = new URLSearchParams(window.location.search);
    const isDemoMode = params.get('demo') === '1';
    
    if (isDemoMode) {
      // Demo mode for development/testing
      const demoUser = {
        uid: 'demo-user-001',
        email: 'demo@kurotream.local',
        displayName: 'Demo User',
      };
      const demoProfile = {
        uid: 'demo-user-001',
        email: 'demo@kurotream.local',
        displayName: 'Demo User',
        userCode: '00001',
        role: 'user',
        level: 5,
        tier: 'Premium',
        poin: 2500,
        friends: 12,
        questDailyCount: 3,
        lastQuestDate: new Date().toISOString().slice(0, 10),
      };
      setUser(demoUser);
      setUserProfile(demoProfile);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const profile = await refreshProfile(currentUser);
          setUser(currentUser);
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setAuthError('Terjadi kesalahan saat loading profil');
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError('');
    try {
      const normalizedEmail = normalizeEmail(email);
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const profile = await refreshProfile(cred.user);
      setUser(cred.user);
      setUserProfile(profile);
      return cred;
    } catch (error) {
      if (isDemoAccount(email, password)) {
        const demoProfile = getDemoProfile();
        const demoUser = {
          uid: demoProfile.uid,
          email: demoProfile.email,
          displayName: demoProfile.displayName,
        };
        setUser(demoUser);
        setUserProfile(demoProfile);
        setAuthError('');
        return { user: demoUser };
      }

      // Log detailed error for debugging (will appear in browser console)
      // eslint-disable-next-line no-console
      console.error('Firebase auth error (login):', error?.code, error);
      setAuthError(parseFirebaseError(error));
      throw error;
    }
  };

  const register = async (email, password, displayName) => {
    setAuthError('');
    try {
      if (isDemoAccount(email, password)) {
        const demoProfile = getDemoProfile();
        const demoUser = {
          uid: demoProfile.uid,
          email: demoProfile.email,
          displayName: displayName || demoProfile.displayName,
        };
        setUser(demoUser);
        setUserProfile({ ...demoProfile, displayName: displayName || demoProfile.displayName });
        return { user: demoUser };
      }

      console.log('AuthContext: register start', email);
      const normalizedEmail = normalizeEmail(email);
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      console.log('AuthContext: createUserWithEmailAndPassword success', cred.user.uid);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
        console.log('AuthContext: updateProfile success', cred.user.uid);
      }
      const profile = await createUserProfile(cred.user, displayName);
      console.log('AuthContext: createUserProfile returned', cred.user.uid, profile?.userCode);
      setUser(cred.user);
      setUserProfile(profile);
      console.log('AuthContext: register complete', cred.user.uid);
      return cred;
    } catch (error) {
      // Log detailed error for debugging
      // eslint-disable-next-line no-console
      console.error('Firebase auth error (register):', error?.code, error);
      setAuthError(parseFirebaseError(error));
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const updateUserData = async (updates) => {
    if (!userProfile) return;
    const profileRef = doc(db, 'users', userProfile.uid);
    try {
      await firestoreRequestWithTimeout(updateDoc(profileRef, updates));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('AuthContext: updateUserData failed', error);
    }
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const completeQuest = async (questId) => {
    if (!userProfile) return;
    const today = new Date().toISOString().slice(0, 10);
    const profileDate = userProfile.lastQuestDate || today;
    const hasReset = profileDate !== today;
    const activeQuests = hasReset ? getDefaultDailyQuests() : userProfile.dailyQuests || getDefaultDailyQuests();
    const completedCount = activeQuests.filter((quest) => quest.completed).length;
    if (completedCount >= 5) return;

    const nextQuest = questId
      ? activeQuests.find((quest) => quest.id === questId)
      : activeQuests.find((quest) => !quest.completed);
    if (!nextQuest) return;

    const updatedQuest = {
      ...nextQuest,
      progress: nextQuest.total,
      completed: true,
    };
    const updatedDailyQuests = activeQuests.map((quest) =>
      quest.id === updatedQuest.id ? updatedQuest : quest
    );

    const addedExp = updatedQuest.rewardExp;
    const addedDiamonds = updatedQuest.rewardDiamonds;
    const nextExp = (userProfile.exp || 0) + addedExp;
    const nextLevel = userProfile.level + Math.floor(nextExp / 100);

    const updates = {
      exp: nextExp,
      diamonds: (userProfile.diamonds || 0) + addedDiamonds,
      questsCompleted: (userProfile.questsCompleted || 0) + 1,
      questDailyCount: completedCount + 1,
      lastQuestDate: today,
      dailyQuests: updatedDailyQuests,
      level: nextLevel,
    };

    await updateUserData(updates);
    setUserProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const addFriend = async (friendCode) => {
    if (!userProfile) throw new Error('Silakan login terlebih dahulu.');
    const normalizedCode = String(friendCode || '').trim();
    if (!normalizedCode) throw new Error('Masukkan kode pengguna teman.');

    const friendsQuery = query(
      collection(db, 'users'),
      where('userCode', '==', normalizedCode)
    );
    const snapshot = await firestoreRequestWithTimeout(getDocs(friendsQuery));

    if (snapshot.empty) {
      throw new Error('Pengguna dengan kode tersebut tidak ditemukan.');
    }

    const friendDoc = snapshot.docs[0];
    if (friendDoc.id === userProfile.uid) {
      throw new Error('Tidak bisa menambahkan diri sendiri sebagai teman.');
    }

    const friendData = friendDoc.data();
    const profileRef = doc(db, 'users', userProfile.uid);
    const friendRef = doc(db, 'users', friendDoc.id);

    const friendRecord = {
      uid: friendDoc.id,
      displayName: friendData.displayName || 'Pengguna',
      userCode: friendData.userCode,
    };

    const myRecord = {
      uid: userProfile.uid,
      displayName: userProfile.displayName || 'Pengguna',
      userCode: userProfile.userCode,
    };

    await updateDoc(profileRef, {
      friends: arrayUnion(friendRecord),
    });
    await updateDoc(friendRef, {
      friends: arrayUnion(myRecord),
    });

    setUserProfile((prev) => ({
      ...prev,
      friends: [...(prev?.friends || []), friendRecord],
    }));

    return friendRecord;
  };

  const clearAuthError = () => setAuthError('');

  const value = {
    user,
    userProfile,
    loading,
    authError,
    login,
    register,
    logout,
    updateUserData,
    completeQuest,
    addFriend,
    clearAuthError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

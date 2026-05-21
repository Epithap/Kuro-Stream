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

const getNextUserCode = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  return formatUserCode(usersSnapshot.size + 1);
};

const createUserProfile = async (user, displayName) => {
  const profileRef = doc(db, 'users', user.uid);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    const profileData = profileSnap.data();
    return profileData;
  }

  const userCode = await getNextUserCode();
  const role = userCode === '00001' ? 'admin' : 'user';

  const newProfile = {
    uid: user.uid,
    email: user.email,
    displayName: displayName || user.email?.split('@')[0] || 'Pengguna',
    userCode,
    role,
    level: 1,
    exp: 0,
    diamonds: 0,
    tier: 'karbit',
    questsCompleted: 0,
    questDailyCount: 0,
    lastQuestDate: new Date().toISOString().slice(0, 10),
    friends: [],
    createdAt: serverTimestamp(),
  };

  await setDoc(profileRef, newProfile);
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
    const profileRef = doc(db, 'users', currentUser.uid);
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      return createUserProfile(currentUser);
    }

    const profileData = profileSnap.data();
    const today = new Date().toISOString().slice(0, 10);
    if (profileData.lastQuestDate !== today) {
      const updated = {
        questDailyCount: 0,
        lastQuestDate: today,
      };
      await updateDoc(profileRef, updated);
      return { ...profileData, ...updated };
    }

    return profileData;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const profile = await refreshProfile(currentUser);
        setUser(currentUser);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError('');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const profile = await refreshProfile(cred.user);
    setUser(cred.user);
    setUserProfile(profile);
  };

  const register = async (email, password, displayName) => {
    setAuthError('');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const profile = await createUserProfile(cred.user, displayName);
    setUser(cred.user);
    setUserProfile(profile);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const updateUserData = async (updates) => {
    if (!userProfile) return;
    const profileRef = doc(db, 'users', userProfile.uid);
    await updateDoc(profileRef, updates);
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  const completeQuest = async () => {
    if (!userProfile) return;
    const today = new Date().toISOString().slice(0, 10);
    const resetCount = userProfile.lastQuestDate !== today ? 0 : userProfile.questDailyCount;
    if (resetCount >= 5) return;

    const addedExp = 50;
    const addedDiamonds = 20;
    const nextQuestCount = resetCount + 1;
    const nextExp = (userProfile.exp || 0) + addedExp;
    const nextLevel = userProfile.level + Math.floor(nextExp / 100);

    const updates = {
      exp: nextExp,
      diamonds: (userProfile.diamonds || 0) + addedDiamonds,
      questsCompleted: (userProfile.questsCompleted || 0) + 1,
      questDailyCount: nextQuestCount,
      lastQuestDate: today,
      level: nextLevel,
    };

    await updateUserData(updates);
  };

  const addFriend = async (friendCode) => {
    if (!userProfile) throw new Error('Silakan login terlebih dahulu.');
    const normalizedCode = friendCode?.trim();
    if (!normalizedCode) throw new Error('Masukkan kode pengguna teman.');

    const friendsQuery = query(
      collection(db, 'users'),
      where('userCode', '==', normalizedCode)
    );
    const snapshot = await getDocs(friendsQuery);

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

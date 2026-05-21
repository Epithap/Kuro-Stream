import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const usersSnapshot = await getDocs(collection(db, 'users'));
    setUsers(usersSnapshot.docs.map((docItem) => ({ uid: docItem.id, ...docItem.data() })));
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (uid, role) => {
    await updateDoc(doc(db, 'users', uid), { role });
    await loadUsers();
  };

  const updateTier = async (uid, tier) => {
    await updateDoc(doc(db, 'users', uid), { tier });
    await loadUsers();
  };

  if (!userProfile?.role || userProfile?.role !== 'admin') {
    return (
      <div className="admin-dashboard">
        <h2>Akses ditolak</h2>
        <p>Hanya admin yang dapat membuka halaman ini.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard Admin</h1>
      <p>Kelola pengguna, role, dan tier dari panel ini.</p>

      {loading ? (
        <p>Memuat pengguna...</p>
      ) : (
        <div className="admin-user-list">
          {users.map((user) => (
            <div key={user.uid} className="admin-user-card glass-panel">
              <div>
                <h3>{user.displayName || user.email}</h3>
                <p>Kode: {user.userCode}</p>
                <p>Role: {user.role}</p>
                <p>Tier: {user.tier}</p>
                <p>Level: {user.level} | Exp: {user.exp} | Diamond: {user.diamonds}</p>
              </div>

              <div className="admin-actions">
                <button onClick={() => updateRole(user.uid, user.role === 'admin' ? 'user' : 'admin')}>
                  {user.role === 'admin' ? 'Set user' : 'Set admin'}
                </button>
                <button onClick={() => updateTier(user.uid, user.tier === 'karbit' ? 'sepuh' : 'karbit')}>
                  Toggle tier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

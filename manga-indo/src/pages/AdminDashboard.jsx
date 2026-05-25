import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { userProfile } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [editValues, setEditValues] = useState({});
  const [selectedUserUid, setSelectedUserUid] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    const usersSnapshot = await getDocs(collection(db, 'users'));
    setUsers(usersSnapshot.docs.map((docItem) => ({ uid: docItem.id, ...docItem.data() })));
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditChange = (uid, field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [uid]: {
        ...prev[uid],
        [field]: value,
      },
    }));
  };

  const toggleEditPanel = (uid) => {
    setSelectedUserUid((prev) => (prev === uid ? '' : uid));
  };

  const handleUpdateUser = async (user) => {
    setError('');
    setMessage('');
    const edits = editValues[user.uid] || {};
    const updatePayload = {};

    if (edits.level !== undefined && edits.level !== '') {
      const parsed = Number(edits.level);
      if (Number.isFinite(parsed) && parsed >= 0) {
        updatePayload.level = parsed;
      } else {
        setError('Level harus berupa angka valid.');
        return;
      }
    }

    if (edits.addExp !== undefined && edits.addExp !== '') {
      const parsed = Number(edits.addExp);
      if (Number.isFinite(parsed) && parsed !== 0) {
        updatePayload.exp = (user.exp || 0) + parsed;
      } else {
        setError('Exp harus berupa angka valid dan tidak boleh 0.');
        return;
      }
    }

    if (edits.addDiamonds !== undefined && edits.addDiamonds !== '') {
      const parsed = Number(edits.addDiamonds);
      if (Number.isFinite(parsed) && parsed !== 0) {
        updatePayload.diamonds = (user.diamonds || 0) + parsed;
      } else {
        setError('Diamond harus berupa angka valid dan tidak boleh 0.');
        return;
      }
    }

    if (edits.title !== undefined && edits.title.trim() !== '') {
      updatePayload.title = edits.title.trim();
    }

    if (edits.tier !== undefined && edits.tier.trim() !== '') {
      updatePayload.tier = edits.tier.trim();
    }

    if (!Object.keys(updatePayload).length) {
      setError('Isi level, exp, diamond, title, atau tier untuk memperbarui.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), updatePayload);
      setMessage(`Profil ${user.displayName || user.email} berhasil diperbarui.`);
      await loadUsers();
      setEditValues((prev) => ({ ...prev, [user.uid]: {} }));
    } catch (updateError) {
      setError('Gagal menyimpan perubahan.');
      // eslint-disable-next-line no-console
      console.error('Admin update error:', updateError);
    }
  };

  const filteredUsers = users.filter((item) => {
    if (!filter.trim()) return true;
    const query = filter.trim().toLowerCase();
    return (
      String(item.userCode || '').toLowerCase().includes(query) ||
      String(item.displayName || '').toLowerCase().includes(query) ||
      String(item.email || '').toLowerCase().includes(query)
    );
  });

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
      <p>Kelola level, title, dan detail pengguna berdasarkan kode akun.</p>

      <div className="admin-controls glass-panel">
        <label>
          Cari pengguna berdasarkan kode ID, nama, atau email
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Cari: 676767 atau upik@gmail.com"
          />
        </label>
      </div>

      {message && <div className="admin-notice success">{message}</div>}
      {error && <div className="admin-notice error">{error}</div>}

      {loading ? (
        <p>Memuat pengguna...</p>
      ) : (
        <div className="admin-user-list">
          {filteredUsers.length === 0 ? (
            <p>Tidak ada pengguna yang cocok dengan pencarian.</p>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.uid} className="admin-user-card glass-panel">
                <div className="admin-user-info">
                  <h3>{user.displayName || user.email}</h3>
                  <p>Kode: {user.userCode}</p>
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                  <p>Tier: {user.tier}</p>
                  <p>Level: {user.level}</p>
                  <p>Exp: {user.exp}</p>
                  <p>Diamond: {user.diamonds}</p>
                  <p>Title: {user.title || '-'}</p>
                </div>

                <div className="admin-card-actions">
                  <button
                    className="secondary-button"
                    onClick={() => toggleEditPanel(user.uid)}
                  >
                    {selectedUserUid === user.uid ? 'Tutup Form' : 'Give / Add'}
                  </button>
                </div>

                {selectedUserUid === user.uid && (
                  <div className="admin-edit-form">
                    <label>
                      Level baru
                      <input
                        type="number"
                        min="0"
                        value={editValues[user.uid]?.level || ''}
                        onChange={(e) => handleEditChange(user.uid, 'level', e.target.value)}
                      />
                    </label>
                    <label>
                      Tambah Exp
                      <input
                        type="number"
                        min="0"
                        value={editValues[user.uid]?.addExp || ''}
                        onChange={(e) => handleEditChange(user.uid, 'addExp', e.target.value)}
                      />
                    </label>
                    <label>
                      Tambah Diamond
                      <input
                        type="number"
                        min="0"
                        value={editValues[user.uid]?.addDiamonds || ''}
                        onChange={(e) => handleEditChange(user.uid, 'addDiamonds', e.target.value)}
                      />
                    </label>
                    <label>
                      Title baru
                      <input
                        type="text"
                        value={editValues[user.uid]?.title || ''}
                        onChange={(e) => handleEditChange(user.uid, 'title', e.target.value)}
                      />
                    </label>
                    <label>
                      Tier baru
                      <input
                        type="text"
                        value={editValues[user.uid]?.tier || ''}
                        onChange={(e) => handleEditChange(user.uid, 'tier', e.target.value)}
                      />
                    </label>
                    <button className="primary-button" onClick={() => handleUpdateUser(user)}>
                      Simpan perubahan
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

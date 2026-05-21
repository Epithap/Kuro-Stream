import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Award, Users, Star, ChevronRight, UserPlus, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, userProfile, loading, logout, completeQuest, addFriend } = useAuth();
  const [friendCode, setFriendCode] = useState('');
  const [friendMessage, setFriendMessage] = useState('');
  const [friendError, setFriendError] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);

  if (loading) {
    return <div className="profile-page">Loading profil...</div>;
  }

  if (!user) {
    return (
      <div className="profile-page">
        <h2>Silakan login terlebih dahulu</h2>
        <p>Kembali ke beranda untuk masuk atau daftar akun.</p>
        <Link to="/" className="primary-button">Ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card glass-panel">
        <div className="profile-header">
          <div>
            <h1>Halo, {userProfile?.displayName || 'Pengguna'}</h1>
            <p className="profile-subtitle">Kode akun: {userProfile?.userCode || '00000'}</p>
          </div>
          <button className="secondary-button" onClick={logout}>Logout</button>
        </div>

        <div className="profile-summary-grid">
          <div className="profile-summary-item">
            <Sparkles size={20} />
            <p>Level</p>
            <strong>{userProfile?.level || 1}</strong>
          </div>
          <div className="profile-summary-item">
            <Award size={20} />
            <p>Exp</p>
            <strong>{userProfile?.exp || 0}</strong>
          </div>
          <div className="profile-summary-item">
            <ShieldCheck size={20} />
            <p>Tier</p>
            <strong>{userProfile?.tier || 'karbit'}</strong>
          </div>
          <div className="profile-summary-item">
            <Star size={20} />
            <p>Diamond</p>
            <strong>{userProfile?.diamonds || 0}</strong>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="primary-button"
            onClick={completeQuest}
            disabled={(userProfile?.questDailyCount || 0) >= 5}
          >
            {userProfile?.questDailyCount >= 5
              ? 'Kuota quest harian penuh'
              : 'Selesaikan quest harian (+20 diamond)'}
          </button>
          <small>{userProfile?.questDailyCount || 0}/5 quest hari ini</small>
        </div>

        <div className="profile-detail-row">
          <div className="profile-detail-box">
            <h3>Statistik</h3>
            <p>Quest selesai: {userProfile?.questsCompleted || 0}</p>
            <p>Role: {userProfile?.role || 'user'}</p>
            <p>Friends: {(userProfile?.friends || []).length}</p>
          </div>

          {userProfile?.role === 'admin' && (
            <div className="profile-detail-box admin-box">
              <h3>Admin</h3>
              <p>Halaman admin tersedia untuk memantau pengguna.</p>
              <Link to="/admin" className="secondary-button">
                Buka Dashboard Admin <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>

        <div className="profile-friends glass-panel">
          <div className="friends-header">
            <h3>Tambah Teman</h3>
            <p>Masukkan kode pengguna teman untuk saling terhubung.</p>
          </div>
          <div className="friends-form">
            <input
              type="text"
              placeholder="Contoh: 00002"
              value={friendCode}
              onChange={(e) => setFriendCode(e.target.value)}
            />
            <button
              className="primary-button"
              onClick={async () => {
                setFriendMessage('');
                setFriendError('');
                setAddingFriend(true);
                try {
                  const friend = await addFriend(friendCode);
                  setFriendMessage(`Berhasil menambahkan ${friend.displayName} (${friend.userCode}) sebagai teman.`);
                  setFriendCode('');
                } catch (error) {
                  setFriendError(error.message || 'Gagal menambahkan teman.');
                } finally {
                  setAddingFriend(false);
                }
              }}
              disabled={addingFriend || !friendCode.trim()}
            >
              {addingFriend ? 'Menambahkan...' : 'Tambah Teman'}
            </button>
          </div>
          {friendMessage && (
            <div className="friend-notice success">
              <Check size={16} /> {friendMessage}
            </div>
          )}
          {friendError && (
            <div className="friend-notice error">
              <AlertCircle size={16} /> {friendError}
            </div>
          )}

          <div className="friend-list">
            <h4>Daftar Teman</h4>
            {userProfile?.friends?.length > 0 ? (
              <ul>
                {userProfile.friends.map((friend) => (
                  <li key={friend.uid}>
                    <Users size={16} />
                    <strong>{friend.displayName}</strong>
                    <span>{friend.userCode}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Belum ada teman. Tambahkan teman dengan kode pengguna mereka.</p>
            )}
          </div>
        </div>
      </div>

      <div className="profile-navigation glass-panel">
        <h2>Mulai</h2>
        <div className="profile-links">
          <Link to="/anime" className="action-card">
            <div>
              <p>Tonton Anime</p>
              <strong>Masuk ke katalog anime</strong>
            </div>
            <ChevronRight />
          </Link>

          <Link to="/manga" className="action-card">
            <div>
              <p>Baca Manga</p>
              <strong>Masuk ke katalog manga</strong>
            </div>
            <ChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;

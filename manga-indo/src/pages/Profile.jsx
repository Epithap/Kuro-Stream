import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Award, Users, Star, ChevronRight, UserPlus, Check, AlertCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, userProfile, loading, logout, completeQuest, addFriend } = useAuth();
  const [friendCode, setFriendCode] = useState('');
  const [friendMessage, setFriendMessage] = useState('');
  const [friendError, setFriendError] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);

  const dailyQuests = userProfile?.dailyQuests || [];
  const nextQuest = dailyQuests.find((quest) => !quest.completed);

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

  const totalQuestCount = dailyQuests.length;
  const completedQuestCount = dailyQuests.filter((quest) => quest.completed).length;
  const progressPercent = totalQuestCount ? Math.round((completedQuestCount / totalQuestCount) * 100) : 0;

  return (
    <div className="profile-page">
      <div className="profile-hero glass-panel">
        <div className="profile-hero-left">
          <div className="profile-avatar-large">
            <User size={42} />
          </div>
          <div>
            <h1>Halo, {userProfile?.displayName || 'Pengguna'}</h1>
            <p className="profile-subtitle">Kode akun: {userProfile?.userCode || '00000'}</p>
            <div className="profile-badges">
              <span className="badge role-badge">{userProfile?.role || 'User'}</span>
              <span className="badge tier-badge">{userProfile?.tier || 'karbit'}</span>
            </div>
          </div>
        </div>

        <div className="profile-hero-right">
          <button className="secondary-button" onClick={logout}>
            Logout
          </button>
          <div className="profile-progress-card">
            <div className="progress-label">Progress Quest Harian</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="progress-details">
              <span>{completedQuestCount}/{totalQuestCount} selesai</span>
              <strong>{progressPercent}%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-stats-grid">
        <div className="stat-card glass-panel">
          <span>Level</span>
          <strong>{userProfile?.level || 1}</strong>
        </div>
        <div className="stat-card glass-panel">
          <span>Exp</span>
          <strong>{userProfile?.exp || 0}</strong>
        </div>
        <div className="stat-card glass-panel">
          <span>Diamond</span>
          <strong>{userProfile?.diamonds || 0}</strong>
        </div>
        <div className="stat-card glass-panel">
          <span>Title</span>
          <strong>{userProfile?.title || 'Novice'}</strong>
        </div>
      </div>

      <div className="profile-quests glass-panel">
          <div className="profile-quests-header">
            <div>
              <h3>Quest Harian</h3>
              <p>Reset setiap 24 jam. Kumpulkan EXP dan Diamond dari 5 quest harian.</p>
            </div>
            <span>{completedQuestCount}/5 selesai</span>
          </div>

          <div className="profile-quest-list">
            {dailyQuests.map((quest) => (
              <div
                key={quest.id}
                className={`profile-quest-item ${quest.completed ? 'completed' : ''}`}
              >
                <div>
                  <strong>{quest.title}</strong>
                  <p>{quest.description}</p>
                </div>
                <div className="profile-quest-status">
                  <span>{quest.progress}/{quest.total}</span>
                  <span>+{quest.rewardExp} XP</span>
                  <span>+{quest.rewardDiamonds} Diamond</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className="primary-button"
            onClick={() => completeQuest(nextQuest?.id)}
            disabled={!nextQuest}
          >
            {nextQuest ? `Tuntaskan: ${nextQuest.title}` : 'Semua quest harian selesai'}
          </button>
          <small>
            {nextQuest
              ? `Quest berikutnya: ${nextQuest.title}`
              : 'Tunggu reset 24 jam untuk quest baru.'}
          </small>
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

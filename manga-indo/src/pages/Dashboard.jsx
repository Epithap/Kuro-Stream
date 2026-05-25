import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Sparkles,
  Users,
  Trophy,
  Tv,
  BookOpen,
  LogOut,
  Plus,
  Heart,
  MessageCircle,
  Send,
  Star,
  Zap,
  Award,
} from 'lucide-react';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [friends, setFriends] = useState([
    { id: 1, name: 'Anime Lover', status: 'online', avatar: 'AL' },
    { id: 2, name: 'Manga King', status: 'online', avatar: 'MK' },
    { id: 3, name: 'Stream Master', status: 'offline', avatar: 'SM' },
  ]);
  const quests = userProfile?.dailyQuests || [];
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [adminTarget, setAdminTarget] = useState('');
  const [targetUser, setTargetUser] = useState(null);
  const [adminEdits, setAdminEdits] = useState({ level: '', exp: '', diamonds: '', title: '', tier: '' });
  const [adminMessage, setAdminMessage] = useState('');
  const [adminError, setAdminError] = useState('');
  const [searchingTarget, setSearchingTarget] = useState(false);
  const [adminSaving, setAdminSaving] = useState(false);
  const [nobarSessions, setNobarSessions] = useState([
    { id: 1, title: 'One Piece Chapter 1050', participants: 5, status: 'ongoing', host: 'Anime Lover' },
    { id: 2, title: 'Jujutsu Kaisen Episode 45', participants: 8, status: 'upcoming', host: 'Stream Master' },
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (friendEmail.trim()) {
      setFriends([
        ...friends,
        { id: friends.length + 1, name: friendEmail.split('@')[0], status: 'offline', avatar: friendEmail.charAt(0).toUpperCase() },
      ]);
      setFriendEmail('');
      setShowAddFriend(false);
    }
  };

  const isAdmin = userProfile?.role === 'admin';

  const getAdminTargetQuery = (value) => {
    const trimmed = String(value || '').trim();
    if (!trimmed) return null;
    if (trimmed.includes('@')) {
      return query(collection(db, 'users'), where('email', '==', trimmed.toLowerCase()));
    }
    return query(collection(db, 'users'), where('userCode', '==', trimmed));
  };

  const searchAdminTarget = async () => {
    setAdminMessage('');
    setAdminError('');
    setTargetUser(null);
    if (!adminTarget.trim()) {
      setAdminError('Masukkan kode atau email target terlebih dahulu.');
      return;
    }
    const targetQuery = getAdminTargetQuery(adminTarget);
    if (!targetQuery) {
      setAdminError('Masukkan kode atau email target yang valid.');
      return;
    }

    setSearchingTarget(true);
    try {
      const snapshot = await getDocs(targetQuery);
      if (snapshot.empty) {
        setAdminError('Pengguna dengan data tersebut tidak ditemukan.');
        return;
      }
      const docItem = snapshot.docs[0];
      setTargetUser({ uid: docItem.id, ...docItem.data() });
      setAdminMessage('Pengguna ditemukan. Edit data di bawah ini.');
    } catch (error) {
      console.error('Admin search error:', error);
      setAdminError('Gagal mencari pengguna. Coba lagi.');
    } finally {
      setSearchingTarget(false);
    }
  };

  const handleAdminFieldChange = (field, value) => {
    setAdminEdits((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAdminSave = async () => {
    setAdminMessage('');
    setAdminError('');
    if (!targetUser) {
      setAdminError('Pilih pengguna target terlebih dahulu.');
      return;
    }

    const updates = {};
    if (adminEdits.level !== '') {
      const parsed = Number(adminEdits.level);
      if (Number.isFinite(parsed) && parsed >= 0) {
        updates.level = parsed;
      } else {
        setAdminError('Level harus berupa angka valid.');
        return;
      }
    }

    if (adminEdits.exp !== '') {
      const parsed = Number(adminEdits.exp);
      if (Number.isFinite(parsed) && parsed > 0) {
        updates.exp = (targetUser.exp || 0) + parsed;
      } else {
        setAdminError('Exp harus angka positif.');
        return;
      }
    }

    if (adminEdits.diamonds !== '') {
      const parsed = Number(adminEdits.diamonds);
      if (Number.isFinite(parsed) && parsed > 0) {
        updates.diamonds = (targetUser.diamonds || 0) + parsed;
      } else {
        setAdminError('Diamond harus angka positif.');
        return;
      }
    }

    if (adminEdits.title.trim() !== '') {
      updates.title = adminEdits.title.trim();
    }

    if (adminEdits.tier.trim() !== '') {
      updates.tier = adminEdits.tier.trim();
    }

    if (!Object.keys(updates).length) {
      setAdminError('Isi setidaknya satu nilai untuk diperbarui.');
      return;
    }

    setAdminSaving(true);
    try {
      await updateDoc(doc(db, 'users', targetUser.uid), updates);
      setAdminMessage('Perubahan berhasil disimpan.');
      setTargetUser((prev) => ({ ...prev, ...updates }));
      setAdminEdits({ level: '', exp: '', diamonds: '', title: '', tier: '' });
    } catch (error) {
      console.error('Admin save error:', error);
      setAdminError('Gagal menyimpan perubahan. Coba lagi.');
    } finally {
      setAdminSaving(false);
    }
  };

  const handleSelectMode = (mode) => {
    localStorage.setItem('nusamanga_mode', mode);
    navigate(mode === 'manga' ? '/manga' : '/anime');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
      </div>

      <div className="dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">
              <Sparkles size={24} />
              Kuro<span className="text-gradient">Stream</span>
            </h1>
          </div>
          <div className="header-right">
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </header>

        {/* Main Layout */}
        <div className="dashboard-layout">
          {/* Left Sidebar - Profile & Quick Actions */}
          <aside className="dashboard-sidebar">
            {/* Profile Card */}
            <div className="profile-card glass-panel">
              <div className="profile-avatar-section">
                <div className="profile-avatar">
                  <User size={40} />
                </div>
                <div className="profile-info">
                  <h2>{userProfile?.displayName || 'Pengguna'}</h2>
                  <p className="user-code">ID: {userProfile?.userCode || '00000'}</p>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-label">Level</span>
                  <span className="stat-value">{userProfile?.level || 1}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Tier</span>
                  <span className="stat-value tier-badge">{userProfile?.tier || 'Karbit'}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Title</span>
                  <span className="stat-value">{userProfile?.title || 'Novice'}</span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="profile-action-btn" onClick={() => navigate('/profile')}>
                  Profil Lengkap
                </button>
                {isAdmin && (
                  <button
                    className="profile-action-btn admin-toggle-btn"
                    onClick={() => setShowAdminTools((prev) => !prev)}
                  >
                    {showAdminTools ? 'Sembunyikan Admin Tools' : 'Buka Admin Tools'}
                  </button>
                )}
              </div>
            </div>

            {/* Mode Selection - Big Buttons */}
            <div className="mode-selection">
              <button
                className="mode-button manga-mode glass-panel"
                onClick={() => handleSelectMode('manga')}
              >
                <BookOpen size={32} />
                <span>Baca Manga</span>
              </button>
              <button
                className="mode-button anime-mode glass-panel"
                onClick={() => handleSelectMode('anime')}
              >
                <Tv size={32} />
                <span>Tonton Anime</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="dashboard-main">
            {/* Tab Navigation */}
            <div className="dashboard-tabs">
              <button
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <Trophy size={18} />
                Quest & Achievement
              </button>
              <button
                className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
                onClick={() => setActiveTab('friends')}
              >
                <Users size={18} />
                Pertemanan ({friends.length})
              </button>
              <button
                className={`tab-button ${activeTab === 'nobar' ? 'active' : ''}`}
                onClick={() => setActiveTab('nobar')}
              >
                <Send size={18} />
                Nobar (Watch Together)
              </button>
            </div>

            {isAdmin && showAdminTools && (
              <section className="admin-tools-panel glass-panel">
                <div className="admin-tools-header">
                  <h3 className="section-title">Admin Tools</h3>
                  <p>Search kode / email pengguna, lalu tambahkan level, exp, diamond, title, atau tier.</p>
                </div>

                <div className="admin-tools-search">
                  <input
                    type="text"
                    placeholder="Cari target: kode ID atau email"
                    value={adminTarget}
                    onChange={(e) => setAdminTarget(e.target.value)}
                  />
                  <button className="primary-button" onClick={searchAdminTarget} disabled={searchingTarget}>
                    {searchingTarget ? 'Mencari...' : 'Cari Pengguna'}
                  </button>
                </div>

                {adminMessage && <div className="admin-notice success">{adminMessage}</div>}
                {adminError && <div className="admin-notice error">{adminError}</div>}

                {targetUser && (
                  <div className="admin-target-card">
                    <div className="target-info">
                      <h4>{targetUser.displayName || targetUser.email}</h4>
                      <p>Kode: {targetUser.userCode || '-'}</p>
                      <p>Email: {targetUser.email}</p>
                    </div>

                    <div className="admin-fields-grid">
                      <label>
                        Level baru
                        <input
                          type="number"
                          min="0"
                          value={adminEdits.level}
                          onChange={(e) => handleAdminFieldChange('level', e.target.value)}
                          placeholder="Contoh: 5"
                        />
                      </label>
                      <label>
                        Tambah Exp
                        <input
                          type="number"
                          min="0"
                          value={adminEdits.exp}
                          onChange={(e) => handleAdminFieldChange('exp', e.target.value)}
                          placeholder="Contoh: 50"
                        />
                      </label>
                      <label>
                        Tambah Diamond
                        <input
                          type="number"
                          min="0"
                          value={adminEdits.diamonds}
                          onChange={(e) => handleAdminFieldChange('diamonds', e.target.value)}
                          placeholder="Contoh: 10"
                        />
                      </label>
                      <label>
                        Title baru
                        <input
                          type="text"
                          value={adminEdits.title}
                          onChange={(e) => handleAdminFieldChange('title', e.target.value)}
                          placeholder="Contoh: Elite"
                        />
                      </label>
                      <label>
                        Tier baru
                        <input
                          type="text"
                          value={adminEdits.tier}
                          onChange={(e) => handleAdminFieldChange('tier', e.target.value)}
                          placeholder="Contoh: Premium"
                        />
                      </label>
                    </div>

                    <button
                      className="primary-button"
                      onClick={handleAdminSave}
                      disabled={adminSaving}
                    >
                      {adminSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Tab Content */}
            <div className="tab-content">
              {/* Quest & Achievement Tab */}
              {activeTab === 'profile' && (
                <section className="tab-panel">
                  <h3 className="section-title">Quest Aktif</h3>
                  <div className="quests-grid">
                    {quests.length === 0 ? (
                      <div className="quest-card glass-panel">
                        <div className="quest-title">Quest harian belum tersedia.</div>
                        <p>Silakan login untuk melihat dan mengumpulkan diamonds.</p>
                      </div>
                    ) : (
                      quests.map((quest) => (
                        <div key={quest.id} className="quest-card glass-panel">
                          <div className="quest-header">
                            <div className="quest-icon">
                              <Zap size={20} />
                            </div>
                            {quest.completed && <div className="quest-completed-badge">✓</div>}
                          </div>
                          <h4 className="quest-title">{quest.title}</h4>
                          <p className="quest-summary">{quest.description}</p>
                          <div className="quest-progress">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                              />
                            </div>
                            <span className="progress-text">
                              {quest.progress}/{quest.total}
                            </span>
                          </div>
                          <div className="quest-reward">
                            <Star size={16} />
                            <span>+{quest.rewardExp} XP</span>
                            <span>•</span>
                            <span>+{quest.rewardDiamonds} Diamond</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}

              {/* Friends Tab */}
              {activeTab === 'friends' && (
                <section className="tab-panel">
                  <div className="friends-header">
                    <h3 className="section-title">Daftar Teman</h3>
                    <button
                      className="add-friend-btn primary-button"
                      onClick={() => setShowAddFriend(!showAddFriend)}
                    >
                      <Plus size={16} />
                      Tambah Teman
                    </button>
                  </div>

                  {showAddFriend && (
                    <form className="add-friend-form glass-panel" onSubmit={handleAddFriend}>
                      <input
                        type="text"
                        placeholder="Masukkan kode ID teman"
                        value={friendEmail}
                        onChange={(e) => setFriendEmail(e.target.value)}
                        required
                      />
                      <button type="submit" className="primary-button">
                        Tambah Teman
                      </button>
                    </form>
                  )}

                  <div className="friends-list">
                    {friends.map((friend) => (
                      <div key={friend.id} className="friend-card glass-panel">
                        <div className="friend-info">
                          <div className="friend-avatar">{friend.avatar}</div>
                          <div className="friend-details">
                            <h4>{friend.name}</h4>
                            <p className={`friend-status ${friend.status}`}>
                              {friend.status === 'online' ? '● Online' : '● Offline'}
                            </p>
                          </div>
                        </div>
                        <div className="friend-actions">
                          <button className="friend-action-btn chat-btn" title="Chat">
                            <MessageCircle size={16} />
                          </button>
                          <button className="friend-action-btn invite-btn" title="Invite">
                            <Heart size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Nobar Tab */}
              {activeTab === 'nobar' && (
                <section className="tab-panel">
                  <div className="nobar-header">
                    <h3 className="section-title">Sesi Nobar (Watch Together)</h3>
                    <button className="create-nobar-btn primary-button">
                      <Plus size={16} />
                      Buat Sesi Baru
                    </button>
                  </div>

                  <div className="nobar-list">
                    {nobarSessions.map((session) => (
                      <div key={session.id} className="nobar-card glass-panel">
                        <div className="nobar-content">
                          <div className="nobar-info">
                            <h4>{session.title}</h4>
                            <p className="nobar-host">Host: {session.host}</p>
                            <p className="nobar-participants">
                              👥 {session.participants} Peserta
                            </p>
                          </div>
                          <div className={`nobar-status ${session.status}`}>
                            {session.status === 'ongoing'
                              ? 'Sedang Berlangsung'
                              : 'Akan Datang'}
                          </div>
                        </div>
                        <button className="join-nobar-btn primary-button">
                          Bergabung
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

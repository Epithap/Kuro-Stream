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
  const [quests, setQuests] = useState([
    { id: 1, title: 'Baca 5 Chapter Manga', progress: 3, total: 5, reward: 100, icon: 'BookOpen' },
    { id: 2, title: 'Tonton 1 Episode Anime', progress: 1, total: 1, reward: 50, icon: 'Tv', completed: true },
    { id: 3, title: 'Tambah 3 Teman', progress: 1, total: 3, reward: 75, icon: 'Users' },
  ]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
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
                  <span className="stat-label">Poin</span>
                  <span className="stat-value">1,250</span>
                </div>
              </div>

              <div className="profile-actions">
                <button className="profile-action-btn" onClick={() => navigate('/profile')}>
                  Profil Lengkap
                </button>
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

            {/* Tab Content */}
            <div className="tab-content">
              {/* Quest & Achievement Tab */}
              {activeTab === 'profile' && (
                <section className="tab-panel">
                  <h3 className="section-title">Quest Aktif</h3>
                  <div className="quests-grid">
                    {quests.map((quest) => (
                      <div key={quest.id} className="quest-card glass-panel">
                        <div className="quest-header">
                          <div className="quest-icon">
                            <Zap size={20} />
                          </div>
                          {quest.completed && <div className="quest-completed-badge">✓</div>}
                        </div>
                        <h4 className="quest-title">{quest.title}</h4>
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
                          <span>+{quest.reward} XP</span>
                        </div>
                      </div>
                    ))}
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
                        type="email"
                        placeholder="Masukkan email teman"
                        value={friendEmail}
                        onChange={(e) => setFriendEmail(e.target.value)}
                        required
                      />
                      <button type="submit" className="primary-button">
                        Kirim Undangan
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

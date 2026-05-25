import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, authError, clearAuthError } = useAuth();
  const modeParam = searchParams.get('mode');
  const [authMode, setAuthMode] = useState(modeParam === 'register' ? 'register' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAdminButton, setShowAdminButton] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setShowAdminButton(false);
    clearAuthError();
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await login(email, password);

        if (email.trim().toLowerCase() === 'upik@gmail.com') {
          setSuccessMessage('Login admin berhasil! Klik tombol di bawah untuk membuka Dashboard Admin.');
          setShowAdminButton(true);
        } else {
          setSuccessMessage('Login berhasil! Mengalihkan...');
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      } else {
        await register(email, password, displayName);
        setSuccessMessage('Registrasi berhasil! Mengalihkan...');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (error) {
      console.error('Auth submit error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setSuccessMessage('');
    clearAuthError();
  };

  return (
    <div className="login-container">
      <div className="login-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
      </div>

      <div className="login-content">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="branding-header">
            <div className="branding-badge">
              <Sparkles size={16} />
              <span>Platform Hiburan #1 Indonesia</span>
            </div>
            <h1 className="branding-title">
              Kuro<span className="text-gradient">Stream</span>
            </h1>
            <p className="branding-subtitle">
              Satu tempat untuk semua hiburan anime & manga favoritmu
            </p>
          </div>

          <div className="branding-features">
            <div className="feature">
              <CheckCircle size={20} />
              <div>
                <h3>Ribuan Konten</h3>
                <p>Manga dan anime terlengkap</p>
              </div>
            </div>
            <div className="feature">
              <CheckCircle size={20} />
              <div>
                <h3>Kualitas HD</h3>
                <p>Nikmati gambar jernih 1080p+</p>
              </div>
            </div>
            <div className="feature">
              <CheckCircle size={20} />
              <div>
                <h3>Streaming Lancar</h3>
                <p>Tanpa iklan mengganggu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="login-form-section">
          <div className="form-card glass-panel">
            <div className="form-header">
              <h2>{authMode === 'login' ? 'Masuk ke Akun' : 'Buat Akun Baru'}</h2>
              <p>
                {authMode === 'login'
                  ? 'Masukkan email dan password untuk melanjutkan'
                  : 'Daftar sekarang dan dapatkan kode pengguna unik'}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authMode === 'register' && (
                <div className="form-group">
                  <label>
                    <User size={18} />
                    <span>Nama Pengguna</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nama tampilan di profil"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>
                  <Mail size={18} />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {(authMode === 'register' || authMode === 'login') &&
                email.trim().toLowerCase() === 'upik@gmail.com' && (
                  <div className="auth-hint">
                    Khusus admin: masuk dengan <strong>upik@gmail.com</strong> dan password <strong>12345678</strong>.
                  </div>
                )}

              <div className="form-group">
                <label>
                  <Lock size={18} />
                  <span>Password</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {authError && <div className="auth-error">{authError}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}
              {showAdminButton && (
                <button
                  type="button"
                  className="submit-button secondary-button"
                  onClick={() => navigate('/admin')}
                >
                  Buka Dashboard Admin
                </button>
              )}

              <button
                type="submit"
                className="submit-button primary-button"
                disabled={authLoading}
              >
                {authLoading
                  ? 'Loading...'
                  : authMode === 'login'
                  ? 'Masuk'
                  : 'Buat Akun'}
              </button>
            </form>

            <div className="form-divider">
              <span>atau</span>
            </div>

            <button
              type="button"
              className="toggle-mode-button"
              onClick={toggleAuthMode}
            >
              {authMode === 'login'
                ? "Belum punya akun? Daftar sekarang"
                : 'Sudah punya akun? Masuk'}
            </button>
          </div>

          <div className="form-footer">
            <p>
              Dengan melanjutkan, Anda setuju dengan{' '}
              <a href="#">Syarat & Ketentuan</a> kami
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

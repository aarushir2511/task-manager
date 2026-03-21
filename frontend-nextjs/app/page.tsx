'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const API_BASE = 'http://localhost:5000';

type Mode = 'login' | 'register';

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return {
      label: 'Weak',
      textColor: 'text-red-500',
      barColor: 'bg-red-400',
      width: '33%',
    };
  }

  if (score <= 4) {
    return {
      label: 'Medium',
      textColor: 'text-amber-500',
      barColor: 'bg-amber-400',
      width: '66%',
    };
  }

  return {
    label: 'Strong',
    textColor: 'text-emerald-500',
    barColor: 'bg-emerald-400',
    width: '100%',
  };
}

export default function SignUpLoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      if (mode === 'register' && strength.label === 'Weak') {
        toast.error(
          'Password is too weak. Use uppercase letters, numbers, and symbols.'
        );
        setLoading(false);
        return;
      }

      const endpoint =
        mode === 'register'
          ? `${API_BASE}/auth/register`
          : `${API_BASE}/auth/login`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type') || '';

      if (!contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        toast.error('Backend returned an invalid response');
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data?.msg || `${mode === 'register' ? 'Registration' : 'Login'} failed`
        );
        return;
      }

      if (mode === 'register') {
        toast.success(data?.msg || 'Registered successfully!');
        setMode('login');
        setPassword('');
        return;
      }

      if (data?.accessToken) {
        localStorage.setItem('token', data.accessToken);
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error(data?.msg || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(
        'Could not connect to backend. Make sure backend is running on port 5000.'
      );
    } finally {
      setLoading(false);
    }
  };

  const submitButton = (
    <button
      onClick={handleSubmit}
      disabled={loading}
      style={{
        backgroundColor: loading ? '#93c5fd' : '#2563eb',
        color: '#ffffff',
        width: '100%',
        padding: '12px 16px',
        borderRadius: '12px',
        fontWeight: 700,
        marginTop: '8px',
        cursor: loading ? 'not-allowed' : 'pointer',
        border: 'none',
        boxShadow: '0 10px 20px rgba(37, 99, 235, 0.18)',
      }}
    >
      {loading
        ? mode === 'login'
          ? 'Logging in...'
          : 'Creating account...'
        : mode === 'login'
        ? 'Login'
        : 'Create account'}
    </button>
  );

  const passwordStrengthUI =
    mode === 'register' && password ? (
      <div className="mt-2">
        <div className="w-full h-2 rounded-full bg-violet-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${strength.barColor}`}
            style={{ width: strength.width }}
          />
        </div>
        <p className={`text-sm mt-2 font-semibold ${strength.textColor}`}>
          Password strength: {strength.label}
        </p>
      </div>
    ) : null;

  const inputClasses =
    'w-full rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4 lg:p-0">
      <div className="w-full max-w-md lg:hidden">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10l4 4 8-8"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            TaskFlow
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8">
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
              />
              {passwordStrengthUI}
            </div>

            {submitButton}
          </div>

          <p className="text-sm text-gray-500 text-center mt-5">
            {mode === 'login'
              ? "Don’t have an account?"
              : 'Already have an account?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-blue-600 font-semibold hover:underline"
            >
              {mode === 'login' ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-full min-h-screen">
        <div className="flex-1 bg-gradient-to-br from-indigo-700 via-indigo-500 to-violet-500 flex flex-col justify-between p-12 xl:p-16 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10" />
            <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-white/10" />
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10l4 4 8-8"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              TaskFlow
            </span>
          </div>

          <div className="relative z-10 max-w-md">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              Organize your work,
              <br />
              <span className="text-indigo-100">amplify your focus.</span>
            </h1>
            <p className="text-indigo-100 text-lg leading-relaxed mb-10">
              TaskFlow helps teams and individuals manage tasks effortlessly —
              from quick to-dos to complex projects.
            </p>

            <div className="space-y-4">
              {[
                { icon: '✓', text: 'Intuitive task management with smart filters' },
                { icon: '✓', text: 'Real-time progress tracking and completion stats' },
                { icon: '✓', text: 'Clean, distraction-free workspace' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">{item.icon}</span>
                  </div>
                  <span className="text-indigo-100 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-indigo-100 text-sm italic">
              &ldquo;The secret of getting ahead is getting started.&rdquo;
            </p>
            <p className="text-indigo-200 text-xs mt-1">— Mark Twain</p>
          </div>
        </div>

        <div className="w-full max-w-lg xl:max-w-xl flex items-center justify-center p-10 xl:p-16 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">
                Get started
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome to TaskFlow
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8">
              <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    mode === 'login'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    mode === 'register'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Register
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClasses}
                  />
                  {passwordStrengthUI}
                </div>

                {submitButton}
              </div>

              <p className="text-sm text-gray-500 text-center mt-5">
                {mode === 'login'
                  ? "Don’t have an account?"
                  : 'Already have an account?'}{' '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {mode === 'login' ? 'Register' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
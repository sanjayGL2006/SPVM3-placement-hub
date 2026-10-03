import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Lock, Mail, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../../../shared/components/ui/Button';
import { ThemeToggle } from '../../../shared/components/ThemeToggle';
import toast from 'react-hot-toast';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME_MS = 60000; // 1 minute lockout

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field validation error states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Rate limiting states
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    let valid = true;
    setEmailError(null);
    setPasswordError(null);
    setFormError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError('Email address is required.');
      valid = false;
    } else if (trimmedEmail.length > 254) {
      setEmailError('Email must not exceed 254 characters.');
      valid = false;
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address (e.g. name@college.edu).');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    } else if (password.length > 128) {
      setPasswordError('Password must not exceed 128 characters.');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) {
      toast.error('Too many failed attempts. Please try again in 1 minute.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const res = login(email, password);
        setIsLoading(false);

        if (res.success) {
          setFailedAttempts(0);
          toast.success('Signed in successfully!');
          const from = (location.state as any)?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        } else {
          const newCount = failedAttempts + 1;
          setFailedAttempts(newCount);

          if (newCount >= MAX_ATTEMPTS) {
            setIsLockedOut(true);
            setFormError('Too many failed attempts. Account locked for 60 seconds.');
            toast.error('Account temporarily locked due to 5 failed attempts.');
            setTimeout(() => {
              setIsLockedOut(false);
              setFailedAttempts(0);
              setFormError(null);
            }, LOCKOUT_TIME_MS);
          } else {
            const genericMsg = 'Invalid email or password.';
            setFormError(genericMsg);
            toast.error(genericMsg);
          }
        }
      } catch (err) {
        setIsLoading(false);
        setFormError('A network or server error occurred. Please try again.');
        toast.error('Connection failure. Please retry.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAFAF9] dark:bg-[#0F0F0F] text-stone-900 dark:text-stone-50 transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Left 55% - Pinterest Academic Visual Showcase */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-12 text-white flex-col justify-between">
        {/* Background decorative glowing orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Placement Pro
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                Enterprise
              </span>
            </h1>
            <p className="text-xs text-indigo-100/80 font-medium">
              Enterprise AI Academic & Placement Management
            </p>
          </div>
        </div>

        {/* Hero Showcase Content */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-100">
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI-Native Career & Campus Ecosystem
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Empowering modern universities with intelligent placement pipelines.
          </h2>

          <p className="text-sm text-indigo-100/90 leading-relaxed">
            Real-time analytics, automated ATS resume scoring, multi-round drive trackers, and strict role-based data governance for college leadership and students.
          </p>

          {/* Floating Feature Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-2xl font-bold">62.4%</div>
              <div className="text-xs text-indigo-100/80 mt-0.5">Average Placement Rate</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-2xl font-bold">₹24.0 LPA</div>
              <div className="text-xs text-indigo-100/80 mt-0.5">Highest Package Offered</div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 text-xs text-indigo-200/70 flex items-center justify-between border-t border-white/10 pt-6">
          <span>Trusted by Premier Universities & Tier-1 Institutions</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" /> WCAG 2.1 AA & RBAC Secured
          </span>
        </div>
      </div>

      {/* Right 45% - Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Brand Title */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50">Placement Pro</h2>
              <p className="text-xs text-stone-500">Sign in to your account</p>
            </div>
          </div>

          <div className="space-y-1 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50">
              Welcome back
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Enter your institutional credentials to access your placement dashboard.
            </p>
          </div>

          {/* Form-level alert banner */}
          {formError && (
            <div
              role="alert"
              className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="email-input"
                className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="email-input"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  aria-describedby={emailError ? 'email-error' : undefined}
                  aria-invalid={!!emailError}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                    if (formError) setFormError(null);
                  }}
                  placeholder="name@college.edu"
                  className={`w-full bg-stone-50 dark:bg-stone-900 border ${
                    emailError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-stone-200 dark:border-stone-700 focus:ring-indigo-500'
                  } rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 transition-all`}
                />
              </div>
              {emailError && (
                <p id="email-error" role="alert" className="text-xs text-red-500 mt-1 font-medium">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="password-input"
                className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider block"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  maxLength={128}
                  autoComplete="current-password"
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  aria-invalid={!!passwordError}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(null);
                    if (formError) setFormError(null);
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-stone-50 dark:bg-stone-900 border ${
                    passwordError
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-stone-200 dark:border-stone-700 focus:ring-indigo-500'
                  } rounded-xl pl-10 pr-10 py-2.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 transition-all`}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && (
                <p id="password-error" role="alert" className="text-xs text-red-500 mt-1 font-medium">
                  {passwordError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              pill
              isLoading={isLoading}
              disabled={isLoading || isLockedOut}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? 'Authenticating...' : isLockedOut ? 'Locked Out (60s)' : 'Sign In to Placement Pro'}
            </Button>
          </form>

          {/* Secure login footnote */}
          <div className="pt-2 text-center text-xs text-stone-400">
            Protected by role-based academic authentication & access control.
          </div>
        </div>
      </div>
    </div>
  );
};


import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn, Lock, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { RoleSelector } from '../components/auth/RoleSelector';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { selectedRole, setSelectedRole, login, showToast } = useAuth();
  const navigate = useNavigate();

  // Arriving from the Register page: show a confirmation and pre-fill only the email the person just registered.
  const location = useLocation();
  const justRegistered = (location.state as { registeredEmail?: string } | null)?.registeredEmail;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
    // Inputs stay read-only until clicked, so the browser cannot auto-fill saved logins on load.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

 const handleRoleChange = (role: UserRole) => {
  setSelectedRole(role);
  setErrorMsg(null);
};
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    const remember = (e.currentTarget.elements.namedItem('remember') as HTMLInputElement | null)?.checked ?? true;
    setSubmitting(true);
    const error = await login(email.trim(), password, selectedRole, remember);
    setSubmitting(false);
    if (error) {
      setErrorMsg(error);
      return;
    }

    navigate(
      selectedRole === 'Volunteer'
        ? '/volunteer/dashboard'
        : selectedRole === 'NGO'
        ? '/ngo/dashboard'
        : selectedRole === 'Government Official'
        ? '/government/dashboard'
        : '/victim/dashboard'
    );
  };

  const handleAuxiliaryAction = (actionName: string) => {
    showToast(`${actionName}: Feature active.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top back navigation */}
      <div className="max-w-md w-full mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to ResQChain Home
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-lg w-full mx-auto my-auto py-4">
        <Card padding="lg" className="shadow-lg border-slate-200/90 bg-white">
          
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white shadow-md">
                <ShieldAlert className="w-6 h-6 text-sos-500" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-navy-900 font-sans">
                RESQ<span className="text-sos-600">CHAIN</span>
              </span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Welcome to ResQChain
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your role and sign in to access emergency channels
            </p>
          </div>

          {/* Role selection pills */}
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <RoleSelector
              selectedRole={selectedRole}
              onSelectRole={handleRoleChange}
            />

            {justRegistered && !errorMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Account created successfully. Please log in with your email and password.</span>
              </div>
            )}

            {/* Error Message if any */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-4 pt-1">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                name="resq-login-email"
                autoComplete="off"
                readOnly={!armed}
                onFocus={() => setArmed(true)}
              />

              {/* Password field */}
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                name="resq-login-password"
                autoComplete="new-password"
                readOnly={!armed}
                onFocus={() => setArmed(true)}
                
              />
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  name="remember"
                  defaultChecked
                  className="rounded border-slate-300 text-navy-900 focus:ring-navy-800 h-4 w-4"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => handleAuxiliaryAction('Forgot Password')}
                className="font-medium text-navy-800 hover:text-navy-950 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={submitting}
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Login to Command
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-2 text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-navy-900 hover:underline cursor-pointer">
                Sign Up
              </Link>
            </div>
          </form>

          {/* Quick Mock Hint Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/70 -mx-6 -mb-6 p-4 rounded-b-xl text-center text-xs text-slate-500">
            <span className="font-semibold text-slate-700">All 4 Roles Active: </span>
            <strong className="text-navy-900">Victim</strong> • <strong className="text-emerald-800">Volunteer</strong> • <strong className="text-brand-800">NGO</strong> • <strong className="text-amber-800">Government</strong>
          </div>
        </Card>
      </div>

      {/* Bottom info */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-400">
        ResQChain State Disaster Management &amp; Unified Emergency Response System
      </div>
    </div>
  );
};

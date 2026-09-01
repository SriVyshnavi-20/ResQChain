import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { RoleSelector } from '../components/auth/RoleSelector';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const {
    selectedRole,
    setSelectedRole,
    loginAsVictim,
    loginAsVolunteer,
    loginAsNgo,
    loginAsGovernment,
    showToast
  } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    selectedRole === 'Government Official'
      ? 'rajesh.sdma@gov.in'
      : selectedRole === 'NGO'
      ? 'priya@redcrossrelief.org'
      : selectedRole === 'Volunteer'
      ? 'priya.nair@resqchain.org'
      : 'anvi123@org'
  );
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'Government Official') {
      setEmail('rajesh.sdma@gov.in');
    } else if (role === 'NGO') {
      setEmail('priya@redcrossrelief.org');
    } else if (role === 'Volunteer') {
      setEmail('priya.nair@resqchain.org');
    } else if (role === 'Victim') {
      setEmail('anvi123@org');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    if (selectedRole === 'Victim') {
      loginAsVictim();
      showToast('Welcome back, Anvitha! Logged in as Victim.');
      navigate('/victim/dashboard');
    } else if (selectedRole === 'Volunteer') {
      loginAsVolunteer();
      showToast('Welcome back, Priya Nair! Logged in as Volunteer.');
      navigate('/volunteer/dashboard');
    } else if (selectedRole === 'NGO') {
      loginAsNgo();
      showToast('Welcome back, Dr. Priya Sundaram! Logged in as NGO Partner.');
      navigate('/ngo/dashboard');
    } else if (selectedRole === 'Government Official') {
      loginAsGovernment();
      showToast('Welcome, R. Rajesh IAS! Logged into State Disaster Command Center.');
      navigate('/government/dashboard');
    }
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <RoleSelector
              selectedRole={selectedRole}
              onSelectRole={handleRoleChange}
            />

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
                leftIcon={<Mail className="w-4 h-4" />}
                helperText={
                  selectedRole === 'Victim'
                    ? 'Pre-filled: Victim (Anvitha Shetty)'
                    : selectedRole === 'Volunteer'
                    ? 'Pre-filled: Volunteer (Priya Nair)'
                    : selectedRole === 'NGO'
                    ? 'Pre-filled: NGO Partner (Dr. Priya Sundaram)'
                    : 'Pre-filled: Government Official (R. Rajesh IAS - SDMA)'
                }
              />

              {/* Password field */}
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
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
                leftIcon={<LogIn className="w-4 h-4" />}
              >
                Login to Command
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-2 text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleAuxiliaryAction('Registration')}
                className="font-semibold text-navy-900 hover:underline cursor-pointer"
              >
                Sign Up
              </button>
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

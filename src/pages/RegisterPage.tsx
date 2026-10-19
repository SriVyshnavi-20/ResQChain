import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, UserPlus, Lock, Mail, ArrowLeft, AlertCircle, User, Phone, MapPin, Building2, KeyRound } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { RoleSelector } from '../components/auth/RoleSelector';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/;

export const RegisterPage: React.FC = () => {
  const { selectedRole, setSelectedRole, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    organization: '',
    zone: '',
    designation: '',
    department: '',
    inviteCode: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (form.name.trim().length < 2) return setErrorMsg('Please enter your full name.');
    if (!EMAIL_PATTERN.test(form.email.trim())) return setErrorMsg('Please enter a valid email address.');
    if (selectedRole === 'NGO' && !form.organization.trim()) return setErrorMsg('Please enter your organization name.');
    if (form.password.length < 8) return setErrorMsg('Password must be at least 8 characters long.');
    if (form.password !== form.confirmPassword) return setErrorMsg('Passwords do not match.');

    setSubmitting(true);
    const error = await register({
      role: selectedRole,
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim() || undefined,
      location: form.location.trim() || undefined,
      organization: form.organization.trim() || undefined,
      zone: form.zone.trim() || undefined,
      designation: form.designation.trim() || undefined,
      department: form.department.trim() || undefined,
      inviteCode: form.inviteCode.trim() || undefined
    });
    setSubmitting(false);

    if (error) {
      setErrorMsg(error);
      return;
    }
    // Registration never signs you in: go to Login so the new account is used explicitly.
    navigate('/login', { replace: true, state: { registeredEmail: form.email.trim() } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>

      <div className="max-w-lg w-full mx-auto my-auto py-4">
        <Card padding="lg" className="shadow-lg border-slate-200/90 bg-white">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white shadow-md">
                <ShieldAlert className="w-6 h-6 text-sos-500" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-navy-900 font-sans">
                RESQ<span className="text-sos-600">CHAIN</span>
              </span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Create your account</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose your role and register with your own email and password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <RoleSelector selectedRole={selectedRole} onSelectRole={handleRoleChange} />

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-4 pt-1">
              <Input
                label="Full Name"
                type="text"
                required
                value={form.name}
                onChange={set('name')}
                placeholder="Enter your full name"
                autoComplete="name"
                leftIcon={<User className="w-4 h-4" />}
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                autoComplete="email"
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+91 98765 43210 (optional)"
                autoComplete="tel"
                leftIcon={<Phone className="w-4 h-4" />}
              />
              <Input
                label="Location"
                type="text"
                value={form.location}
                onChange={set('location')}
                placeholder="City / area (optional)"
                leftIcon={<MapPin className="w-4 h-4" />}
              />

              {selectedRole === 'Volunteer' && (
                <Input
                  label="Response Zone"
                  type="text"
                  value={form.zone}
                  onChange={set('zone')}
                  placeholder="Zone you can respond in (optional)"
                  leftIcon={<MapPin className="w-4 h-4" />}
                />
              )}

              {selectedRole === 'NGO' && (
                <Input
                  label="Organization Name"
                  type="text"
                  required
                  value={form.organization}
                  onChange={set('organization')}
                  placeholder="Registered NGO / organization name"
                  leftIcon={<Building2 className="w-4 h-4" />}
                />
              )}

              {selectedRole === 'Government Official' && (
                <>
                  <Input
                    label="Department"
                    type="text"
                    value={form.department}
                    onChange={set('department')}
                    placeholder="e.g. State Disaster Management Authority"
                    leftIcon={<Building2 className="w-4 h-4" />}
                  />
                  <Input
                    label="Designation"
                    type="text"
                    value={form.designation}
                    onChange={set('designation')}
                    placeholder="Your official designation"
                    leftIcon={<Building2 className="w-4 h-4" />}
                  />
                </>
              )}

              {(selectedRole === 'NGO' || selectedRole === 'Government Official') && (
                <Input
                  label="Invite Code"
                  type="text"
                  value={form.inviteCode}
                  onChange={set('inviteCode')}
                  placeholder="Provided by your administrator"
                  helperText="Required only if your deployment has invite codes enabled."
                  leftIcon={<KeyRound className="w-4 h-4" />}
                />
              )}

              <Input
                label="Password"
                type="password"
                required
                value={form.password}
                onChange={set('password')}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <Input
                label="Confirm Password"
                type="password"
                required
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                leftIcon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={submitting}
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                {submitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>

            <div className="text-center pt-2 text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-navy-900 hover:underline cursor-pointer">
                Login
              </Link>
            </div>
          </form>
        </Card>
      </div>

      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-400">
        ResQChain State Disaster Management &amp; Unified Emergency Response System
      </div>
    </div>
  );
};

import React from 'react';
import { UserRole } from '../../types';
import { Shield, User, HeartHandshake, Building2 } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

interface RoleOption {
  id: UserRole;
  label: string;
  subtitle: string;
  icon: React.ElementType;
  isActive: boolean;
}

const ROLES: RoleOption[] = [
  {
    id: 'Victim',
    label: 'Victim',
    subtitle: 'Request immediate emergency help & find shelters',
    icon: User,
    isActive: true
  },
  {
    id: 'Volunteer',
    label: 'Volunteer',
    subtitle: 'Offer on-ground rescue, first-aid & aid support',
    icon: Shield,
    isActive: true
  },
  {
    id: 'NGO',
    label: 'NGO',
    subtitle: 'Coordinate relief camps, inventory & supplies',
    icon: HeartHandshake,
    isActive: true
  },
  {
    id: 'Government Official',
    label: 'Government Official',
    subtitle: 'State incident command, alerts & multi-agency response',
    icon: Building2,
    isActive: true
  }
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Select Your Role
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={`flex items-start gap-3 p-3.5 rounded-xl text-left border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'border-navy-800 bg-navy-900/5 ring-1 ring-navy-800'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  isSelected ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-sm font-semibold truncate ${isSelected ? 'text-navy-900' : 'text-slate-800'}`}>
                    {role.label}
                  </span>
                  <span className="inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 leading-snug">
                  {role.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

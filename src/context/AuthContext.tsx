import React, { createContext, useContext, useState } from 'react';
import {
  User,
  UserRole,
  AvailabilityStatus,
  SosAlertResponse,
  AssistanceRequest,
  VolunteerAssignment,
  InventorySupply,
  NgoVolunteer,
  NgoCamp,
  VolunteerTask,
  Announcement,
  Shelter,
  UserPreferences,
  DisasterZone,
  GovernmentAgency
} from '../types';
import {
  MOCK_USERS,
  MOCK_REQUESTS,
  MOCK_VOLUNTEER_ASSIGNMENTS,
  MOCK_VOLUNTEER_TASKS,
  MOCK_INVENTORY_SUPPLIES,
  MOCK_NGO_VOLUNTEERS,
  MOCK_NGO_CAMPS,
  MOCK_ANNOUNCEMENTS,
  MOCK_SHELTERS,
  MOCK_DISASTER_ZONES,
  MOCK_GOV_AGENCIES
} from '../data/mockData';

interface AuthContextType {
  user: User | null;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  loginAsRole: (role: UserRole) => void;
  loginAsVictim: () => void;
  loginAsVolunteer: () => void;
  loginAsNgo: () => void;
  loginAsGovernment: () => void;
  logout: () => void;
  toggleMarkSafe: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  updatePreferences: (newPrefs: UserPreferences) => void;
  sosAlert: SosAlertResponse | null;
  triggerSos: () => SosAlertResponse;
  clearSos: () => void;
  isSosModalOpen: boolean;
  openSosModal: () => void;
  closeSosModal: () => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
  // Stage 2 Victim State
  requests: AssistanceRequest[];
  addEmergencyRequest: (data: {
    disasterType: 'Flood' | 'Fire' | 'Earthquake' | 'Cyclone' | 'Landslide' | 'Other';
    category: 'Medical' | 'Shelter' | 'Food & Water' | 'Supplies' | 'Rescue';
    urgency: 'Critical' | 'High' | 'Medium' | 'Low';
    location: string;
    details: string;
  }) => string;
  cancelRequest: (requestId: string) => void;
  shelters: Shelter[];
  requestShelter: (shelterId: string) => void;
  announcements: Announcement[];
  broadcastAnnouncement: (ann: Omit<Announcement, 'id' | 'timestamp'>) => void;
  volunteerTasks: VolunteerTask[];
  claimTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  // Stage 3 Volunteer State
  volunteerAvailability: AvailabilityStatus;
  setVolunteerAvailability: (status: AvailabilityStatus) => void;
  assignments: VolunteerAssignment[];
  acceptAssignment: (assignmentId: string) => void;
  startJourney: (assignmentId: string) => void;
  markAssignmentCompleted: (assignmentId: string) => void;
  rejectAssignment: (assignmentId: string) => void;
  // Stage 4 NGO State
  inventory: InventorySupply[];
  restockSupply: (id: string, amount: number) => void;
  dispatchSupply: (id: string, amount: number) => void;
  addSupplyItem: (item: Omit<InventorySupply, 'id' | 'lastRestocked' | 'status'>) => void;
  ngoVolunteers: NgoVolunteer[];
  reassignNgoVolunteer: (id: string, newCamp: string, newTask: string) => void;
  fulfillRequest: (requestId: string, supplyNote?: string) => void;
  ngoCamps: NgoCamp[];
  // Stage 5 Government State
  disasterZones: DisasterZone[];
  updateDisasterStatus: (id: string, newStatus: DisasterZone['status']) => void;
  govAgencies: GovernmentAgency[];
  reassignAgency: (id: string, sector: string) => void;
  createOfficialAlert: (alert: { title: string; message: string; type: 'emergency' | 'warning' | 'info'; zone: string }) => void;
  escalateToNdrf: (requestId: string) => void;
  expandShelterCapacity: (shelterId: string, additionalSpace: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Victim');
  const [user, setUser] = useState<User | null>(MOCK_USERS.Victim);
  const [sosAlert, setSosAlert] = useState<SosAlertResponse | null>(null);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [requests, setRequests] = useState<AssistanceRequest[]>(MOCK_REQUESTS);
  const [shelters, setShelters] = useState<Shelter[]>(MOCK_SHELTERS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [volunteerTasks] = useState<VolunteerTask[]>(MOCK_VOLUNTEER_TASKS);

  // Volunteer Stage 3 State
  const [volunteerAvailability, setVolunteerAvailabilityState] = useState<AvailabilityStatus>('ACTIVE');
  const [assignments, setAssignments] = useState<VolunteerAssignment[]>(MOCK_VOLUNTEER_ASSIGNMENTS);

  // NGO Stage 4 State
  const [inventory, setInventory] = useState<InventorySupply[]>(MOCK_INVENTORY_SUPPLIES);
  const [ngoVolunteers, setNgoVolunteers] = useState<NgoVolunteer[]>(MOCK_NGO_VOLUNTEERS);
  const [ngoCamps] = useState<NgoCamp[]>(MOCK_NGO_CAMPS);

  // Government Stage 5 State
  const [disasterZones, setDisasterZones] = useState<DisasterZone[]>(MOCK_DISASTER_ZONES);
  const [govAgencies, setGovAgencies] = useState<GovernmentAgency[]>(MOCK_GOV_AGENCIES);

  const loginAsRole = (role: UserRole) => {
    setSelectedRole(role);
    setUser(MOCK_USERS[role] || MOCK_USERS.Victim);
  };

  const loginAsVictim = () => loginAsRole('Victim');
  const loginAsVolunteer = () => loginAsRole('Volunteer');
  const loginAsNgo = () => loginAsRole('NGO');
  const loginAsGovernment = () => loginAsRole('Government Official');

  const logout = () => {
    setUser(null);
  };

  const setVolunteerAvailability = (status: AvailabilityStatus) => {
    setVolunteerAvailabilityState(status);
    if (user && user.role === 'Volunteer') {
      setUser({ ...user, availability: status });
    }
    const msg =
      status === 'ACTIVE'
        ? 'Volunteer status: ACTIVE. Ready to receive emergency assignments.'
        : status === 'STANDBY'
        ? 'Volunteer status: STANDBY. On reserve notice.'
        : 'Volunteer status: OFFLINE. Currently unavailable for assignments.';
    showToast(msg);
  };

  const toggleMarkSafe = () => {
    if (!user) return;
    const nextSafeState = !user.isSafe;
    setUser({ ...user, isSafe: nextSafeState });
    showToast(nextSafeState ? 'You are marked as SAFE on the public registry.' : 'Safe status revoked.');
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updatedData });
    showToast('Profile updated successfully.');
  };

  const updatePreferences = (newPrefs: UserPreferences) => {
    if (!user) return;
    setUser({ ...user, preferences: newPrefs });
    showToast('Preferences saved successfully.');
  };

  const triggerSos = (): SosAlertResponse => {
    const alert: SosAlertResponse = {
      requestId: 'SOS-2587',
      status: 'Emergency Alert Sent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: user?.location || 'Chennai, Tamil Nadu',
      userName: user ? user.name : 'Emergency User',
      assignedUnit: 'NDRF Quick Response Team 4'
    };
    setSosAlert(alert);
    return alert;
  };

  const clearSos = () => {
    setSosAlert(null);
  };

  const openSosModal = () => setIsSosModalOpen(true);
  const closeSosModal = () => setIsSosModalOpen(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const hideToast = () => setToastMessage(null);

  const addEmergencyRequest = (data: {
    disasterType: 'Flood' | 'Fire' | 'Earthquake' | 'Cyclone' | 'Landslide' | 'Other';
    category: 'Medical' | 'Shelter' | 'Food & Water' | 'Supplies' | 'Rescue';
    urgency: 'Critical' | 'High' | 'Medium' | 'Low';
    location: string;
    details: string;
  }) => {
    const nextNum = 1043 + requests.length - 5;
    const newId = `REQ-${nextNum}`;
    const newRequest: AssistanceRequest = {
      id: newId,
      requestTitle: `${data.category} (${data.disasterType})`,
      category: data.category,
      disasterType: data.disasterType,
      urgency: data.urgency,
      status: 'Open',
      victimName: user?.name || 'Anvitha Shetty',
      location: data.location || 'Chennai, Tamil Nadu',
      phone: user?.phone || '+91 98401 23456',
      details: data.details,
      timestamp: 'Just now',
      assignedTo: 'Dispatching...',
      peopleCount: 4,
      timeline: [
        { title: 'Request Submitted', subtitle: 'Timestamped and logged on public ledger', time: 'Just now', completed: true, current: true },
        { title: 'Matched to Responder', subtitle: 'Awaiting responder assignment', completed: false, current: false },
        { title: 'Responder Enroute', subtitle: 'Pending assignment', completed: false, current: false },
        { title: 'Resolved and Closed', subtitle: 'Pending completion', completed: false, current: false }
      ]
    };

    setRequests(prev => [newRequest, ...prev]);
    showToast(`Request ${newId} logged on public ledger!`);
    return newId;
  };

  const cancelRequest = (requestId: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'Cancelled',
            timeline: [
              ...r.timeline.map(t => ({ ...t, current: false })),
              { title: 'Request Cancelled', subtitle: 'Cancelled by victim', time: 'Just now', completed: true, current: true }
            ]
          };
        }
        return r;
      })
    );
    showToast(`Request ${requestId} has been cancelled.`);
  };

  const requestShelter = (shelterId: string) => {
    setShelters(prev =>
      prev.map(s => {
        if (s.id === shelterId && s.availableSpaces > 0) {
          return {
            ...s,
            availableSpaces: s.availableSpaces - 1,
            occupancy: s.occupancy + 1
          };
        }
        return s;
      })
    );
    showToast('Shelter reservation request confirmed! Proceed to shelter.');
  };

  const broadcastAnnouncement = (annData: Omit<Announcement, 'id' | 'timestamp'>) => {
    showToast(`Disaster Alert "${annData.title}" logged!`);
  };

  const claimTask = (taskId: string) => {
    showToast(`Task ${taskId} claimed.`);
  };

  const completeTask = (taskId: string) => {
    showToast(`Task ${taskId} marked as completed.`);
  };

  // Volunteer Stage 3 Handlers
  const acceptAssignment = (assignmentId: string) => {
    setAssignments(prev =>
      prev.map(a => (a.id === assignmentId ? { ...a, status: 'Accepted' } : a))
    );
    showToast(`Assignment ${assignmentId} ACCEPTED! Proceed to preparation.`);
  };

  const startJourney = (assignmentId: string) => {
    setAssignments(prev =>
      prev.map(a => (a.id === assignmentId ? { ...a, status: 'Enroute' } : a))
    );
    showToast(`Journey started for ${assignmentId}. GPS tracking activated.`);
  };

  const markAssignmentCompleted = (assignmentId: string) => {
    setAssignments(prev =>
      prev.map(a => (a.id === assignmentId ? { ...a, status: 'Completed' } : a))
    );
    if (user && user.role === 'Volunteer') {
      setUser({
        ...user,
        tasksCompleted: (user.tasksCompleted || 18) + 1,
        activeTasks: Math.max(0, (user.activeTasks || 2) - 1),
        peopleAssisted: (user.peopleAssisted || 42) + 3
      });
    }
    showToast(`Assignment ${assignmentId} marked as COMPLETED! Great work.`);
  };

  const rejectAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    showToast(`Assignment ${assignmentId} declined.`);
  };

  // NGO Stage 4 Handlers
  const restockSupply = (id: string, amount: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          const status = newQty <= item.minThreshold * 0.5 ? 'Critical' : newQty <= item.minThreshold ? 'Low Stock' : 'Adequate';
          return {
            ...item,
            quantity: newQty,
            status,
            lastRestocked: 'Just now'
          };
        }
        return item;
      })
    );
    showToast(`Restocked +${amount} units successfully!`);
  };

  const dispatchSupply = (id: string, amount: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity - amount);
          const status = newQty <= item.minThreshold * 0.5 ? 'Critical' : newQty <= item.minThreshold ? 'Low Stock' : 'Adequate';
          return {
            ...item,
            quantity: newQty,
            status
          };
        }
        return item;
      })
    );
    showToast(`Dispatched ${amount} units for field relief consignment.`);
  };

  const addSupplyItem = (newItemData: Omit<InventorySupply, 'id' | 'lastRestocked' | 'status'>) => {
    const status = newItemData.quantity <= newItemData.minThreshold * 0.5 ? 'Critical' : newItemData.quantity <= newItemData.minThreshold ? 'Low Stock' : 'Adequate';
    const newItem: InventorySupply = {
      ...newItemData,
      id: `SUP-${Math.floor(100 + Math.random() * 900)}`,
      lastRestocked: 'Just now',
      status
    };
    setInventory(prev => [newItem, ...prev]);
    showToast(`New supply item "${newItem.name}" registered in inventory.`);
  };

  const reassignNgoVolunteer = (id: string, newCamp: string, newTask: string) => {
    setNgoVolunteers(prev =>
      prev.map(v => (v.id === id ? { ...v, assignedCamp: newCamp, currentTask: newTask, status: 'On Field' } : v))
    );
    showToast(`Volunteer redeployed to ${newCamp}.`);
  };

  const fulfillRequest = (requestId: string, supplyNote?: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status: 'Resolved',
            assignedTo: 'Red Cross Relief Foundation (Dr. Priya)',
            timeline: [
              ...r.timeline.map(t => ({ ...t, current: false })),
              { title: 'Relief Consignment Delivered', subtitle: supplyNote || 'Food, water and medical aid delivered by Red Cross', time: 'Just now', completed: true, current: true },
              { title: 'Resolved and Closed', subtitle: 'Assistance fulfilled and verified by NGO', time: 'Just now', completed: true, current: false }
            ]
          };
        }
        return r;
      })
    );
    setInventory(prev =>
      prev.map(item => (item.category === 'Food' || item.category === 'Water' ? { ...item, quantity: Math.max(0, item.quantity - 4) } : item))
    );
    showToast(`Request ${requestId} marked as FULFILLED! Relief recorded.`);
  };

  // Government Stage 5 Handlers
  const updateDisasterStatus = (id: string, newStatus: DisasterZone['status']) => {
    setDisasterZones(prev =>
      prev.map(z => (z.id === id ? { ...z, status: newStatus, lastUpdated: 'Just now' } : z))
    );
    showToast(`Disaster zone status updated to: ${newStatus}`);
  };

  const reassignAgency = (id: string, sector: string) => {
    setGovAgencies(prev =>
      prev.map(a => (a.id === id ? { ...a, assignedSector: sector, status: 'Deployed' } : a))
    );
    showToast(`Battalion redeployed to sector: ${sector}`);
  };

  const createOfficialAlert = (alertData: { title: string; message: string; type: 'emergency' | 'warning' | 'info'; zone: string }) => {
    const newAlert: Announcement = {
      id: `ann-gov-${Date.now()}`,
      title: alertData.title,
      message: alertData.message,
      type: alertData.type,
      zone: alertData.zone,
      timestamp: 'Just now',
      issuedBy: 'TNSDMA State Disaster Operations Center'
    };
    setAnnouncements(prev => [newAlert, ...prev]);
    showToast(`STATEWIDE EMERGENCY BROADCAST "${alertData.title}" ISSUED!`);
  };

  const escalateToNdrf = (requestId: string) => {
    setRequests(prev =>
      prev.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            assignedTo: 'NDRF 04 Battalion Quick Strike Team',
            urgency: 'Critical',
            timeline: [
              ...r.timeline.map(t => ({ ...t, current: false })),
              { title: 'Escalated to NDRF Command', subtitle: 'Authorized by State Relief Commissioner (R. Rajesh IAS)', time: 'Just now', completed: true, current: true }
            ]
          };
        }
        return r;
      })
    );
    showToast(`Ticket ${requestId} ESCALATED TO NDRF QUICK STRIKE FORCE!`);
  };

  const expandShelterCapacity = (shelterId: string, additionalSpace: number) => {
    setShelters(prev =>
      prev.map(s => {
        if (s.id === shelterId) {
          const newCap = s.capacity + additionalSpace;
          return {
            ...s,
            capacity: newCap,
            availableSpaces: s.availableSpaces + additionalSpace
          };
        }
        return s;
      })
    );
    showToast(`Shelter capacity expanded by +${additionalSpace} emergency beds!`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        selectedRole,
        setSelectedRole,
        loginAsRole,
        loginAsVictim,
        loginAsVolunteer,
        loginAsNgo,
        loginAsGovernment,
        logout,
        toggleMarkSafe,
        updateProfile,
        updatePreferences,
        sosAlert,
        triggerSos,
        clearSos,
        isSosModalOpen,
        openSosModal,
        closeSosModal,
        toastMessage,
        showToast,
        hideToast,
        requests,
        addEmergencyRequest,
        cancelRequest,
        shelters,
        requestShelter,
        announcements,
        broadcastAnnouncement,
        volunteerTasks,
        claimTask,
        completeTask,
        volunteerAvailability,
        setVolunteerAvailability,
        assignments,
        acceptAssignment,
        startJourney,
        markAssignmentCompleted,
        rejectAssignment,
        inventory,
        restockSupply,
        dispatchSupply,
        addSupplyItem,
        ngoVolunteers,
        reassignNgoVolunteer,
        fulfillRequest,
        ngoCamps,
        disasterZones,
        updateDisasterStatus,
        govAgencies,
        reassignAgency,
        createOfficialAlert,
        escalateToNdrf,
        expandShelterCapacity
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

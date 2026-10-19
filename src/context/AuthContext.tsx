import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
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
  GovernmentAgency,
  DashboardStats,
  ReportSummary
} from '../types';
import { api, ApiError, setUnauthorizedHandler, tokenStore } from '../lib/api';
import { getPosition, formatCoords, Coords } from '../lib/geo';

export interface RegisterInput {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  organization?: string;
  zone?: string;
  designation?: string;
  department?: string;
  inviteCode?: string;
}

type DisasterType = 'Flood' | 'Fire' | 'Earthquake' | 'Cyclone' | 'Landslide' | 'Other';
type NeedCategory = 'Medical' | 'Shelter' | 'Food & Water' | 'Supplies' | 'Rescue';

interface AuthContextType {
  user: User | null;
  /** True while the stored session is being verified on first load. */
  authLoading: boolean;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  /** Resolves to null on success, or a human-readable error message. */
  login: (email: string, password: string, role: UserRole, remember?: boolean) => Promise<string | null>;
  /** Creates a new account (does not sign in). Resolves to null on success, or an error message. */
  register: (data: RegisterInput) => Promise<string | null>;
  logout: () => void;
  toggleMarkSafe: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<boolean>;
  updatePreferences: (newPrefs: UserPreferences) => Promise<void>;
  sosAlert: SosAlertResponse | null;
  triggerSos: (emergencyType?: string) => Promise<SosAlertResponse | null>;
  clearSos: () => void;
  isSosModalOpen: boolean;
  openSosModal: () => void;
  closeSosModal: () => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  hideToast: () => void;
  /** Re-fetches all server data for the current user. */
  refresh: () => Promise<void>;
  stats: DashboardStats;
  // Victim
  requests: AssistanceRequest[];
  addEmergencyRequest: (data: {
    disasterType: DisasterType;
    category: NeedCategory;
    urgency: 'Critical' | 'High' | 'Medium' | 'Low';
    location: string;
    details: string;
    coordinates?: Coords | null;
  }) => Promise<string | null>;
  cancelRequest: (requestId: string) => Promise<void>;
  shelters: Shelter[];
  requestShelter: (shelterId: string) => Promise<void>;
  announcements: Announcement[];
  broadcastAnnouncement: (ann: Omit<Announcement, 'id' | 'timestamp'>) => Promise<void>;
  volunteerTasks: VolunteerTask[];
  claimTask: (taskId: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  // Volunteer
  volunteerAvailability: AvailabilityStatus;
  setVolunteerAvailability: (status: AvailabilityStatus) => Promise<void>;
  assignments: VolunteerAssignment[];
  acceptAssignment: (assignmentId: string) => Promise<boolean>;
  startJourney: (assignmentId: string) => Promise<void>;
  markAssignmentCompleted: (assignmentId: string) => Promise<void>;
  rejectAssignment: (assignmentId: string) => Promise<void>;
  // NGO
  inventory: InventorySupply[];
  restockSupply: (id: string, amount: number) => Promise<void>;
  dispatchSupply: (id: string, amount: number) => Promise<void>;
  addSupplyItem: (item: Omit<InventorySupply, 'id' | 'lastRestocked' | 'status'>) => Promise<void>;
  ngoVolunteers: NgoVolunteer[];
  reassignNgoVolunteer: (id: string, newCamp: string, newTask: string) => Promise<void>;
  fulfillRequest: (requestId: string, supplyNote?: string) => Promise<boolean>;
  dispatchConsignment: (requestId: string) => Promise<void>;
  deployVolunteers: (requestId: string) => Promise<void>;
  ngoCamps: NgoCamp[];
  // Government
  disasterZones: DisasterZone[];
  updateDisasterStatus: (id: string, newStatus: DisasterZone['status']) => Promise<void>;
  govAgencies: GovernmentAgency[];
  reassignAgency: (id: string, sector: string) => Promise<void>;
  createOfficialAlert: (alert: { title: string; message: string; type: 'emergency' | 'warning' | 'info'; zone: string }) => Promise<void>;
  escalateToNdrf: (requestId: string) => Promise<void>;
  routeRequestToNgo: (requestId: string) => Promise<void>;
  expandShelterCapacity: (shelterId: string, additionalSpace: number) => Promise<void>;
  auditShelter: (shelterId: string) => Promise<void>;
  requisitionReinforcements: () => Promise<void>;
  triggerMutualAid: () => Promise<void>;
  fetchReportSummary: () => Promise<ReportSummary | null>;
  exportReport: (format: 'csv' | 'pdf') => Promise<void>;
}

const EMPTY_STATS: DashboardStats = {
  openShelters: 0,
  totalShelters: 0,
  peopleHelped: 0,
  incomingRequests: 0,
  volunteersDeployed: 0,
  distressCalls: 0,
  zoneCount: 0,
  resolvedCount: 0,
  clearancePct: 0,
  battalions: 0,
  ngoPartners: 0
};

interface Bootstrap {
  user: User;
  requests: AssistanceRequest[];
  shelters: Shelter[];
  announcements: Announcement[];
  assignments: VolunteerAssignment[];
  volunteerTasks: VolunteerTask[];
  inventory: InventorySupply[];
  ngoVolunteers: NgoVolunteer[];
  ngoCamps: NgoCamp[];
  disasterZones: DisasterZone[];
  govAgencies: GovernmentAgency[];
  stats: DashboardStats;
}

const POLL_MS = 15000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Victim');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(() => !!tokenStore.get());
  const [sosAlert, setSosAlert] = useState<SosAlertResponse | null>(null);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [volunteerTasks, setVolunteerTasks] = useState<VolunteerTask[]>([]);
  const [assignments, setAssignments] = useState<VolunteerAssignment[]>([]);
  const [inventory, setInventory] = useState<InventorySupply[]>([]);
  const [ngoVolunteers, setNgoVolunteers] = useState<NgoVolunteer[]>([]);
  const [ngoCamps, setNgoCamps] = useState<NgoCamp[]>([]);
  const [disasterZones, setDisasterZones] = useState<DisasterZone[]>([]);
  const [govAgencies, setGovAgencies] = useState<GovernmentAgency[]>([]);
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);

  /* ------------------------------- toast ------------------------------- */
  const hideToast = useCallback(() => setToastMessage(null), []);
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3500);
  }, []);

  /* --------------------------- data loading --------------------------- */
  const applyBootstrap = useCallback((b: Bootstrap) => {
    setUser(b.user);
    setSelectedRole(b.user.role);
    setRequests(b.requests);
    setShelters(b.shelters);
    setAnnouncements(b.announcements);
    setAssignments(b.assignments);
    setVolunteerTasks(b.volunteerTasks);
    setInventory(b.inventory);
    setNgoVolunteers(b.ngoVolunteers);
    setNgoCamps(b.ngoCamps);
    setDisasterZones(b.disasterZones);
    setGovAgencies(b.govAgencies);
    setStats(b.stats);
  }, []);

  const clearData = useCallback(() => {
    setUser(null);
    setRequests([]);
    setShelters([]);
    setAnnouncements([]);
    setAssignments([]);
    setVolunteerTasks([]);
    setInventory([]);
    setNgoVolunteers([]);
    setNgoCamps([]);
    setDisasterZones([]);
    setGovAgencies([]);
    setStats(EMPTY_STATS);
  }, []);

  // Guards against an older, slower response overwriting a newer one.
  const loadSeq = useRef(0);
  const refresh = useCallback(async () => {
    if (!tokenStore.get()) return;
    const seq = ++loadSeq.current;
    try {
      const b = await api.get<Bootstrap>('/bootstrap');
      if (seq === loadSeq.current) applyBootstrap(b);
    } catch {
      /* 401 is handled globally; transient network errors are retried by the next poll */
    }
  }, [applyBootstrap]);

  // Restore the session on first load.
  useEffect(() => {
    if (!tokenStore.get()) return;
    let cancelled = false;
    (async () => {
      try {
        const b = await api.get<Bootstrap>('/bootstrap');
        if (!cancelled) applyBootstrap(b);
      } catch {
        /* an invalid session is cleared by the unauthorized handler */
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyBootstrap]);

  // Expired/invalid token anywhere -> sign out.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (!tokenStore.get()) return;
      tokenStore.clear();
      clearData();
      showToast('Your session has expired. Please log in again.');
    });
    return () => setUnauthorizedHandler(null);
  }, [clearData, showToast]);

  // Keep every role's view live: other roles' actions show up without a manual reload.
  useEffect(() => {
    if (!user) return;
    const tick = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    const id = setInterval(tick, POLL_MS);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(id);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [user, refresh]);

  /* ------------------------------ helpers ------------------------------ */
  /** Runs an API call: toasts the server's message on success (then re-syncs) and the error on failure. */
  const act = useCallback(
    async <T extends { message?: string }>(
      call: () => Promise<T>,
      opts: { sync?: boolean; silent?: boolean } = {}
    ): Promise<T | null> => {
      try {
        const res = await call();
        if (res?.message && !opts.silent) showToast(res.message);
        if (opts.sync !== false) await refresh();
        return res;
      } catch (e) {
        showToast(e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
        return null;
      }
    },
    [refresh, showToast]
  );

  /* -------------------------------- auth -------------------------------- */
  const login = useCallback(
    async (email: string, password: string, role: UserRole, remember = true): Promise<string | null> => {
      try {
        const res = await api.post<{ token: string; user: User; message?: string }>('/auth/login', { email, password, role });
        tokenStore.set(res.token, remember);
        setAuthLoading(false);
        const b = await api.get<Bootstrap>('/bootstrap');
        applyBootstrap(b);
        if (res.message) showToast(res.message);
        return null;
      } catch (e) {
        tokenStore.clear();
        return e instanceof ApiError ? e.message : 'Unable to sign in. Please try again.';
      }
    },
    [applyBootstrap, showToast]
  );

  const register = useCallback(async (data: RegisterInput): Promise<string | null> => {
    try {
      await api.post('/auth/register', data);
      return null;
    } catch (e) {
      return e instanceof ApiError ? e.message : 'Unable to create your account. Please try again.';
    }
  }, []);

  const logout = useCallback(() => {
    void api.post('/auth/logout').catch(() => undefined);
    tokenStore.clear();
    clearData();
    setSosAlert(null);
  }, [clearData]);

  const toggleMarkSafe = async () => {
    if (!user) return;
    await act(() => api.put<{ message: string }>('/me/safe', { isSafe: !user.isSafe }));
  };

  const updateProfile = async (updatedData: Partial<User>): Promise<boolean> => {
    const res = await act(() => api.patch<{ message: string }>('/me', updatedData));
    return !!res;
  };

  const updatePreferences = async (newPrefs: UserPreferences) => {
    await act(() => api.put<{ message: string }>('/me/preferences', newPrefs));
  };

  /* --------------------------------- SOS --------------------------------- */
  const triggerSos = async (emergencyType?: string): Promise<SosAlertResponse | null> => {
    // Short GPS timeout: an SOS must never be held up waiting for a location fix.
    const pos = await getPosition(4000);
    const res = await act(
      () =>
        api.post<{ alert: SosAlertResponse; message: string }>('/sos', {
          emergencyType,
          ...(pos ? { latitude: pos.lat, longitude: pos.lng } : {}),
          ...(!user && pos ? { location: `GPS ${formatCoords(pos)}` } : {})
        }),
      { sync: !!user, silent: true }
    );
    if (res) setSosAlert(res.alert);
    return res?.alert ?? null;
  };

  const clearSos = () => setSosAlert(null);
  const openSosModal = () => setIsSosModalOpen(true);
  const closeSosModal = () => setIsSosModalOpen(false);

  /* -------------------------------- victim -------------------------------- */
  const addEmergencyRequest: AuthContextType['addEmergencyRequest'] = async (data) => {
    const { coordinates, ...rest } = data;
    const res = await act(() =>
      api.post<{ request: AssistanceRequest; message: string }>('/requests', {
        ...rest,
        ...(coordinates ? { latitude: coordinates.lat, longitude: coordinates.lng } : {})
      })
    );
    return res?.request.id ?? null;
  };

  const cancelRequest = async (id: string) => {
    await act(() => api.post<{ message: string }>(`/requests/${id}/cancel`));
  };

  const requestShelter = async (shelterId: string) => {
    await act(() => api.post<{ message: string }>(`/shelters/${shelterId}/reserve`));
  };

  const broadcastAnnouncement = async (ann: Omit<Announcement, 'id' | 'timestamp'>) => {
    await act(() =>
      api.post<{ message: string }>('/announcements', {
        title: ann.title,
        message: ann.message,
        type: ann.type,
        zone: ann.zone || 'All Zones'
      })
    );
  };

  const claimTask = async (taskId: string) => {
    await act(() => api.post<{ message: string }>(`/volunteer-tasks/${taskId}/claim`));
  };
  const completeTask = async (taskId: string) => {
    await act(() => api.post<{ message: string }>(`/volunteer-tasks/${taskId}/complete`));
  };

  /* ------------------------------- volunteer ------------------------------- */
  const setVolunteerAvailability = async (status: AvailabilityStatus) => {
    await act(() => api.put<{ message: string }>('/me/availability', { availability: status }));
  };

  const acceptAssignment = async (id: string): Promise<boolean> => {
    const res = await act(() => api.post<{ message: string }>(`/assignments/${id}/accept`));
    return !!res;
  };
  const startJourney = async (id: string) => {
    await act(() => api.post<{ message: string }>(`/assignments/${id}/start`));
  };
  const markAssignmentCompleted = async (id: string) => {
    await act(() => api.post<{ message: string }>(`/assignments/${id}/complete`));
  };
  const rejectAssignment = async (id: string) => {
    await act(() => api.post<{ message: string }>(`/assignments/${id}/reject`));
  };

  /* ---------------------------------- NGO ---------------------------------- */
  const restockSupply = async (id: string, amount: number) => {
    await act(() => api.post<{ message: string }>(`/inventory/${id}/restock`, { amount }));
  };
  const dispatchSupply = async (id: string, amount: number) => {
    await act(() => api.post<{ message: string }>(`/inventory/${id}/dispatch`, { amount }));
  };
  const addSupplyItem = async (item: Omit<InventorySupply, 'id' | 'lastRestocked' | 'status'>) => {
    await act(() => api.post<{ message: string }>('/inventory', item));
  };
  const reassignNgoVolunteer = async (id: string, newCamp: string, newTask: string) => {
    await act(() => api.patch<{ message: string }>(`/ngo/volunteers/${id}`, { assignedCamp: newCamp, currentTask: newTask }));
  };
  const fulfillRequest = async (requestId: string, supplyNote?: string): Promise<boolean> => {
    const res = await act(() => api.post<{ message: string }>(`/requests/${requestId}/fulfill`, { note: supplyNote }));
    return !!res;
  };
  const dispatchConsignment = async (requestId: string) => {
    await act(() => api.post<{ message: string }>(`/requests/${requestId}/dispatch-supplies`));
  };
  const deployVolunteers = async (requestId: string) => {
    await act(() => api.post<{ message: string }>(`/requests/${requestId}/deploy-volunteers`));
  };

  /* ------------------------------- government ------------------------------- */
  const updateDisasterStatus = async (id: string, newStatus: DisasterZone['status']) => {
    await act(() => api.patch<{ message: string }>(`/gov/zones/${id}/status`, { status: newStatus }));
  };
  const reassignAgency = async (id: string, sector: string) => {
    await act(() => api.patch<{ message: string }>(`/gov/agencies/${id}/sector`, { sector }));
  };
  const createOfficialAlert = async (alert: { title: string; message: string; type: 'emergency' | 'warning' | 'info'; zone: string }) => {
    await act(() => api.post<{ message: string }>('/announcements', alert));
  };
  const escalateToNdrf = async (requestId: string) => {
    await act(() => api.post<{ message: string }>(`/requests/${requestId}/escalate`));
  };
  const routeRequestToNgo = async (requestId: string) => {
    await act(() => api.post<{ message: string }>(`/requests/${requestId}/route-ngo`));
  };
  const expandShelterCapacity = async (shelterId: string, additionalSpace: number) => {
    await act(() => api.post<{ message: string }>(`/shelters/${shelterId}/expand`, { additionalSpace }));
  };
  const auditShelter = async (shelterId: string) => {
    await act(() => api.post<{ message: string }>(`/shelters/${shelterId}/audit`));
  };
  const requisitionReinforcements = async () => {
    await act(() => api.post<{ message: string }>('/gov/coordination/reinforcements'), { sync: false });
  };
  const triggerMutualAid = async () => {
    await act(() => api.post<{ message: string }>('/gov/coordination/mutual-aid'), { sync: false });
  };
  const fetchReportSummary = async (): Promise<ReportSummary | null> => {
    try {
      return (await api.get<{ summary: ReportSummary }>('/reports/summary')).summary;
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Unable to load report data.');
      return null;
    }
  };
  const exportReport = async (format: 'csv' | 'pdf') => {
    try {
      showToast(`Generating and exporting official SITREP Report (${format.toUpperCase()})...`);
      await api.download(`/reports/export?format=${format}`, `resqchain-sitrep.${format}`);
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Report export failed.');
    }
  };

  // The handlers above only close over `user` and stable callbacks, so rebuilding the context value
  // whenever any piece of state changes keeps every consumer current.
  const value: AuthContextType = {
    user,
    authLoading,
    selectedRole,
    setSelectedRole,
    login,
    register,
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
    refresh,
    stats,
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
    volunteerAvailability: user?.availability ?? 'ACTIVE',
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
    dispatchConsignment,
    deployVolunteers,
    ngoCamps,
    disasterZones,
    updateDisasterStatus,
    govAgencies,
    reassignAgency,
    createOfficialAlert,
    escalateToNdrf,
    routeRequestToNgo,
    expandShelterCapacity,
    auditShelter,
    requisitionReinforcements,
    triggerMutualAid,
    fetchReportSummary,
    exportReport
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

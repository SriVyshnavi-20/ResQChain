import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Stage 2 Victim Module Pages
import { VictimDashboard } from './pages/VictimDashboard';
import { ReportEmergencyPage } from './pages/ReportEmergencyPage';
import { RequestsPage } from './pages/RequestsPage';
import { RequestTrackingPage } from './pages/RequestTrackingPage';
import { SheltersPage } from './pages/SheltersPage';
import { ShelterDetailsPage } from './pages/ShelterDetailsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

// Stage 3 Volunteer Module Pages
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { VolunteerAssignmentsPage } from './pages/VolunteerAssignmentsPage';
import { VolunteerAssignmentDetailsPage } from './pages/VolunteerAssignmentDetailsPage';
import { VolunteerRequestsPage } from './pages/VolunteerRequestsPage';
import { VolunteerSheltersPage } from './pages/VolunteerSheltersPage';
import { VolunteerAnnouncementsPage } from './pages/VolunteerAnnouncementsPage';
import { VolunteerProfilePage } from './pages/VolunteerProfilePage';
import { VolunteerSettingsPage } from './pages/VolunteerSettingsPage';

// Stage 4 NGO Module Pages
import { NgoDashboard } from './pages/NgoDashboard';
import { NgoRequestsPage } from './pages/NgoRequestsPage';
import { NgoRequestDetailsPage } from './pages/NgoRequestDetailsPage';
import { NgoVolunteersPage } from './pages/NgoVolunteersPage';
import { NgoInventoryPage } from './pages/NgoInventoryPage';
import { NgoSheltersPage } from './pages/NgoSheltersPage';
import { NgoAnnouncementsPage } from './pages/NgoAnnouncementsPage';
import { NgoProfilePage } from './pages/NgoProfilePage';
import { NgoSettingsPage } from './pages/NgoSettingsPage';

// Stage 5 Government Module Pages
import { GovDashboard } from './pages/GovDashboard';
import { GovMonitoringPage } from './pages/GovMonitoringPage';
import { GovRequestsPage } from './pages/GovRequestsPage';
import { GovCoordinationPage } from './pages/GovCoordinationPage';
import { GovSheltersPage } from './pages/GovSheltersPage';
import { GovAlertsPage } from './pages/GovAlertsPage';
import { GovReportsPage } from './pages/GovReportsPage';
import { GovProfilePage } from './pages/GovProfilePage';
import { GovSettingsPage } from './pages/GovSettingsPage';

// Common Components
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { SosModal } from './components/sos/SosModal';
import { Toast } from './components/common/Toast';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
          <Routes>
            {/* Stage 1 Base Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Stage 2 Victim Module Routes */}
            <Route path="/victim/dashboard" element={<ProtectedRoute role="Victim"><VictimDashboard /></ProtectedRoute>} />
            <Route path="/victim/report-emergency" element={<ProtectedRoute role="Victim"><ReportEmergencyPage /></ProtectedRoute>} />
            <Route path="/victim/my-requests" element={<ProtectedRoute role="Victim"><RequestsPage /></ProtectedRoute>} />
            <Route path="/victim/request/:id" element={<ProtectedRoute role="Victim"><RequestTrackingPage /></ProtectedRoute>} />
            <Route path="/victim/shelters" element={<ProtectedRoute role="Victim"><SheltersPage /></ProtectedRoute>} />
            <Route path="/victim/shelter/:id" element={<ProtectedRoute role="Victim"><ShelterDetailsPage /></ProtectedRoute>} />
            <Route path="/victim/announcements" element={<ProtectedRoute role="Victim"><AnnouncementsPage /></ProtectedRoute>} />
            <Route path="/victim/profile" element={<ProtectedRoute role="Victim"><ProfilePage /></ProtectedRoute>} />
            <Route path="/victim/settings" element={<ProtectedRoute role="Victim"><SettingsPage /></ProtectedRoute>} />

            {/* Stage 3 Volunteer Module Routes */}
            <Route path="/volunteer/dashboard" element={<ProtectedRoute role="Volunteer"><VolunteerDashboard /></ProtectedRoute>} />
            <Route path="/volunteer/assignments" element={<ProtectedRoute role="Volunteer"><VolunteerAssignmentsPage /></ProtectedRoute>} />
            <Route path="/volunteer/assignments/:id" element={<ProtectedRoute role="Volunteer"><VolunteerAssignmentDetailsPage /></ProtectedRoute>} />
            <Route path="/volunteer/requests" element={<ProtectedRoute role="Volunteer"><VolunteerRequestsPage /></ProtectedRoute>} />
            <Route path="/volunteer/shelters" element={<ProtectedRoute role="Volunteer"><VolunteerSheltersPage /></ProtectedRoute>} />
            <Route path="/volunteer/announcements" element={<ProtectedRoute role="Volunteer"><VolunteerAnnouncementsPage /></ProtectedRoute>} />
            <Route path="/volunteer/profile" element={<ProtectedRoute role="Volunteer"><VolunteerProfilePage /></ProtectedRoute>} />
            <Route path="/volunteer/settings" element={<ProtectedRoute role="Volunteer"><VolunteerSettingsPage /></ProtectedRoute>} />

            {/* Stage 4 NGO Module Routes */}
            <Route path="/ngo/dashboard" element={<ProtectedRoute role="NGO"><NgoDashboard /></ProtectedRoute>} />
            <Route path="/ngo/requests" element={<ProtectedRoute role="NGO"><NgoRequestsPage /></ProtectedRoute>} />
            <Route path="/ngo/requests/:id" element={<ProtectedRoute role="NGO"><NgoRequestDetailsPage /></ProtectedRoute>} />
            <Route path="/ngo/volunteers" element={<ProtectedRoute role="NGO"><NgoVolunteersPage /></ProtectedRoute>} />
            <Route path="/ngo/inventory" element={<ProtectedRoute role="NGO"><NgoInventoryPage /></ProtectedRoute>} />
            <Route path="/ngo/shelters" element={<ProtectedRoute role="NGO"><NgoSheltersPage /></ProtectedRoute>} />
            <Route path="/ngo/announcements" element={<ProtectedRoute role="NGO"><NgoAnnouncementsPage /></ProtectedRoute>} />
            <Route path="/ngo/profile" element={<ProtectedRoute role="NGO"><NgoProfilePage /></ProtectedRoute>} />
            <Route path="/ngo/settings" element={<ProtectedRoute role="NGO"><NgoSettingsPage /></ProtectedRoute>} />

            {/* Stage 5 Government Module Routes */}
            <Route path="/government/dashboard" element={<ProtectedRoute role="Government Official"><GovDashboard /></ProtectedRoute>} />
            <Route path="/government/monitoring" element={<ProtectedRoute role="Government Official"><GovMonitoringPage /></ProtectedRoute>} />
            <Route path="/government/requests" element={<ProtectedRoute role="Government Official"><GovRequestsPage /></ProtectedRoute>} />
            <Route path="/government/coordination" element={<ProtectedRoute role="Government Official"><GovCoordinationPage /></ProtectedRoute>} />
            <Route path="/government/shelters" element={<ProtectedRoute role="Government Official"><GovSheltersPage /></ProtectedRoute>} />
            <Route path="/government/alerts" element={<ProtectedRoute role="Government Official"><GovAlertsPage /></ProtectedRoute>} />
            <Route path="/government/reports" element={<ProtectedRoute role="Government Official"><GovReportsPage /></ProtectedRoute>} />
            <Route path="/government/profile" element={<ProtectedRoute role="Government Official"><GovProfilePage /></ProtectedRoute>} />
            <Route path="/government/settings" element={<ProtectedRoute role="Government Official"><GovSettingsPage /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Emergency SOS Modal & Toast Notifications */}
          <SosModal />
          <Toast />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

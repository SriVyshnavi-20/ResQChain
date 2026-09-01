import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

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
            
            {/* Stage 2 Victim Module Routes */}
            <Route path="/victim/dashboard" element={<VictimDashboard />} />
            <Route path="/victim/report-emergency" element={<ReportEmergencyPage />} />
            <Route path="/victim/my-requests" element={<RequestsPage />} />
            <Route path="/victim/request/:id" element={<RequestTrackingPage />} />
            <Route path="/victim/shelters" element={<SheltersPage />} />
            <Route path="/victim/shelter/:id" element={<ShelterDetailsPage />} />
            <Route path="/victim/announcements" element={<AnnouncementsPage />} />
            <Route path="/victim/profile" element={<ProfilePage />} />
            <Route path="/victim/settings" element={<SettingsPage />} />

            {/* Stage 3 Volunteer Module Routes */}
            <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
            <Route path="/volunteer/assignments" element={<VolunteerAssignmentsPage />} />
            <Route path="/volunteer/assignments/:id" element={<VolunteerAssignmentDetailsPage />} />
            <Route path="/volunteer/requests" element={<VolunteerRequestsPage />} />
            <Route path="/volunteer/shelters" element={<VolunteerSheltersPage />} />
            <Route path="/volunteer/announcements" element={<VolunteerAnnouncementsPage />} />
            <Route path="/volunteer/profile" element={<VolunteerProfilePage />} />
            <Route path="/volunteer/settings" element={<VolunteerSettingsPage />} />

            {/* Stage 4 NGO Module Routes */}
            <Route path="/ngo/dashboard" element={<NgoDashboard />} />
            <Route path="/ngo/requests" element={<NgoRequestsPage />} />
            <Route path="/ngo/requests/:id" element={<NgoRequestDetailsPage />} />
            <Route path="/ngo/volunteers" element={<NgoVolunteersPage />} />
            <Route path="/ngo/inventory" element={<NgoInventoryPage />} />
            <Route path="/ngo/shelters" element={<NgoSheltersPage />} />
            <Route path="/ngo/announcements" element={<NgoAnnouncementsPage />} />
            <Route path="/ngo/profile" element={<NgoProfilePage />} />
            <Route path="/ngo/settings" element={<NgoSettingsPage />} />

            {/* Stage 5 Government Module Routes */}
            <Route path="/government/dashboard" element={<GovDashboard />} />
            <Route path="/government/monitoring" element={<GovMonitoringPage />} />
            <Route path="/government/requests" element={<GovRequestsPage />} />
            <Route path="/government/coordination" element={<GovCoordinationPage />} />
            <Route path="/government/shelters" element={<GovSheltersPage />} />
            <Route path="/government/alerts" element={<GovAlertsPage />} />
            <Route path="/government/reports" element={<GovReportsPage />} />
            <Route path="/government/profile" element={<GovProfilePage />} />
            <Route path="/government/settings" element={<GovSettingsPage />} />

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

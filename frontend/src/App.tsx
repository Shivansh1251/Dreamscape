import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AiCopilot } from './pages/AiCopilot';
import { Spain } from './pages/Spain';
import { Roamies } from './pages/Roamies';
import { TravelPlans } from './pages/TravelPlans';
import { Destination } from './pages/Destination';

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Note: Universal Layout wrapping and Navbar are handled internally by the pages (via <PageLayout>) */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ai-copilot" element={<AiCopilot />} />
                <Route path="/spain" element={<Spain />} />
                <Route path="/roamies" element={<Roamies />} />
                <Route path="/travel-plans" element={<TravelPlans />} />
                <Route path="/destination/:name" element={<Destination />} />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

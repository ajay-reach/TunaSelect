import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import FishDetailPage from "@/react-app/pages/FishDetail";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import OrdersPage from "@/react-app/pages/Orders";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/fish/:id" element={<FishDetailPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

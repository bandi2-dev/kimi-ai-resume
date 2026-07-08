import { Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Optimize from "./pages/Optimize";
import JobMatch from "./pages/JobMatch";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/job-match" element={<JobMatch />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#121212",
            border: "1px solid rgba(244, 244, 245, 0.1)",
            color: "#F4F4F5",
          },
        }}
      />
    </div>
  );
}

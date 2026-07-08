import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Sparkles, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function getOAuthUrl() {
  const appID = import.meta.env.VITE_APP_ID;
  const authURL = import.meta.env.VITE_KIMI_AUTH_URL;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${authURL}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-16 px-6 min-h-screen flex items-center justify-center"
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-6">
            <Sparkles className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Orbit</h1>
          <p className="text-muted-foreground">
            Sign in to save your analyses, access your history, and unlock premium features.
          </p>
        </div>

        <div className="glass-card rounded-xl p-8">
          <Button
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
            disabled={isLoading}
            className="w-full bg-[#D4AF37] text-black hover:bg-[#E5C158] font-semibold h-12 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
              />
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-[#2DD4BF] transition-colors"
          >
            Continue as guest
          </button>
        </div>
      </div>
    </motion.div>
  );
}

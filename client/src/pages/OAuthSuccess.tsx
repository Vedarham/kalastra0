import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAccessToken } from "@/api/interceptor";
import { useAuth } from "@/contexts/AuthContext";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loadUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        const token = params.get("token");

        if (!token) {
          navigate("/auth");
          return;
        }

        setAccessToken(token);

        await loadUser();

        navigate("/");
      } catch (err) {
        console.error("OAuth failed:", err);

        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    handleOAuth();
  }, [params, navigate, loadUser]);

  return (
    <div className="h-screen flex items-center justify-center">
      {loading ? "Signing you in..." : "Redirecting..."}
    </div>
  );
}
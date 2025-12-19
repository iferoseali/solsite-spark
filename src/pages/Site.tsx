import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Site = () => {
  const { subdomain } = useParams<{ subdomain: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (subdomain) {
      // Redirect to the public site URL
      window.location.href = `https://${subdomain}.solsite.xyz`;
    } else {
      // No subdomain provided, go back to dashboard
      navigate("/dashboard");
    }
  }, [subdomain, navigate]);

  // Show nothing while redirecting
  return null;
};

export default Site;

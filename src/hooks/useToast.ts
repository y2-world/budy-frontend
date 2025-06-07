import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useToast = () => {
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (location.state?.showToast) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return showToast;
};
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import useToggle from "../hooks/useToggle";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  // const { auth, persist } = useAuth();
  const { auth } = useAuth();
  const [persist] = useToggle("persist", false);

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      }
      isMounted && setIsLoading(false);
    };
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
  }, [isLoading]);

  return !persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />;
};

export default PersistLogin;

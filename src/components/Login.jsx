import { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth.jsx";
import axios from "../api/axios.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useInput from "../hooks/useInput.jsx";
import useToggle from "../hooks/useToggle.jsx";
const LOGIN_URL = "/Login";
const Login = () => {
  // const { setAuth, persist, setPersist } = useAuth();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const userRef = useRef();
  const errRef = useRef();

  // const [user, setUser] = useState("");
  // const [user, setUser] = useLocalStorage("user", "");
  // const [user, resetUser, userAttributes] = useInput("");
  const [user, resetUser, userAttributes] = useInput("user", "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [check, toggleCheck] = useToggle("persist", false);

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setError("");
  }, [user, password]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response));
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ user, password, roles, accessToken });
      resetUser();
      setPassword("");
      navigate(from, { replace: true });
    } catch (error) {
      if (!error?.response) {
        setError("No server response");
      } else if (error?.response?.data === 400) {
        setError("Missing Username or password");
      } else if (error?.response?.data === 401) {
        setError("Unauthorized");
      } else {
        setError("Login Failed");
      }
      errRef.current.focus();
    }
  };
  /*const togglePersist = () => {
    setPersist((prev) => !prev);
  };
  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);*/

  return (
    <section>
      <p
        ref={errRef}
        className={error ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {error}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          required
          autoComplete="off"
          {...userAttributes}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button>Sign in</button>
        <div className="persistCheck">
          <input
            type="checkbox"
            id="persist"
            // checked={persist}
            // onChange={togglePersist}
            checked={check}
            onChange={toggleCheck}
          />
          <label htmlFor="persist">Trust this device</label>
        </div>
      </form>
      <p>
        Need an account?
        <br />
        <span>
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>
  );
};

export default Login;

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../api/axios";
import { Link } from "react-router-dom";
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/register";
const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchPasswordFocus, setMatchPasswordFocus] = useState(false);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);
  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === confirmPassword);
  }, [password, confirmPassword]);
  useEffect(() => {
    setError("");
  }, [user, password, confirmPassword]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validUser = USER_REGEX.test(user);
    const validPassword = PWD_REGEX.test(password);

    if (!validUser || !validPassword) {
      setError("Invalid Entry");
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, password }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
    } catch (error) {
      if (error?.response) {
        setError("No server response");
      } else if (error?.response?.status === 409) {
        setError("Username Already taken");
      } else {
        setError("Something went wrong");
      }
      errRef.current.focus();
    }
  };
  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#/">Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p className={error ? "errmsg" : "offscreen"} aria-live="assertive">
            {error}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !user ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              aria-invalid={validName ? false : true}
              ref={userRef}
              required
              value={user}
              autoComplete="off"
              aria-describedby="uidnote"
              onChange={(e) => setUser(e.target.value)}
              className={user}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              className={
                !validName && user && userFocus ? "instructions" : "offscreen"
              }
              id="uidnote"
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
            <label htmlFor="password">
              Password:{" "}
              <FontAwesomeIcon
                icon={faCheck}
                className={validPassword ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPassword || !password ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              value={password}
              required
              aria-describedby="passwordnote"
              aria-invalid={validPassword ? false : true}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordFocus(false)}
              onFocus={() => setPasswordFocus(true)}
            />
            <p
              id="passwordnote"
              className={
                !validPassword && passwordFocus ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>
            <label htmlFor="confirm_password">
              Confirm Password:{" "}
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && confirmPassword ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !confirmPassword ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              aria-invalid={validMatch ? false : true}
              aria-describedby="confirmnote"
              onFocus={() => setMatchPasswordFocus(true)}
              onBlur={() => setMatchPasswordFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchPasswordFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>
            <button
              disabled={
                !validMatch || !validName || !validPassword ? true : false
              }
            >
              Sign Up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/*put router link here*/}
              <Link to="/login">Sign In</Link>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;

import { useEffect, useState } from "react";
// import axios from "../api/axios";
import useRefreshToken from "../hooks/useRefreshToken";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
const USERS = "/users";
const Users = () => {
  const [users, setUsers] = useState([]);
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        // const response = await axios.get(USERS, {
        const response = await axiosPrivate.get(USERS, {
          signal: controller.signal,
        });
        console.log(response?.data);
        isMounted && setUsers(response?.data);
      } catch (error) {
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getUsers();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <article>
      <h1>Users List</h1>
      {users?.length ? (
        <ul>
          {users.map((user, i) => {
            <li key={i}>{user.username}</li>;
          })}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
      <button onClick={() => refresh()}>Refresh</button>
    </article>
  );
};

export default Users;

import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Register from "./components/Register";
import Admin from "./components/Admin";
import Editor from "./components/Editor";
import Lounge from "./components/Lounge";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import LinkPage from "./components/LinkPage";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
const ROLES = {
  User: 11,
  Admin: 19,
  Editor: 50,
};
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="linkpage" element={<LinkPage />} />
        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route index element={<Home />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
            <Route path="editor" element={<Editor />} />
          </Route>
          <Route
            element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}
          >
            <Route path="lounge" element={<Lounge />} />
          </Route>
        </Route>
        {/* catch */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}
export default App;

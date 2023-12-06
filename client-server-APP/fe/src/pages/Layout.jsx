import { Link, Outlet, useNavigate } from "react-router-dom";
import { useGlobalState, useDispatch } from "../store";
import { useEffect } from "react";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { info } = useGlobalState();

  // check route, if / then redirect to /signIn
  useEffect(() => {
    const name = window.location.pathname
    if (name === "/") {
      navigate("/signIn");
    }

    if (info) {
      return;
    }

    if (name === '/driver' || name === '/rider' || name === '/schedule' || name === '/editProfile') {
      navigate("/signIn")
    }
  }, []);

  const jump = (path) => {
    navigate(path);
  };

  const signOut = () => {
    dispatch({ type: "SIGNOUT" });
    navigate("/signIn")
  };

  if (!info) {
    return (
      <>
        <header>
          <b onClick={() => jump("/signIn")}>SignIn</b>
          <b onClick={() => jump("/signUp")}>SignUp</b>
          <b onClick={() => jump("/tutorial")}>Tutorial</b>
        </header>
        <div id="content">
          <Outlet />
        </div>
      </>
    );
  }

  return (
    <>
      <header>
        <b onClick={() => jump("/schedule")}>Schedule</b>
        <b onClick={() => jump("/tutorial")}>Tutorial</b>
        {info.type === "Driver" && <b onClick={() => jump("/driver")}>Driver</b>}
        {info.type === "Rider" && <b onClick={() => jump("/rider")}>Rider</b>}
        <b onClick={() => jump("/editProfile")}>EditProfile</b>
        <b onClick={signOut}>SignOut</b>
      </header>
      <div id="content">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;

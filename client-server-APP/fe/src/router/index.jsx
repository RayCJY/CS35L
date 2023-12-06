import { createBrowserRouter } from "react-router-dom";

import Layout from "../pages/Layout"
import SignIn from "../pages/signIn"
import SignUp from "../pages/signUp"
import Tutorial, { PageOne, PageTwo, PageThree, PageFour, PageFive} from "../pages/tutorial"
import Driver from "../pages/driver"
import Rider from "../pages/rider"
import Schedule from "../pages/schedule"
import EditProfile from "../pages/editProfile"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{
      path: "signIn",
      element: <SignIn />,
    }, {
      path: "signUp",
      element: <SignUp />,
    }, {
      path: "/tutorial",
      element: <Tutorial />,
      children: [{
        path: "page-one",
        element: <PageOne />,
      }, {
        path: "page-two",
        element: <PageTwo />,
      }, {
        path: "page-three",
        element: <PageThree />,
      }, {
        path: "page-four",
        element: <PageFour />,
      }, {
        path: "page-five",
        element: <PageFive />,
      }]
    }, {
      path: "driver",
      element: <Driver />,
    }, {
      path: "rider",
      element: <Rider />,
    }, {
      path: "schedule",
      element: <Schedule />,
    }, {
      path: "editProfile",
      element: <EditProfile />,
    }]
  },
]);

export default router;
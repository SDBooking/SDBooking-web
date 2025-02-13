import { ClientRouteKey, AuthKey } from "../common/constants/keys";
import withAuth from "../common/hoc/withAuth";
import BookPage from "../pages/book/BookPage";
import CalendarPage from "../pages/calendar/CalendarPage";
import HomePage from "../pages/home/HomePage";
import LandingPage from "../pages/landing/LandingPage";
import LoginPage from "../pages/login/LoginPage";
import OAuthPage from "../pages/oauth/OAuthPage";
import RoomEdit from "../pages/room/RoomEdit";
import RoomManagementPage from "../pages/room/RoomManagementPage";
import RoomManipulatePage from "../pages/room/RoomManipulate";
import SettingPage from "../pages/setting/SettingPage";
import UserSettingPage from "../pages/user/UserSettingPage";

type Route = {
  path: string;
  component?: React.ComponentType;
};

const routes: Route[] = [
  {
    path: ClientRouteKey.Home,
    component: withAuth(AuthKey.Both)(CalendarPage),
  },
  {
    path: ClientRouteKey.Book,
    component: withAuth(AuthKey.Both)(BookPage),
  },
  {
    path: ClientRouteKey.Calendar,
    component: withAuth(AuthKey.Both)(CalendarPage),
  },
  {
    path: ClientRouteKey.History,
    component: withAuth(AuthKey.Both)(HomePage),
  },
  {
    path: ClientRouteKey.Setting,
    component: withAuth(AuthKey.AdminAuth)(SettingPage),
  },
  {
    path: ClientRouteKey.RoomManagement,
    component: withAuth(AuthKey.AdminAuth)(RoomManagementPage),
  },
  {
    path: ClientRouteKey.RoomManipulate,
    component: withAuth(AuthKey.AdminAuth)(RoomManipulatePage),
  },
  {
    path: `${ClientRouteKey.RoomUpdate}/:roomId`,
    component: withAuth(AuthKey.AdminAuth)(RoomEdit),
  },
  {
    path: ClientRouteKey.UserSetting,
    component: withAuth(AuthKey.AdminAuth)(UserSettingPage),
  },
  {
    path: ClientRouteKey.Login,
    component: LoginPage,
  },
  {
    path: ClientRouteKey.Landing,
    component: LandingPage,
  },
  {
    path: ClientRouteKey.OAuth,
    component: OAuthPage,
  },
  //   {
  //     path: ClientRouteKey.Profile,
  //     component: withAuth(AuthKey.UserAuth)(ProfilePage),
  //   },
  //   {
  //     path: ClientRouteKey.Plan,
  //     component: withAuth(AuthKey.UserAuth)(PlanPage),
  //   },
];

export default routes;

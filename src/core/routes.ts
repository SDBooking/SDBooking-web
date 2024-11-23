import { ClientRouteKey, AuthKey } from "../common/constants/keys";
import withAuth from "../common/hoc/withAuth";
import BookPage from "../pages/book/BookPage";
import CalendarPage from "../pages/calendar/CalendarPage";
import HistoryPage from "../pages/history/HistoryPage";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/login/LoginPage";
import OAuthPage from "../pages/oauth/OAuthPage";
import RoomManagementPage from "../pages/room/RoomManagementPage";
import SettingPage from "../pages/setting/SettingPage";

type Route = {
  path: string;
  component: React.ComponentType;
};
const routes: Route[] = [
  {
    path: ClientRouteKey.Home,
    component: withAuth(AuthKey.Both)(HomePage),
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
    component: withAuth(AuthKey.Both)(HistoryPage),
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
    path: ClientRouteKey.Login,
    component: LoginPage,
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

import { ClientRouteKey, AuthKey } from "../common/constants/keys";
import withAuth from "../common/hoc/withAuth";
import BookPage from "../pages/book/BookPage";
import CalendarPage from "../pages/calendar/CalendarPage";
import HistoryPage from "../pages/history/HistoryPage";
import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/login/LoginPage";
import OAuthPage from "../pages/oauth/OAuthPage";

type Route = {
  path: string;
  component: React.ComponentType;
};
const routes: Route[] = [
  {
    path: ClientRouteKey.Home,
    component: withAuth(AuthKey.UserAuth)(HomePage),
  },
  {
    path: ClientRouteKey.Book,
    component: withAuth(AuthKey.UserAuth)(BookPage),
  },
  {
    path: ClientRouteKey.Calendar,
    component: withAuth(AuthKey.UserAuth)(CalendarPage),
  },
  {
    path: ClientRouteKey.History,
    component: withAuth(AuthKey.UserAuth)(HistoryPage),
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

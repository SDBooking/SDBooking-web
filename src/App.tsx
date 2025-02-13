import { Toaster } from "react-hot-toast";
import { useQuery } from "react-query";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import useAccountContext from "./common/contexts/AccountContext";
import { validateLocalToken } from "./core/auth";
import { ClientRouteKey } from "./common/constants/keys";
import routes from "./core/routes";
import PageLayout from "./common/components/layouts/PageLayout";

import FixedLayer from "./common/components/layers/FixLayer";
import DebugPanel from "./debug/DebugPanel";

import { createTheme, ThemeProvider } from "@mui/material";
import { usePopupContext } from "./common/contexts/PopupContext";
import Popup from "./common/components/popup/Popup";

const theme = createTheme({
  typography: {
    fontFamily: ["Kanit"].join(","),
  },
  palette: {
    primary: {
      main: "#F3A51D", // You can change this to your desired primary color
    },
    secondary: {
      main: "#FF5963", // You can change this to your desired secondary color
    },
  },
});

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccountData } = useAccountContext();
  const { visible } = usePopupContext();

  const { status } = useQuery("init", initData, {
    staleTime: Infinity,
    onSuccess: (data) => {
      if (data) {
        setAccountData(data);
      } else {
        if (location.pathname !== ClientRouteKey.OAuth) {
          navigate(ClientRouteKey.Landing, { replace: true });
        }
      }
    },
  });

  async function initData() {
    const [data] = await Promise.all([validateLocalToken()]);

    return data;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Toaster />
        {visible && <Popup />}
        <FixedLayer>
          <DebugPanel isDisplayed={false} routes={routes} />
        </FixedLayer>

        {status === "loading" ? null : status === "success" ? (
          <Routes>
            {routes.map(({ path, component: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PageLayout>
                    {Component ? (
                      <Component />
                    ) : (
                      <Navigate to={ClientRouteKey.Landing} replace={true} />
                    )}
                  </PageLayout>
                }
              />
            ))}
          </Routes>
        ) : (
          <Navigate to={ClientRouteKey.Landing} replace={true} />
        )}
      </ThemeProvider>
    </>
  );
}

export default App;

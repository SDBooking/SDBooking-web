import { AuthKey } from "../constants/keys";
import Unauth from "../components/middleware/unauth";
import { useLoadingContext } from "react-router-loading";
import useAccountContext from "../contexts/AccountContext";
import Navbar from "../components/navbar/Navbar";
import { useEffect, useState } from "react";

function withAuth(authType: AuthKey) {
  return <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    return function WithAuthComponent(props: P) {
      const loadingContext = useLoadingContext();
      const { accountData } = useAccountContext();
      // how to check width of screen
      const [isMobile, setIsMobile] = useState(false);

      useEffect(() => {
        const handleResize = () => {
          if (screen.width < 768) {
            setIsMobile(true);
          } else {
            setIsMobile(false);
          }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        window.addEventListener("orientationchange", handleResize);

        // Cleanup event listeners on component unmount
        return () => {
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("orientationchange", handleResize);
        };
      }, []);

      // for dev
      // if (authType === AuthKey.UserAuth) {
      //   return (
      //     <>
      //       <Navbar />
      //       <WrappedComponent {...props} />
      //     </>
      //   );
      // }

      // for prod
      if (
        authType === accountData?.userData.role ||
        (authType === "Both" && accountData)
      ) {
        return (
          <>
            <Navbar isMobile={isMobile} />
            <WrappedComponent {...props} />
          </>
        );
      }
      loadingContext.done();
      return <Unauth />;
    };
  };
}

export default withAuth;

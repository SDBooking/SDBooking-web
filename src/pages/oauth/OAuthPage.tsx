import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { ClientRouteKey, LocalStorageKey } from "../../common/constants/keys";
import { coreApi } from "../../core/connections";
import useAccountContext from "../../common/contexts/AccountContext";
import { getUserDataQuerySelector } from "../../common/apis/selectors";
import PageContainer from "../../common/components/container/PageContainer";
import { CircularProgress } from "@mui/material";
import { useMutation } from "react-query";
import { getLoginValidationQuery } from "./apis/queries";

function OAuthPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const navigate = useNavigate();
  const { setAccountData } = useAccountContext();

  const {
    status: statusLoginValidation,
    isLoading: isLoadingLoginValidation,
    mutateAsync: mutateAsyncLoginValidation,
  } = useMutation(getLoginValidationQuery, {
    onError() {
      toast.error("รหัสผ่านหรือชื่อผู้ใช้ไม่ถูกต้อง");
    },
  });

  const {
    status: statusUserData,
    isLoading: isLoadingUserData,
    mutateAsync: mutateAsyncUserData,
  } = useMutation(getUserDataQuerySelector, {
    onSuccess() {
      toast.success("เข้าสู่ระบบสำเร็จ");
    },
    onError() {
      toast.error("รหัสผ่านหรือชื่อผู้ใช้ไม่ถูกต้อง");
    },
  });

  const isLoading: boolean = isLoadingLoginValidation || isLoadingUserData;
  const isError: boolean =
    statusLoginValidation === "error" || statusUserData === "error";

  useEffect(() => {
    async function callbackHandler() {
      if (code) {
        const res = (await mutateAsyncLoginValidation(code)) as {
          result: string;
        };

        coreApi.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.result}`;
        localStorage.setItem(LocalStorageKey.Auth, res.result);

        try {
          const data = await mutateAsyncUserData();
          setAccountData(data.userData);
          navigate(ClientRouteKey.Home);
        } catch (e) {
          throw new Error("Failed to fetch configuration");
        }
      }
    }

    callbackHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (isError) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center h-full">
          {isLoading ? (
            <CircularProgress size={60} thickness={5} />
          ) : (
            <div className="text-red-800 text-base md:text-4xl font-bold">
              Failed to login
            </div>
          )}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex justify-center items-center h-full">
        <div className="text-maincolor text-base md:text-4xl font-bold">
          Redirecting...
        </div>
      </div>
    </PageContainer>
  );
}

export default OAuthPage;

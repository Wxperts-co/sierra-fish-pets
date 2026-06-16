"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import ReduxProvider from "@/store/provider";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";
import { setWishlist } from "@/store/slices/wishlistSlice";
import { openLoginModalWithMessage, openRegisterModalWithMessage } from "@/store/slices/authModalSlice";

function SessionSync() {
  const { status } = useSession();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoggingOut } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const syncSession = async () => {
      if (status === "authenticated" && !isAuthenticated && !isLoggingOut) {
        try {
          const res = await axios.post("/api/auth/google-sync");
          if (res.data.success) {
            dispatch(setUser(res.data.user));
            dispatch(setWishlist(res.data.user.wishlist || []));
          }
        } catch (error) {
          console.error("Failed to sync Google session with custom token:", error);
        }
      }
    };

    syncSession();
  }, [status, isAuthenticated, isLoggingOut, dispatch]);

  return null;
}

function QueryParamAuthListener() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams) return;
    const errorParam = searchParams.get("error");
    const successParam = searchParams.get("success");

    if (errorParam === "UserNotExist") {
      dispatch(openRegisterModalWithMessage("User does not exist, please sign up."));
      router.replace(window.location.pathname);
    } else if (errorParam === "UserAlreadyExists") {
      dispatch(openLoginModalWithMessage("Account already exists. Please login."));
      router.replace(window.location.pathname);
    } else if (successParam === "GoogleAccountCreated") {
      dispatch(openLoginModalWithMessage("Account created successfully. Continue to login."));
      router.replace(window.location.pathname);
    } else if (successParam === "PasswordResetSuccess") {
      dispatch(openLoginModalWithMessage("Password reset successfully. Please login with your new password."));
      router.replace(window.location.pathname);
    }
  }, [searchParams, dispatch, router]);

  return null;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ReduxProvider>
        <SessionSync />
        <Suspense fallback={null}>
          <QueryParamAuthListener />
        </Suspense>
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}

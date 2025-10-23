import { Href, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import { ROUTES, STORE_TOKEN } from "@/lib/utils/constants";

function App() {
  const router = useRouter();

  useEffect(() => {
    let didRedirect = false;
    const TIMEOUT_MS = 5000; // 5 giây

    const init = async () => {
      try {
        const token = await SecureStore.getItemAsync(STORE_TOKEN);

        if (didRedirect) return; // tránh redirect 2 lần

        if (token && token.trim().length > 0) {
          router.replace(ROUTES.home as Href);
        } else {
          router.replace(ROUTES.login as Href);
        }

        didRedirect = true;
      } catch (error) {
        console.error("Error checking token:", error);
        if (!didRedirect) {
          router.replace(ROUTES.login as Href);
          didRedirect = true;
        }
      }
    };

    // chạy kiểm tra token
    init();

    // Timeout fallback sau 5 giây
    const timeout = setTimeout(() => {
      if (!didRedirect) {
        console.warn("⏰ Timeout reached — fallback to Login page.");
        router.replace(ROUTES.login as Href);
        didRedirect = true;
      }
    }, TIMEOUT_MS);

    // cleanup tránh memory leak
    return () => clearTimeout(timeout);
  }, []);

  return <SpinnerComponent />;
}

export default App;

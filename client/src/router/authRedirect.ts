import type { NavigateFunction, Location } from "react-router-dom";

export function goToLogin(navigate: NavigateFunction, location: Location) {
  const returnTo = location.pathname + location.search;

  const to = "/auth/login-student";

  navigate(to, {
    replace: true,
    state: { returnTo },
  });
}

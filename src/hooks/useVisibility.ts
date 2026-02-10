import { useLayoutEffect, useState } from "react";

const useVisibility = (): boolean => {
  const [foreground, setForeground] = useState(true);

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      setForeground(true);
    } else {
      setForeground(false);
    }
  };

  useLayoutEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return foreground;
};

export default useVisibility;

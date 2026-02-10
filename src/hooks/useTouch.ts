import { useEffect, useState } from "react";

const useTouch = (): boolean => {
  const [touch, setTouch] = useState(false);

  const isTouchDevice = (): boolean =>
    Boolean(
      "ontouchstart" in window ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 0),
    );

  useEffect(() => {
    setTouch(isTouchDevice());
  }, []);

  return touch;
};

export default useTouch;

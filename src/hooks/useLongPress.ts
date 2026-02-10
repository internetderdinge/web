import { useCallback, useRef, useState } from "react";

type LongPressOptions = {
  shouldPreventDefault?: boolean;
  delay?: number;
};

type EventLike = {
  target?: EventTarget | null;
};

type TouchEventLike = EventLike & {
  touches?: TouchList;
  preventDefault?: () => void;
};

const isTouchEvent = (event: TouchEventLike) => "touches" in event;

const preventDefault = (event: TouchEventLike) => {
  if (!isTouchEvent(event)) return;

  if (event.touches && event.touches.length < 2 && event.preventDefault) {
    event.preventDefault();
  }
};

const useLongPress = (
  onLongPress: (event: TouchEventLike) => void,
  onClick: () => void,
  { shouldPreventDefault = true, delay = 1000 }: LongPressOptions = {},
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [pressStarted, setPressStarted] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const target = useRef<EventTarget | null>(null);

  const start = useCallback(
    (event: TouchEventLike) => {
      if (shouldPreventDefault && event.target) {
        document.body.classList.add("no-textselect");
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        } as AddEventListenerOptions);
        target.current = event.target;
      }
      setPressStarted(true);
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault],
  );

  const clear = useCallback(
    (_event: TouchEventLike, shouldTriggerClick = true) => {
      setTimeout(() => {
        document.body.classList.remove("no-textselect");
      }, 1000);
      setPressStarted(false);
      if (timeout.current) clearTimeout(timeout.current);
      if (shouldTriggerClick && !longPressTriggered) onClick();
      setLongPressTriggered(false);
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault);
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered],
  );

  return {
    onMouseDown: (event: TouchEventLike) => start(event),
    onTouchStart: (event: TouchEventLike) => start(event),
    onMouseUp: (event: TouchEventLike) => clear(event),
    onMouseLeave: (event: TouchEventLike) => clear(event, false),
    onTouchEnd: (event: TouchEventLike) => clear(event),
    pressStarted,
  };
};

export default useLongPress;

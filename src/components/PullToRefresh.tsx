import React, { useCallback, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";

type PullToRefreshProps = {
  className?: string;
  children: React.ReactNode;
  onRefresh?: () => void | Promise<void>;
};

const PULL_THRESHOLD = 80;
const MAX_PULL = 140;

export default function PullToRefresh({
  className,
  children,
  onRefresh,
}: PullToRefreshProps) {
  const startYRef = useRef<number | null>(null);
  const isPullingRef = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isInsideModal = useCallback((target: EventTarget | null) => {
    if (!target || !(target instanceof Element)) return false;
    return Boolean(target.closest(".wfp--modal"));
  }, []);

  const canStartPull = useCallback(() => {
    return window.scrollY <= 0;
  }, []);

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (isRefreshing || !canStartPull() || isInsideModal(event.target)) {
        return;
      }

      startYRef.current = event.touches[0].clientY;
      isPullingRef.current = true;
      setIsPulling(true);
    },
    [canStartPull, isInsideModal, isRefreshing],
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!isPullingRef.current || startYRef.current === null) return;
      if (isInsideModal(event.target)) return;

      const delta = event.touches[0].clientY - startYRef.current;
      if (delta <= 0) {
        setPullDistance(0);
        return;
      }

      if (!canStartPull()) return;
      event.preventDefault();
      setPullDistance(Math.min(delta, MAX_PULL));
    },
    [canStartPull, isInsideModal],
  );

  const finalizeRefresh = useCallback(() => {
    setIsRefreshing(false);
    setPullDistance(0);
  }, []);

  const runRefresh = useCallback(async () => {
    setIsRefreshing(true);

    if (!onRefresh) {
      setTimeout(() => {
        window.location.reload();
      }, 150);
      return;
    }

    try {
      await Promise.resolve(onRefresh());
    } finally {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      finalizeRefresh();
    }
  }, [finalizeRefresh, onRefresh]);

  const handleTouchEnd = useCallback(() => {
    if (!isPullingRef.current) return;

    isPullingRef.current = false;
    setIsPulling(false);

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      void runRefresh();
      return;
    }

    setPullDistance(0);
  }, [isRefreshing, pullDistance, runRefresh]);

  const indicatorState = useMemo(() => {
    if (isRefreshing) return "refreshing";
    if (pullDistance >= PULL_THRESHOLD) return "release";
    return "pull";
  }, [isRefreshing, pullDistance]);

  return (
    <div
      className={`${styles.pullToRefresh}${className ? ` ${className}` : ""}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        transform: pullDistance ? `translateY(${pullDistance}px)` : undefined,
        transition: isPulling ? "none" : "transform 180ms ease",
      }}
    >
      <div className={styles.pullIndicator} aria-live="polite">
        {indicatorState === "refreshing" ? (
          <span className={styles.pullIndicatorContent}>
            Refreshing...
          </span>
        ) : indicatorState === "release" ? (
          <span className={styles.pullIndicatorContent}>
            Release to refresh
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

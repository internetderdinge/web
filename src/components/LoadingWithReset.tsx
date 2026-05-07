import React, { useEffect } from "react";
import { Button, Loading } from "@progressiveui/react";
import {
  hiddenLoadingWithResetState,
  type LoadingWithResetState,
  type LoadingWithResetStateSetter,
} from "../hooks/useLoadingWithResetState";
import styles from "./loadingWithReset.module.scss";

type LoadingWithResetContextValue = {
  setLoadingWithResetState: LoadingWithResetStateSetter;
};

type LoadingWithResetProviderProps = {
  children: React.ReactNode;
  onLogout?: () => Promise<void> | void;
  resetDelayMs?: number;
  resetLabel?: React.ReactNode;
  appVersion?: React.ReactNode;
  logoutPath?: string;
};

type LoadingWithResetProps = {
  onLogout?: () => Promise<void> | void;
  title?: React.ReactNode;
  message?: React.ReactNode;
  resetDelayMs?: number;
  resetLabel?: React.ReactNode;
  appVersion?: React.ReactNode;
  logoutPath?: string;
};

const LoadingWithResetContext = React.createContext<
  LoadingWithResetContextValue | undefined
>(undefined);

export const useLoadingWithResetContext = () => {
  const context = React.useContext(LoadingWithResetContext);

  if (!context) {
    throw new Error(
      "useLoadingWithResetContext must be used within LoadingWithResetProvider",
    );
  }

  return context;
};

export const LoadingWithReset = ({
  onLogout,
  title,
  message,
  resetDelayMs = 15000,
  resetLabel = "Reset local data",
  appVersion,
  logoutPath = "/logout",
}: LoadingWithResetProps) => {
  const [showReset, setShowReset] = React.useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowReset(true);
    }, resetDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [resetDelayMs]);

  const handleReset = async () => {
    try {
      await onLogout?.();
    } catch (error) {
      console.log("Logout failed", error);
    }

    window.localStorage.clear();
    window.location.assign(logoutPath);
  };

  return (
    <div className={styles.container}>
      <Loading />
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {message && <div className={styles.message}>{message}</div>}
        {showReset && (
          <>
            <Button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
            >
              {resetLabel}
            </Button>
            {appVersion ? (
              <div className={styles.appVersion}>{appVersion}</div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export const LoadingWithResetProvider = ({
  children,
  onLogout,
  resetDelayMs,
  resetLabel,
  appVersion,
  logoutPath,
}: LoadingWithResetProviderProps) => {
  const [loadingWithResetState, setLoadingWithResetState] =
    React.useState<LoadingWithResetState>(hiddenLoadingWithResetState);

  return (
    <LoadingWithResetContext.Provider value={{ setLoadingWithResetState }}>
      {loadingWithResetState.isVisible && (
        <LoadingWithReset
          onLogout={onLogout}
          title={loadingWithResetState.title}
          message={loadingWithResetState.message}
          resetDelayMs={resetDelayMs}
          resetLabel={resetLabel}
          appVersion={appVersion}
          logoutPath={logoutPath}
        />
      )}
      {children}
    </LoadingWithResetContext.Provider>
  );
};

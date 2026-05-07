import { useEffect } from "react";

export type LoadingWithResetState = {
  isVisible: boolean;
  title?: React.ReactNode;
  message?: React.ReactNode;
};

export type LoadingWithResetStateSetter = React.Dispatch<
  React.SetStateAction<LoadingWithResetState>
>;

export const hiddenLoadingWithResetState: LoadingWithResetState = {
  isVisible: false,
};

export const defaultLoadingWithResetText = {
  title: "Loading",
  message: "Please wait...",
};

type UseSyncLoadingWithResetStateArgs = {
  isVisible: boolean;
  setLoadingWithResetState: LoadingWithResetStateSetter;
  title?: React.ReactNode;
  message?: React.ReactNode;
};

export default function useSyncLoadingWithResetState({
  isVisible,
  setLoadingWithResetState,
  title,
  message,
}: UseSyncLoadingWithResetStateArgs) {
  useEffect(() => {
    if (isVisible) {
      setLoadingWithResetState({
        isVisible: true,
        title,
        message,
      });
    } else {
      setLoadingWithResetState(hiddenLoadingWithResetState);
    }

    return () => {
      setLoadingWithResetState(hiddenLoadingWithResetState);
    };
  }, [isVisible, message, setLoadingWithResetState, title]);
}

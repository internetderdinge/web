import { useMediaQuery } from "react-responsive";
import mediaQueries from "../utils/mediaQueries";

const useIsDesktop = (): boolean => {
  const isDesktopOrLaptop = useMediaQuery(mediaQueries.mediaMaxXs);
  const isPrint = useMediaQuery({ print: true });
  return isDesktopOrLaptop || isPrint;
};

export const useIsPrint = (): boolean => {
  const isPrint = useMediaQuery({ print: true });
  return isPrint;
};

export default useIsDesktop;

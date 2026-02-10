import { differenceInDays, formatDistanceStrict } from "date-fns";
import { enUS as locale } from "date-fns/locale/en-US";
import type { Locale } from "date-fns";

const formatDistanceLocale = {
  lessThanXSeconds: "{{count}}s",
  xSeconds: "{{count}}s",
  halfAMinute: "30s",
  lessThanXMinutes: "{{count}} min",
  xMinutes: "{{count}} min",
  aboutXHours: "{{count}} h",
  xHours: "{{count}} h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

const formatDistance = (
  token: keyof typeof formatDistanceLocale,
  count: number,
  options?: { addSuffix?: boolean; comparison?: number },
): string => {
  const result = formatDistanceLocale[token].replace(
    "{{count}}",
    String(count),
  );

  if (options?.addSuffix) {
    if ((options.comparison ?? 0) > 0) {
      return `in ${result}`;
    }
    return `${result} ago`;
  }

  return result;
};

const isInvalidDate = (value: Date | number): boolean =>
  Number.isNaN(Number(value));

const formatDistanceShort = (
  date: Date | number,
  baseDate: Date | number,
  localeDate?: Locale,
): string => {
  if (isInvalidDate(date) || isInvalidDate(baseDate)) {
    return "";
  }

  const localeSel = localeDate ?? locale;
  return formatDistanceStrict(date, baseDate, {
    locale: {
      ...localeSel,
      formatDistance,
    },
  });
};

export const distanceInDaysFunc = (
  date: Date | number,
  baseDate: Date | number,
): number => {
  if (isInvalidDate(date) || isInvalidDate(baseDate)) {
    return 0;
  }
  return differenceInDays(date, baseDate);
};

export default formatDistanceShort;

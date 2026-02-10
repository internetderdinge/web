export const devAppsBaseReplacement = (input?: string | null) => {
  if (!input) return input;

  return import.meta.env.MODE === "development" ||
    import.meta.env.MODE === "local.wirewire"
    ? input.replace("https://apps.paperlesspaper.de", "http://localhost:3001")
    : input;
};

export const resolvePossiblyRelativeUrl = (
  maybeUrl?: string | null,
  baseUrl?: string | null,
) => {
  if (!maybeUrl) return null;
  if (maybeUrl.startsWith("http")) return maybeUrl;

  if (baseUrl && baseUrl.startsWith("http")) {
    try {
      return new URL(maybeUrl, baseUrl).toString();
    } catch {
      return maybeUrl;
    }
  }

  return maybeUrl;
};

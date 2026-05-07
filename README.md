# @internetderdinge/web

Shared web library for functionality used by both memo-web and paperlesspaper web apps.

## What this package contains

- Shared utility functions (string, date, URL, object helpers)
- Shared React hooks (device, touch, visibility, media)
- Shared loading/reset state primitives for app-level global loading overlays
- Shared loading/reset UI + context provider for auth/route guards

## Install

```bash
yarn add @internetderdinge/web
```

## Development

```bash
yarn build
yarn dev
```

## Scripts

- `yarn build` - build to `dist/`
- `yarn dev` - watch mode

## Exports

### Utils

- `capitalize`
- `capitalizeFirstLetter`
- `flatten`
- `formatDistanceShort`
- `distanceInDaysFunc`
- `mediaQueries`
- `pickValues`
- `roleList`
- `scrollToTop`
- `urlToken`
- `devAppsBaseReplacement`
- `resolvePossiblyRelativeUrl`

### Hooks

- `useContainerDimensions`
- `useIsDesktop`
- `useIsPrint`
- `useIsIos`
- `useLocaleDate`
- `useLongPress`
- `useTouch`
- `useVisibility`
- `useSyncLoadingWithResetState`

### Loading/Reset shared values

- `defaultLoadingWithResetText`
- `hiddenLoadingWithResetState`
- `LoadingWithResetState` (type)
- `LoadingWithResetStateSetter` (type)

### Loading/Reset components

- `LoadingWithReset`
- `LoadingWithResetProvider`
- `useLoadingWithResetContext`

### External re-export

- `useMediaQuery` from `react-responsive`

## Global loading/reset integration

The package now includes both state helpers and the shared loader UI/provider. Apps can use `LoadingWithResetProvider` directly and drive visibility/text through `useSyncLoadingWithResetState`.

Typical flow:

1. Wrap router/app content in `LoadingWithResetProvider`.
2. Route guards/screens call `useLoadingWithResetContext()` and pass the setter to `useSyncLoadingWithResetState(...)`.
3. Return `null` while route auth/token checks are pending so the global loader is shown.

### Provider setup

```tsx
import { LoadingWithResetProvider } from "@internetderdinge/web";

<LoadingWithResetProvider
  onLogout={logout}
  resetDelayMs={3000}
  resetLabel="Reset local data"
  appVersion={import.meta.env.REACT_APP_VERSION}
>
  {children}
</LoadingWithResetProvider>;
```

Provider props:

- `onLogout?: () => Promise<void> | void`
- `resetDelayMs?: number` (default: `15000`)
- `resetLabel?: React.ReactNode` (default: `Reset local data`)
- `appVersion?: React.ReactNode`
- `logoutPath?: string` (default: `/logout`)

Example route usage:

```tsx
import {
  defaultLoadingWithResetText,
  useLoadingWithResetContext,
  useSyncLoadingWithResetState,
} from "@internetderdinge/web";

const { setLoadingWithResetState } = useLoadingWithResetContext();

useSyncLoadingWithResetState({
  isVisible: showLoading,
  setLoadingWithResetState,
  ...defaultLoadingWithResetText,
});
```

Example login callback usage:

```tsx
import { useSyncLoadingWithResetState } from "@internetderdinge/web";

useSyncLoadingWithResetState({
  isVisible: isProcessingLogin,
  setLoadingWithResetState,
  title: "Processing login",
  message: isDelayedLoading
    ? "Authorization is getting processed"
    : "You will be redirected",
});
```

## Local package testing (yalc)

When testing unpublished changes in another repo:

```bash
# inside this package
yalc publish

# inside consumer package
yalc add @internetderdinge/web
yarn install
```

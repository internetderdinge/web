const scrollToTop = (position = 0): void => {
  const noSidebarScroll = document.getElementById("no-sidebar-scroll");
  if (noSidebarScroll) noSidebarScroll.scrollTo(0, position);

  const root = document.getElementById("root");
  if (root) root.scrollTo(0, position);

  const appElements = document.getElementsByClassName("App");
  if (appElements && appElements.length > 0) {
    (appElements[0] as HTMLElement).scrollTo(0, position);
  }

  const authWrapperScroll = document.getElementById("auth-wrapper-scroll");
  if (authWrapperScroll) authWrapperScroll.scrollTo(0, position);

  const scrollContainer = document.getElementById("scroll-container");
  if (scrollContainer) scrollContainer.scrollTo(0, position);

  window.scrollTo(0, position);

  const sidebarChildren = document.getElementsByClassName(
    "wfp--sidebar-content__children",
  );
  if (sidebarChildren && sidebarChildren.length > 0) {
    (sidebarChildren[0] as HTMLElement).scrollTo(0, position);
  }
};

export default scrollToTop;

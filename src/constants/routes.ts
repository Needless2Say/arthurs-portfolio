export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PROJECTS: "/projects",
  RESUME: "/resume",
  BLOG: "/blog",
  CONTACT: "/contact",
} as const;

export const NAV_LINKS = [
  { name: "Home", path: ROUTES.HOME },
  { name: "About", path: ROUTES.ABOUT },
  { name: "Projects", path: ROUTES.PROJECTS },
  { name: "Resume", path: ROUTES.RESUME },
  { name: "Blog", path: ROUTES.BLOG },
  { name: "Contact", path: ROUTES.CONTACT },
] as const;

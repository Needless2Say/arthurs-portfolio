export const ROUTES = {
	HOME: "/",
	ABOUT: "/about",
	LIFE: "/life",
	PROJECTS: "/projects",
	RESUME: "/resume",
	BLOG: "/blog",
	CONTACT: "/contact",
} as const;

export const NAV_LINKS = [
	{ name: "Home", path: ROUTES.HOME },
	{ name: "About", path: ROUTES.ABOUT },
	{ name: "Life", path: ROUTES.LIFE },
	{ name: "Projects", path: ROUTES.PROJECTS },
	{ name: "Resume", path: ROUTES.RESUME },
	{ name: "Blog", path: ROUTES.BLOG },
	{ name: "Contact", path: ROUTES.CONTACT },
] as const;
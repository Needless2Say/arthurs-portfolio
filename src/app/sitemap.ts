import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/constants/blog";

export const dynamic = "force-static";

const BASE = "https://needless2say.github.io/arthurs-portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
	/*
	  The blog is only listed once it has posts. Submitting an empty page is a
	  thin content signal against the whole site, and the blog route itself sets
	  noindex under the same condition, so the two stay in step. Add a post and
	  both flip back on their own.
	*/
	const blog: MetadataRoute.Sitemap = BLOG_POSTS.length
		? [
				{
					url: `${BASE}/blog`,
					lastModified: new Date(),
					changeFrequency: "weekly" as const,
					priority: 0.7,
				},
			]
		: [];

	return [
		{
			url: BASE,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 1.0,
		},
		{
			url: `${BASE}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.9,
		},
		{
			url: `${BASE}/life`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE}/projects`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${BASE}/resume`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		...blog,
		{
			url: `${BASE}/contact`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.6,
		},
	];
}

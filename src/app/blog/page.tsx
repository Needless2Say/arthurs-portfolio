import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import TechBadge from "@/components/ui/TechBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import { BLOG_POSTS } from "@/constants/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on code, data, and building things — by Arthur Krieger.",
};

export default function Blog() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          title="Blog"
          subtitle="Thoughts on code, data, and building things."
        />

        {BLOG_POSTS.length > 0 ? (
          <div className="space-y-4">
            {BLOG_POSTS.map((post) => (
              <Card key={post.slug} glow="purple" className="group cursor-default">
                <h2 className="text-white font-bold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((tag) => (
                    <TechBadge key={tag} label={tag} color="nebula" />
                  ))}
                </div>
                <div className="flex items-center gap-4 text-slate-500 font-mono text-xs">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime} min read</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-slate-300 text-lg font-semibold mb-2">Posts coming soon</p>
            <p className="text-slate-500 text-sm">
              Writing is in progress — check back later.
            </p>
            <p className="text-slate-700 font-mono text-xs mt-6">{"// BLOG_POSTS.length === 0"}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { postQuery } from "@/lib/queries";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Post not found — Gokuldham Haveli" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.title} — Gokuldham Haveli`;
    const description = loaderData.excerpt ?? "A story from Gokuldham Haveli, Atlanta.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(loaderData.image_url?.startsWith("https://")
          ? [
              { property: "og:image", content: loaderData.image_url },
              { name: "twitter:image", content: loaderData.image_url },
            ]
          : []),
      ],
    };
  },
  component: PostDetail,
});

function PostDetail() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  if (!post) return null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft className="h-4 w-4" /> All stories
      </Link>
      <h1 className="gu mt-4 text-3xl text-maroon">{post.title}</h1>
      {post.published_at ? (
        <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">
          {new Date(post.published_at).toLocaleDateString("en-US", { dateStyle: "long" })}
        </p>
      ) : null}
      {post.image_url ? (
        <img
          src={post.image_url}
          alt={post.title}
          className="temple-card mt-6 h-[340px] w-full object-cover"
        />
      ) : null}
      <div className="gu mt-8 space-y-4 text-base leading-loose text-muted-foreground">
        {(post.body ?? post.excerpt ?? "").split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}

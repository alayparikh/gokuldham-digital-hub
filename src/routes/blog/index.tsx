import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/queries";
import { PageHeader } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Stories of Gokuldham — Blog" },
      {
        name: "description",
        content:
          "Discourses, cultural highlights and moments of devotion from the Gokuldham Haveli community in Atlanta.",
      },
      { property: "og:title", content: "Stories of Gokuldham — Blog" },
      {
        property: "og:description",
        content: "Discourses, cultural highlights and moments of devotion from Gokuldham Haveli.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: BlogPage,
});

function BlogPage() {
  const { data: posts } = useSuspenseQuery(postsQuery);

  return (
    <>
      <PageHeader
        title="Stories of Gokuldham"
        subtitle="Inspiring discourses, cultural highlights and moments of devotion."
      />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="temple-card overflow-hidden transition-transform hover:-translate-y-1"
            >
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.title}
                  loading="lazy"
                  className="h-48 w-full object-cover"
                />
              ) : null}
              <div className="p-5">
                <h2 className="gu text-base font-semibold text-maroon">{p.title}</h2>
                <p className="gu mt-2 line-clamp-4 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        {posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No posts yet.</p>
        ) : null}
      </section>
    </>
  );
}

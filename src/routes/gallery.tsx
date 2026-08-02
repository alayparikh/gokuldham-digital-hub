import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { galleryQuery } from "@/lib/queries";
import { PageHeader } from "@/components/site/SectionHeading";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Photo Gallery — Gokuldham Haveli Atlanta" },
      {
        name: "description",
        content:
          "Photographs of darshan, utsav and community celebrations at Gokuldham Haveli, Atlanta.",
      },
      { property: "og:title", content: "Photo Gallery — Gokuldham Haveli Atlanta" },
      {
        property: "og:description",
        content: "Photographs of darshan, utsav and celebrations at Gokuldham Haveli, Atlanta.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(galleryQuery),
  component: GalleryPage,
});

function GalleryPage() {
  const { data } = useSuspenseQuery(galleryQuery);
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <PageHeader title="Gallery" subtitle="Moments of darshan, utsav and togetherness." />
      <section className="mx-auto max-w-7xl px-4 py-12">
        {data.albums.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No albums yet. Create albums and upload photos from the admin panel.
          </p>
        ) : (
          data.albums.map((album) => {
            const photos = data.photos.filter((p) => p.album_id === album.id);
            return (
              <div key={album.id} className="mb-14">
                <h2 className="text-2xl text-maroon">{album.title}</h2>
                {album.event_date ? (
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {new Date(album.event_date + "T00:00:00").toLocaleDateString("en-US", {
                      dateStyle: "long",
                    })}
                  </p>
                ) : null}
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {photos.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setLightbox(p.image_url)}
                      className="temple-card overflow-hidden"
                    >
                      <img
                        src={p.image_url}
                        alt={p.caption ?? album.title}
                        loading="lazy"
                        className="h-44 w-full object-cover transition-transform hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
                {photos.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">No photos in this album yet.</p>
                ) : null}
              </div>
            );
          })
        )}
      </section>

      {lightbox ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/85 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            className="absolute right-5 top-5 rounded-full bg-background p-2 text-foreground"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={lightbox}
            alt=""
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
        </div>
      ) : null}
    </>
  );
}

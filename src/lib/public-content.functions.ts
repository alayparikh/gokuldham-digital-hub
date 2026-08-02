import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchHomeData } = await import("./public-content.server");
  return fetchHomeData();
});

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchSettings } = await import("./public-content.server");
  return fetchSettings();
});

export const getEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchEvents } = await import("./public-content.server");
  return fetchEvents();
});

export const getEvent = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { fetchEvent } = await import("./public-content.server");
    return fetchEvent(data.slug);
  });

export const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchPosts } = await import("./public-content.server");
  return fetchPosts();
});

export const getPost = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => z.object({ slug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { fetchPost } = await import("./public-content.server");
    return fetchPost(data.slug);
  });

export const getDonateData = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchDonateData } = await import("./public-content.server");
  return fetchDonateData();
});

export const getMedia = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchMedia } = await import("./public-content.server");
  return fetchMedia();
});

export const getGallery = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchGallery } = await import("./public-content.server");
  return fetchGallery();
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        name: z.string().min(1).max(120),
        email: z.string().email().max(200),
        phone: z.string().max(40).optional(),
        subject: z.string().max(200).optional(),
        message: z.string().min(1).max(4000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { submitContactMessage } = await import("./public-content.server");
    return submitContactMessage(data);
  });

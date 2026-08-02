import { queryOptions } from "@tanstack/react-query";
import {
  getHomeData,
  getSettings,
  getEvents,
  getEvent,
  getPosts,
  getPost,
  getDonateData,
  getMedia,
  getGallery,
} from "./public-content.functions";

export const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: () => getHomeData(),
});

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: () => getSettings(),
});

export const eventsQuery = queryOptions({
  queryKey: ["events"],
  queryFn: () => getEvents(),
});

export const eventQuery = (slug: string) =>
  queryOptions({
    queryKey: ["event", slug],
    queryFn: () => getEvent({ data: { slug } }),
  });

export const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: () => getPosts(),
});

export const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["post", slug],
    queryFn: () => getPost({ data: { slug } }),
  });

export const donateQuery = queryOptions({
  queryKey: ["donate"],
  queryFn: () => getDonateData(),
});

export const mediaQuery = queryOptions({
  queryKey: ["media"],
  queryFn: () => getMedia(),
});

export const galleryQuery = queryOptions({
  queryKey: ["gallery"],
  queryFn: () => getGallery(),
});

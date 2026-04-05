import * as prismic from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";

import sm from "./slicemachine.config.json";

export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

const routes: prismic.ClientConfig["routes"] = [
  // Update these route resolvers to match your custom types.
  // { type: "homepage", path: "/" },
  // { type: "page", path: "/:uid" },
];

export function createClient(config: prismic.ClientConfig = {}) {
  const client = prismic.createClient(repositoryName, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    routes,
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
}

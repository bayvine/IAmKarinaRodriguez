import * as prismic from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import { draftMode } from "next/headers";

import sm from "./slicemachine.config.json";

export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

const routes: prismic.ClientConfig["routes"] = [
  { type: "home", path: "/" },
];

export const linkResolver: prismic.LinkResolverFunction = (doc) => {
  if (doc.type === "home") {
    return "/";
  }

  if (doc.type === "contact_page") {
    return "/contact";
  }

  if (doc.type === "page" && doc.uid) {
    return `/${doc.uid}`;
  }

  return "/";
};

async function getDraftModeEnabled() {
  try {
    const { isEnabled } = await draftMode();

    return isEnabled;
  } catch {
    return false;
  }
}

export async function createClient(config: prismic.ClientConfig = {}) {
  const isEnabled = await getDraftModeEnabled();

  const client = prismic.createClient(repositoryName, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    routes,
    fetchOptions:
      isEnabled
        ? { cache: "no-store" }
        : process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
}

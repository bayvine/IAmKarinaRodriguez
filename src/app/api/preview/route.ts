import type { NextRequest } from "next/server";
import { redirectToPreviewURL } from "@prismicio/next";

import { createClient, linkResolver } from "@/prismicio";

export async function GET(request: NextRequest) {
  const client = await createClient();

  return await redirectToPreviewURL({
    client,
    request,
    defaultURL: "/",
    linkResolver,
  });
}

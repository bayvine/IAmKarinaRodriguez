import * as prismic from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

function MissingHomeDocument() {
  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-rose-white px-6 py-24 text-center text-night">
      <div className="max-w-2xl rounded-[2rem] border border-night/12 bg-pure-white/75 p-8 shadow-[0_30px_100px_-60px_rgba(26,24,24,0.28)] backdrop-blur">
        <p className="font-sans text-xs text-night/45">
          Prismic Home
        </p>
        <h1 className="mt-4 font-display text-5xl">
          Create your Home document to render slices.
        </h1>
        <p className="mt-4 font-sans text-base text-night">
          The Hero slice is ready. Once the singleton named{" "}
          <span className="font-medium text-night">Home</span> has content
          in Prismic, this page will render your slice zone automatically.
        </p>
      </div>
    </main>
  );
}

export default async function HomePage() {
  const client = createClient();

  const page = await client.getSingle("home").catch((error: unknown) => {
    if (error instanceof prismic.NotFoundError) {
      return null;
    }

    throw error;
  });

  if (!page) {
    return <MissingHomeDocument />;
  }

  return <SliceZone components={components} slices={page.data.slices} />;
}

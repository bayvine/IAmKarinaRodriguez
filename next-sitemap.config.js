/* eslint-disable @typescript-eslint/no-require-imports */

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  process.env.URL ||
  process.env.DEPLOY_PRIME_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const prismic = require("@prismicio/client");
const sm = require("./slicemachine.config.json");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: "public",
  exclude: ["/api/*", "/slice-simulator"],
  additionalPaths: async (config) => {
    const homePath = await config.transform(config, "/");
    const paths = homePath ? [homePath] : [];

    try {
      const client = prismic.createClient(
        process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName,
        {
          accessToken: process.env.PRISMIC_ACCESS_TOKEN,
        },
      );

      const pages = await client.getAllByType("page");

      for (const page of pages) {
        if (!page.uid) {
          continue;
        }

        const transformed = await config.transform(config, `/${page.uid}`);

        if (transformed) {
          paths.push(transformed);
        }
      }
    } catch {
      return paths;
    }

    return paths;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/*", "/slice-simulator"],
      },
    ],
  },
};

import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const STATIC_PATHS = ["", "/login", "/styleguide"] as const;

/**
 * Sitemap programático: rotas públicas estáticas + gancho opcional Prisma
 * (`SELECT 1` + futuro `BlogPost`, etc.). Import dinâmico evita falhar `next build`
 * quando `DATABASE_URL` não está definida.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const { db } = await import("@/lib/db");
    await db.$queryRaw`SELECT 1`;
    // Quando existir modelo público:
    // const posts = await db.blogPost.findMany({ where: { published: true } });
    // for (const p of posts) {
    //   dynamicEntries.push({
    //     url: `${baseUrl}/blog/${p.slug}`,
    //     lastModified: p.updatedAt,
    //     changeFrequency: "weekly",
    //     priority: 0.6,
    //   });
    // }
  } catch {
    // BD indisponível — ignorar entradas dinâmicas
  }

  return [...staticEntries, ...dynamicEntries];
}

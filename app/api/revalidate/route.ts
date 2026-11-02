import { parseBody } from "next-sanity/webhook";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { CONTENT_TAGS } from "@/lib/content";

/**
 * Sanity webhook target. Publishing a document in the Studio purges only the
 * cache tag that document type feeds, so the site picks the change up on the
 * next request without a redeploy.
 *
 * Configure in Sanity: Manage -> API -> Webhooks
 *   URL:     https://<your-domain>/api/revalidate
 *   Dataset: production
 *   Trigger: Create, Update, Delete
 *   Secret:  same value as SANITY_REVALIDATE_SECRET
 */

const TAG_BY_TYPE: Record<string, string> = {
  project: CONTENT_TAGS.projects,
  post: CONTENT_TAGS.posts,
  profile: CONTENT_TAGS.profile,
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set");
    return NextResponse.json(
      { message: "Revalidation is not configured." },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      request,
      secret,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature." },
        { status: 401 },
      );
    }

    const type = body?._type;
    const tag = type ? TAG_BY_TYPE[type] : undefined;

    if (!tag) {
      return NextResponse.json(
        { message: `Ignored document type: ${type ?? "unknown"}` },
        { status: 200 },
      );
    }

    // "max" serves stale content while the refresh happens in the background,
    // which is the right trade-off for portfolio content.
    revalidateTag(tag, "max");

    return NextResponse.json({ revalidated: true, tag, type });
  } catch (error) {
    console.error("[revalidate] failed", error);
    return NextResponse.json(
      { message: "Revalidation failed." },
      { status: 500 },
    );
  }
}

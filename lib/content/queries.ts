import { groq } from "next-sanity";

/**
 * Shared image projection. `asset->url` is handed straight to next/image,
 * which optimises it; `lqip` gives us a real blur placeholder for free.
 */
const IMAGE = groq`{
  "url": asset->url,
  "alt": coalesce(alt, ""),
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  "lqip": asset->metadata.lqip
}`;

const PROJECT_FIELDS = groq`
  _id,
  "slug": slug.current,
  title,
  tagline,
  "platforms": coalesce(platforms, []),
  "status": coalesce(status, "live"),
  role,
  period,
  client,
  "stack": coalesce(stack, []),
  "featured": coalesce(featured, false),
  "order": coalesce(order, 999),
  "cover": cover${IMAGE},
  "screenshots": coalesce(screenshots[]${IMAGE}, []),
  "webScreenshots": coalesce(webScreenshots[]${IMAGE}, []),
  "links": coalesce(links[]{kind, label, url}, []),
  "highlights": coalesce(highlights, []),
  "metrics": coalesce(metrics[]{label, value}, [])
`;

export const PROJECTS_QUERY = groq`
  *[_type == "project" && defined(slug.current)]
  | order(coalesce(order, 999) asc, _createdAt desc)
  { ${PROJECT_FIELDS}, "body": null }
`;

export const PROJECT_BY_SLUG_QUERY = groq`
  *[_type == "project" && slug.current == $slug][0]
  { ${PROJECT_FIELDS}, body }
`;

export const PROJECT_SLUGS_QUERY = groq`
  *[_type == "project" && defined(slug.current)].slug.current
`;

const POST_FIELDS = groq`
  _id,
  "slug": slug.current,
  title,
  "excerpt": coalesce(excerpt, ""),
  "publishedAt": coalesce(publishedAt, _createdAt),
  "tags": coalesce(tags, []),
  "charCount": length(pt::text(body)),
  "cover": cover${IMAGE}
`;

export const POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
  | order(coalesce(publishedAt, _createdAt) desc)
  { ${POST_FIELDS}, "body": null }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0]
  { ${POST_FIELDS}, body }
`;

export const POST_SLUGS_QUERY = groq`
  *[_type == "post" && defined(slug.current)].slug.current
`;

export const PROFILE_QUERY = groq`
  *[_type == "profile"][0]{
    name,
    headline,
    heroStatement,
    location,
    email,
    "availableForWork": coalesce(availableForWork, false),
    shortBio,
    "bio": coalesce(bio, []),
    "avatar": avatar${IMAGE},
    "resumeUrl": coalesce(resume.asset->url, ""),
    "socials": coalesce(socials[]{kind, label, url}, []),
    "skills": coalesce(skills[]{title, "items": coalesce(items, [])}, []),
    "experience": coalesce(
      experience[]{
        role, company, period, location, summary,
        "highlights": coalesce(highlights, [])
      },
      []
    )
  }
`;

import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A portfolio project: a mobile app or a website.
 *
 * Fields are grouped so the editing form stays short: you can publish a
 * usable entry by filling only the "Overview" group.
 */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "media", title: "Media" },
    { name: "details", title: "Details" },
    { name: "caseStudy", title: "Case study" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "overview",
      description: "Appears as /projects/your-slug",
      options: { source: "title", maxLength: 72 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "overview",
      description: "One line, shown on the project card. Keep it under ~90 characters.",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "platforms",
      title: "Platforms",
      type: "array",
      group: "overview",
      description:
        "Tick everything this project ships on. This drives the Mobile / Web filter. A project with both an app and a web surface appears under both.",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "iOS", value: "ios" },
          { title: "Android", value: "android" },
          { title: "Web", value: "web" },
        ],
        layout: "grid",
      },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "featured",
      title: "Feature on the homepage",
      type: "boolean",
      group: "overview",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      group: "overview",
      description: "Lower numbers appear first. Leave empty to sort by newest.",
    }),

    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      group: "media",
      description:
        "Shown on the project card. A wide image (16:10) works best. For apps, a hero or feature-graphic style shot beats a raw screenshot.",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "screenshots",
      title: "App screenshots",
      type: "array",
      group: "media",
      description:
        "Shown in phone frames. Upload the raw device screenshots; they're cropped and compressed automatically.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alt text" }],
        }),
      ],
      options: { layout: "grid" },
      // Only relevant once a mobile platform is ticked.
      hidden: ({ document }) => {
        const platforms = (document?.platforms as string[]) ?? [];
        return !platforms.includes("ios") && !platforms.includes("android");
      },
    }),
    defineField({
      name: "webScreenshots",
      title: "Web screenshots",
      type: "array",
      group: "media",
      description:
        "Shown in browser frames. Wide captures (16:10) look best.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", type: "string", title: "Alt text" }],
        }),
      ],
      options: { layout: "grid" },
      hidden: ({ document }) =>
        !((document?.platforms as string[]) ?? []).includes("web"),
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "In development", value: "in-development" },
          { title: "Archived", value: "archived" },
          { title: "Concept", value: "concept" },
        ],
      },
      initialValue: "live",
    }),
    defineField({
      name: "role",
      title: "Your role",
      type: "string",
      group: "details",
      description: 'e.g. "Lead React Native Developer"',
    }),
    defineField({
      name: "period",
      title: "Period",
      type: "string",
      group: "details",
      description: 'e.g. "2025" or "2024 - 2025"',
    }),
    defineField({
      name: "client",
      title: "Client / company",
      type: "string",
      group: "details",
      description: "Leave empty for personal projects.",
    }),
    defineField({
      name: "stack",
      title: "Tech stack",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Type and press Enter. e.g. React Native, Expo, TypeScript",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "object",
          name: "projectLink",
          fields: [
            defineField({
              name: "kind",
              title: "Type",
              type: "string",
              options: {
                list: [
                  { title: "App Store", value: "appStore" },
                  { title: "Google Play", value: "playStore" },
                  { title: "Live site", value: "live" },
                  { title: "GitHub", value: "github" },
                  { title: "Video / demo", value: "video" },
                  { title: "Other", value: "other" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        }),
      ],
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      group: "details",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Short bullets about what was hard or interesting. Shown in the case-study sidebar.",
    }),
    defineField({
      name: "metrics",
      title: "Metrics",
      type: "array",
      group: "details",
      description: "Optional numbers worth bragging about.",
      of: [
        defineArrayMember({
          type: "object",
          name: "metric",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: 'e.g. "4.8", "99.7%", "1.2s"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: 'e.g. "App Store rating"',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),

    defineField({
      name: "body",
      title: "Case study",
      type: "blockContent",
      group: "caseStudy",
      description:
        "The long-form write-up. Optional; projects without one still get a detail page.",
    }),
  ],
  orderings: [
    {
      title: "Sort order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Newest first",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      platforms: "platforms",
      featured: "featured",
      status: "status",
      media: "cover",
    },
    prepare: ({ title, platforms, featured, status, media }) => {
      const list: string[] = platforms ?? [];
      const hasMobile = list.includes("ios") || list.includes("android");
      const hasWeb = list.includes("web");
      const kind = hasMobile && hasWeb ? "Mobile & Web" : hasWeb ? "Web" : "Mobile";

      return {
        title: featured ? `★ ${title}` : title,
        subtitle: [kind, status].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});

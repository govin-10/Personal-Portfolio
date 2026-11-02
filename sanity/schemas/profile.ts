import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton document holding everything about you: hero copy, bio, skills,
 * work history, socials and the resume file. The Studio structure pins this
 * to a single editable document (see sanity/structure.ts).
 */
export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "bio", title: "Bio" },
    { name: "skills", title: "Skills" },
    { name: "experience", title: "Experience" },
    { name: "links", title: "Links & files" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "basics",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "basics",
      description: 'Your role label, e.g. "React Native Developer"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroStatement",
      title: "Hero statement",
      type: "text",
      rows: 3,
      group: "basics",
      description: "The big sentence under your name on the homepage.",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "basics",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "basics",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "availableForWork",
      title: "Available for work",
      type: "boolean",
      group: "basics",
      description: "Shows the green 'available' pill in the header and hero.",
      initialValue: true,
    }),
    defineField({
      name: "avatar",
      title: "Photo",
      type: "image",
      group: "basics",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),

    defineField({
      name: "shortBio",
      title: "Short bio",
      type: "text",
      rows: 3,
      group: "bio",
      description: "Two or three sentences. Used in metadata and the homepage.",
    }),
    defineField({
      name: "bio",
      title: "Full bio",
      type: "array",
      group: "bio",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      description: "One entry per paragraph. Shown on the About page.",
    }),

    defineField({
      name: "skills",
      title: "Skill groups",
      type: "array",
      group: "skills",
      of: [
        defineArrayMember({
          type: "object",
          name: "skillGroup",
          fields: [
            defineField({
              name: "title",
              title: "Group",
              type: "string",
              description: 'e.g. "Mobile", "Web & Front-end"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              title: "Skills",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              options: { layout: "tags" },
            }),
          ],
          preview: {
            select: { title: "title", items: "items" },
            prepare: ({ title, items }) => ({
              title,
              subtitle: `${items?.length ?? 0} skills`,
            }),
          },
        }),
      ],
    }),

    defineField({
      name: "experience",
      title: "Work history",
      type: "array",
      group: "experience",
      of: [
        defineArrayMember({
          type: "object",
          name: "experienceItem",
          fields: [
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "company",
              title: "Company",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "period",
              title: "Period",
              type: "string",
              description: 'e.g. "2024 - Present"',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "location", title: "Location", type: "string" }),
            defineField({
              name: "summary",
              title: "Summary",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "highlights",
              title: "Highlights",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { title: "role", company: "company", period: "period" },
            prepare: ({ title, company, period }) => ({
              title,
              subtitle: [company, period].filter(Boolean).join(" · "),
            }),
          },
        }),
      ],
    }),

    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "links",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "kind",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "GitHub", value: "github" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "X / Twitter", value: "twitter" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "Email", value: "email" },
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
              description: "Use mailto: for email.",
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https", "mailto"] }),
            }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "resume",
      title: "Resume (PDF)",
      type: "file",
      group: "links",
      options: { accept: ".pdf" },
      description: "Uploading here overrides the PDF committed in /public.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "headline", media: "avatar" },
  },
});

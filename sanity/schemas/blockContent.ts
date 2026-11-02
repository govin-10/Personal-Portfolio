import { defineArrayMember, defineType } from "sanity";

/**
 * Rich text used by project case studies and blog posts.
 * Deliberately small: headings, lists, links, code and images. Nothing that
 * the front-end can't render well.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.required().uri({ scheme: ["http", "https", "mailto"] }),
              },
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
          description: "Describe the image for screen readers and SEO.",
        },
        { name: "caption", type: "string", title: "Caption" },
      ],
    }),
    defineArrayMember({
      name: "codeBlock",
      type: "object",
      title: "Code",
      fields: [
        {
          name: "language",
          type: "string",
          title: "Language",
          initialValue: "tsx",
          options: {
            list: ["tsx", "ts", "jsx", "js", "json", "bash", "swift", "kotlin", "java", "css"],
          },
        },
        { name: "filename", type: "string", title: "Filename (optional)" },
        {
          name: "code",
          type: "text",
          title: "Code",
          rows: 12,
          validation: (rule) => rule.required(),
        },
      ],
      preview: {
        select: { language: "language", filename: "filename" },
        prepare: ({ language, filename }) => ({
          title: filename || `${language ?? "code"} snippet`,
          subtitle: "Code block",
        }),
      },
    }),
  ],
});

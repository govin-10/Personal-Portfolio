import type { StructureResolver } from "sanity/structure";

/**
 * Studio sidebar layout.
 *
 * Projects are split by platform so the two kinds of work stay easy to scan.
 * A project that is both an app and a website appears under both lists,
 * and Profile is pinned as a single document rather than a list you can add to.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Projects")
        .child(
          S.list()
            .title("Projects")
            .items([
              S.listItem()
                .title("All projects")
                .child(
                  S.documentTypeList("project")
                    .title("All projects")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
              S.listItem()
                .title("Featured")
                .child(
                  S.documentList()
                    .title("Featured projects")
                    .filter('_type == "project" && featured == true')
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
              S.divider(),
              S.listItem()
                .title("Mobile apps")
                .child(
                  S.documentList()
                    .title("Mobile apps")
                    .filter(
                      '_type == "project" && ("ios" in platforms || "android" in platforms)',
                    )
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
              S.listItem()
                .title("Websites")
                .child(
                  S.documentList()
                    .title("Websites")
                    .filter('_type == "project" && "web" in platforms')
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
            ]),
        ),

      S.documentTypeListItem("post").title("Blog posts"),

      S.divider(),

      // Singleton: one profile document, edited in place.
      S.listItem()
        .title("Profile")
        .id("profile")
        .child(S.document().schemaType("profile").documentId("profile")),
    ]);

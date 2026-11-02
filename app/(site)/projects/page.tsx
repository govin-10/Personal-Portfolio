import type { Metadata } from "next";

import { ProjectShowcase } from "@/components/project-showcase";
import { SectionHeader } from "@/components/ui/section";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Mobile apps and websites built by Govinda Timsina. React Native, Expo, React and Next.js work, with case studies.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container-page py-16 sm:py-20">
      <SectionHeader
        eyebrow="Portfolio"
        title="Projects"
        description="Mobile apps I've shipped and web work I've built along the way. Each one has a short case study."
      />

      <div className="mt-12">
        {projects.length ? (
          <ProjectShowcase projects={projects} />
        ) : (
          <p className="text-muted">
            No projects published yet. Check back shortly.
          </p>
        )}
      </div>
    </div>
  );
}

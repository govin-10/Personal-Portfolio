import { categoryFromPlatforms } from "./category";
import type { Post, Profile, Project } from "./types";

/**
 * Local fallback content.
 *
 * This file is what the site renders when Sanity is not configured (no
 * NEXT_PUBLIC_SANITY_PROJECT_ID). It keeps the site buildable and reviewable
 * from a fresh clone with zero accounts set up.
 *
 * The PROFILE below is real. The PROJECTS and POSTS are PLACEHOLDERS:
 * structural examples that show what a filled-in entry looks like. Replace
 * them in Sanity Studio at /studio (preferred), or edit them here if you'd
 * rather keep content in the repo.
 *
 * While the site is running on this file in development, a banner is shown so
 * you don't forget. See components/sample-content-notice.tsx.
 */

export const PROFILE: Profile = {
  name: "Govinda Timsina",
  headline: "Mobile & Web Developer",
  heroStatement:
    "I build for mobile and web alike: cross-platform apps in React Native, and fast, accessible interfaces in React and Next.js.",
  location: "Nepal",
  email: "timsinagovin17@gmail.com",
  availableForWork: true,
  shortBio:
    "Developer working across mobile and web. I build cross-platform iOS and Android apps with React Native and Expo, and production web apps with React, Next.js and TypeScript.",
  bio: [
    "I'm a developer who works across mobile and web. On mobile that means cross-platform iOS and Android apps built with React Native and Expo. On the web it means React and Next.js, from marketing sites to internal dashboards. Most products need both, and I'm happy owning either end.",
    "I care about the parts users feel but rarely name: how fast the first screen paints, whether a list scrolls at 60fps, whether gestures and transitions behave the way the platform taught people to expect, and whether any of it still holds up on a mid-range Android phone or a slow connection.",
    "My route in was the web. I started with HTML, CSS and JavaScript, moved through React, then into React Native. Component thinking and the same TypeScript discipline carry across both sides of what I build, which is why moving between a native screen and a web dashboard doesn't feel like switching jobs.",
    "Day to day that's React Native, Expo, React, Next.js and TypeScript, plus the supporting cast: navigation, state management, offline storage, push notifications, native modules when a library doesn't exist yet, and the release plumbing for TestFlight and Google Play.",
    "I'm currently open to new work. If you have an app or a web product that needs building, rescuing, or getting shipped, I'd like to hear about it.",
  ],
  avatar: {
    url: "/hero.jpg",
    alt: "Govinda Timsina",
    width: 893,
    height: 893,
  },
  resumeUrl: "/Govinda-Timsina-Resume.pdf",
  socials: [
    { kind: "github", label: "GitHub", url: "https://github.com/govindatimsina" },
    {
      kind: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/govindatimsina/",
    },
    { kind: "twitter", label: "X / Twitter", url: "https://twitter.com/GovindaTimsina7" },
    { kind: "instagram", label: "Instagram", url: "https://instagram.com/govin.17" },
    {
      kind: "facebook",
      label: "Facebook",
      url: "https://facebook.com/govinda.timsina.925",
    },
    { kind: "email", label: "Email", url: "mailto:timsinagovin17@gmail.com" },
  ],
  skills: [
    {
      title: "Mobile",
      items: [
        "React Native",
        "Expo",
        "React Navigation",
        "Reanimated",
        "Native Modules",
        "Push Notifications",
        "Offline-first",
        "App Store / Play Console",
      ],
    },
    {
      title: "Web & Front-end",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML & CSS", "Accessibility"],
    },
    {
      title: "Data & State",
      items: ["TanStack Query", "Zustand", "Redux Toolkit", "REST APIs", "Firebase", "SQLite / MMKV"],
    },
    {
      title: "Tooling",
      items: ["Git", "EAS Build", "Fastlane", "Jest", "Figma", "Sentry"],
    },
  ],
  experience: [
    {
      role: "React Native Developer",
      company: "Freelance / Contract",
      period: "2024 - Present",
      location: "Remote",
      summary:
        "Building and shipping cross-platform mobile apps for clients, from first commit through store release.",
      highlights: [
        "Ship production iOS and Android builds with Expo EAS, including signing and store submission.",
        "Take designs from Figma to pixel-accurate, native-feeling screens on both platforms.",
        "Own post-launch work: crash triage, performance profiling, and OTA updates.",
      ],
    },
    {
      role: "Frontend Developer",
      company: "Self-directed & client work",
      period: "2023 - 2024",
      location: "Nepal",
      summary:
        "Built responsive marketing sites and web front-ends while moving from the web into React Native.",
      highlights: [
        "Delivered responsive, accessible sites with semantic HTML, modern CSS and vanilla JavaScript.",
        "Moved into React, then React Native, carrying component thinking across to mobile.",
      ],
    },
  ],
};

/**
 * PLACEHOLDER PROJECTS. Replace these with your real work.
 *
 * Each one shows a different shape so you can see how the layouts respond:
 * a featured mobile app with metrics, a second mobile app, and a web project.
 */
type SeedProject = Omit<Project, "category">;

const SEED_PROJECTS: SeedProject[] = [
  {
    _id: "sample-mobile-1",
    slug: "sample-fitness-app",
    title: "Sample: Fitness Tracking App",
    tagline:
      "Offline-first workout tracker with Apple Health and Google Fit sync.",
    platforms: ["ios", "android"],
    status: "live",
    role: "React Native Developer",
    period: "2025",
    client: "Placeholder Client",
    stack: ["React Native", "Expo", "TypeScript", "Reanimated", "SQLite", "TanStack Query"],
    featured: true,
    order: 1,
    screenshots: [],
    webScreenshots: [],
    links: [
      { kind: "appStore", label: "App Store", url: "https://apps.apple.com" },
      { kind: "playStore", label: "Google Play", url: "https://play.google.com" },
    ],
    highlights: [
      "Works fully offline, syncing in the background when a connection returns.",
      "Custom Reanimated chart that stays at 60fps with a year of daily data.",
      "Shared TypeScript types between the app and its API.",
    ],
    metrics: [
      { label: "App Store rating", value: "4.8" },
      { label: "Cold start", value: "1.2s" },
      { label: "Crash-free sessions", value: "99.7%" },
    ],
    body: null,
  },
  {
    _id: "sample-mobile-2",
    slug: "sample-delivery-app",
    title: "Sample: Food Delivery App",
    tagline: "Real-time order tracking with live maps and push notifications.",
    platforms: ["ios", "android"],
    status: "live",
    role: "Mobile Developer",
    period: "2024",
    stack: ["React Native", "TypeScript", "Firebase", "Google Maps SDK", "Zustand"],
    featured: true,
    order: 2,
    screenshots: [],
    webScreenshots: [],
    links: [{ kind: "playStore", label: "Google Play", url: "https://play.google.com" }],
    highlights: [
      "Live driver tracking over a websocket with optimistic map interpolation.",
      "Push notifications for every order state change, deep-linked to the order screen.",
    ],
    metrics: [],
    body: null,
  },
  {
    _id: "sample-web-1",
    slug: "sample-dashboard",
    title: "Sample: Companion App & Dashboard",
    tagline:
      "An iOS/Android companion app plus the web dashboard its team runs on.",
    // Both a mobile app and a website: shows up under either filter.
    platforms: ["ios", "android", "web"],
    status: "live",
    role: "Full-stack Frontend Developer",
    period: "2025",
    stack: [
      "React Native",
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Recharts",
    ],
    featured: true,
    order: 3,
    screenshots: [],
    webScreenshots: [],
    links: [
      { kind: "live", label: "Live dashboard", url: "https://example.com" },
      { kind: "appStore", label: "App Store", url: "https://apps.apple.com" },
    ],
    highlights: [
      "Shared TypeScript domain models between the app and the dashboard.",
      "Server-rendered tables that stay responsive at 50k+ rows.",
      "Keyboard-navigable throughout, tested against WCAG AA.",
    ],
    metrics: [],
    body: null,
  },
];

export const PROJECTS: Project[] = SEED_PROJECTS.map((project) => ({
  ...project,
  category: categoryFromPlatforms(project.platforms),
}));

/** PLACEHOLDER POSTS. Replace or delete. */
export const POSTS: Post[] = [
  {
    _id: "sample-post-1",
    slug: "sample-react-native-performance",
    title: "Sample: Keeping React Native lists at 60fps",
    excerpt:
      "Notes on what actually moves the needle for long lists on mid-range Android devices.",
    publishedAt: "2026-01-15",
    tags: ["React Native", "Performance"],
    readingTime: 6,
    body: null,
  },
];

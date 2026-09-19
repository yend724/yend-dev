import type { Certification, Social } from "@/shared/config/profile";
import { CERTIFICATIONS, PROFILE_ICON, SOCIALS } from "@/shared/config/profile";
import type { Library, Playground, WebApp } from "@/shared/config/project";
import { LIBRARIES, PLAYGROUNDS, WEB_APPS } from "@/shared/config/project";

/** One card in the ocean: a work (light column) or a playground piece (sculpture). */
export type Project = {
  id: string;
  title: string;
  description: string;
  /** Primary link: the app or site, or the npm page for a library. */
  url: string;
  github?: string;
  thumbnail?: string;
};

type ProjectKind = "works" | "playground";

const toProjectId = (kind: ProjectKind, index: number): string =>
  `${kind}-${index + 1}`;

const fromWebApp = (app: WebApp): Omit<Project, "id"> => ({
  title: app.title,
  description: app.description,
  url: app.app,
  github: app.github,
  thumbnail: app.thumbnail,
});

const fromLibrary = (library: Library): Omit<Project, "id"> => ({
  title: library.title,
  description: library.description,
  url: library.npm,
  github: library.github,
});

const fromPlayground = (playground: Playground): Omit<Project, "id"> => ({
  title: playground.title,
  description: playground.description,
  url: playground.url,
  github: playground.github,
  thumbnail: playground.thumbnail,
});

const withIds = (
  kind: ProjectKind,
  projects: Omit<Project, "id">[]
): Project[] =>
  projects.map((project, index) => ({
    ...project,
    id: toProjectId(kind, index),
  }));

/** Works area: web apps and sites first, then libraries. Source: packages/resources. */
export const works: Project[] = withIds("works", [
  ...WEB_APPS.map(fromWebApp),
  ...LIBRARIES.map(fromLibrary),
]);

/** Playground area. Source: packages/resources. */
export const playgrounds: Project[] = withIds(
  "playground",
  PLAYGROUNDS.map(fromPlayground)
);

type Profile = {
  icon: typeof PROFILE_ICON;
  certifications: Certification[];
  socials: Social[];
};
/** Profile card: icon, certifications and social links. Source: packages/resources. */
export const profile: Profile = {
  icon: PROFILE_ICON,
  certifications: CERTIFICATIONS,
  socials: SOCIALS,
};
export const areas = [
  { id: "home", label: "中央広場", position: [0, 4, 6] },
  { id: "profile", label: "Profile", position: [-18, 4, -8] },
  { id: "works", label: "Works", position: [16, 4, -5] },
  { id: "playground", label: "Playground", position: [9, 4, 19] },
];

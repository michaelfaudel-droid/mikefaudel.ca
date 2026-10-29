import type { ImageMetadata } from "astro";
import microsoft from "../assets/logos/microsoft.webp";
import nuance from "../assets/logos/nuance.png";
import evolvingWeb from "../assets/logos/evolving-web.png";

export interface Experience {
  role: string;
  company: string;
  years: string;
  logo: ImageMetadata;
  /** Short version used on the home page. */
  summary: string;
  /** Longer version used on the About page. */
  detail: string;
}

export const experience: Experience[] = [
  {
    role: "Product Designer",
    company: "Microsoft, Copilot Studio",
    years: "2023 – Present",
    logo: microsoft,
    summary:
      "Design owner for channels, publishing, and sharing on Copilot Studio, a platform used by 230,000+ organizations, including 90% of the Fortune 500. Led end-to-end design for publishing workflows, channel integrations, and Component Collections, the #2 most-requested feature in the backlog, now generally available, with 4,000+ monthly users during public preview.",
    detail:
      "Design owner for channels, publishing, and sharing on Copilot Studio, a platform used by 230,000+ organizations, including 90% of the Fortune 500. Led end-to-end design for publishing workflows, channel integrations, and Component Collections, the #2 most-requested feature in the backlog, now generally available, with 4,000+ monthly users during public preview.",
  },
  {
    role: "Product Designer",
    company: "Nuance Communications",
    years: "2020 – 2023",
    logo: nuance,
    summary:
      "Designed for Mix, Nuance’s conversational AI tooling platform. Created solutions for multichannel, AI/NLP-driven enterprise products. Collaborated with engineers and researchers to translate complex AI technology into user-friendly tools and interfaces, driving adoption and usability across large organizations.",
    detail:
      "Owned Data Types end to end and led the slot types redesign on Nuance Mix, a conversational AI platform built on speech and NLU technology trusted by 1,500+ leading brands, including 75% of the Fortune 100. Designed Mix’s versioning system and co-built a 0 to 1 design system spanning NLU, Dialog, and Dashboard.",
  },
  {
    role: "UX/UI Designer",
    company: "Evolving Web",
    years: "2019 – 2020",
    logo: evolvingWeb,
    summary:
      "Partnered with dev teams to deliver responsive, accessible websites for high-profile clients including Princeton University and the Pierre Elliott Trudeau Foundation. Focused on user-centered design, prototyping, and improving overall design systems for scalability.",
    detail:
      "Designed responsive, scalable experiences for clients including Princeton University and the Pierre Elliott Trudeau Foundation. Balanced custom client requirements with reusable design patterns to increase consistency, scalability, and delivery speed.",
  },
];

"use client";

import {
  KeyRound,
  Boxes,
  GitMerge,
  Network,
  Database,
  Server,
  Cpu,
  Package,
  Layers,
} from "lucide-react";

import {
  FeatureCarousel,
  type CarouselFeature,
} from "@/components/ui/feature-carousel";
import { CRATES } from "../data";

// Icons + imagery live here, on the client, so no component functions need to
// cross the server/client boundary as props.
const CRATE_ICONS = [
  KeyRound,
  Boxes,
  GitMerge,
  Network,
  Database,
  Server,
  Cpu,
  Package,
  Layers,
];

const CRATE_IMAGES = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200",
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200",
];

const CRATE_FEATURES: CarouselFeature[] = CRATES.map((crate, i) => ({
  id: crate.key,
  label: crate.key,
  description: crate.value,
  icon: CRATE_ICONS[i],
  image: CRATE_IMAGES[i],
}));

export function CrateCarousel() {
  return <FeatureCarousel features={CRATE_FEATURES} />;
}

export type NavItem = {
  label: string;
  href: string;
  /** Disabled items render as a non-clickable "soon" entry. */
  disabled?: boolean;
};

/** The presentation stages, in header order. Ruliad is not built yet, so it
 *  renders as a non-clickable "soon" entry. */
export const NAV_ITEMS: NavItem[] = [
  { label: "ATQM", href: "/atqm" },
  { label: "QLOSOPHY", href: "/qlosophy" },
  { label: "Atom Boundary Labs", href: "/atom-boundary" },
  { label: "Ruliad", href: "/ruliad", disabled: true },
];

export const SITE_NAME = "ATOM QUANTUM";

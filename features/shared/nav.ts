export type NavItem = {
  label: string;
  href: string;
  /** Disabled items render as a non-clickable "soon" entry. */
  disabled?: boolean;
};

/** The three stages of the presentation, in header order. */
export const NAV_ITEMS: NavItem[] = [
  { label: "ATQM", href: "/atqm" },
  { label: "QLOSOPHY", href: "/qlosophy" },
  { label: "ThermoRuliad Labs", href: "/thermoruliad", disabled: true },
];

export const SITE_NAME = "ATOM QUANTUM";

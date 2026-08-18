import { describe, expect, it } from "vitest";
import type {
  FooterColumn,
  FooterLink,
  FooterProps,
  NavItem,
  NavLink,
  NavProps,
} from "../../index";
import { Footer, Nav } from "../../index";

/**
 * The chrome's cross-repo contract: two components and six types, reachable
 * from the package entry. An application composes its shell from these names
 * alone, so a re-export dropped here breaks a consumer this repository does
 * not build.
 */
describe("site chrome exports", () => {
  it("exports the two components", () => {
    expect(typeof Nav).toBe("function");
    expect(typeof Footer).toBe("function");
  });

  it("exports the types an application annotates its content with", () => {
    const navItem: NavItem = { label: "Store", href: "/store", current: true };
    const navLink: NavLink = { label: "Help", href: "/help" };
    const footerLink: FooterLink = { label: "Privacy", href: "/privacy" };
    const column: FooterColumn = { heading: "SHOP", links: [footerLink] };

    const nav: Pick<NavProps, "navItems" | "utilityLinks"> = {
      navItems: [navItem],
      utilityLinks: [navLink],
    };
    const footer: Pick<FooterProps, "columns" | "legalLinks"> = {
      columns: [column],
      legalLinks: [],
    };

    expect(nav.navItems).toHaveLength(1);
    expect(footer.columns[0]?.links).toHaveLength(1);
  });
});

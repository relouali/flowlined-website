import GiantWordmark from "@/components/giant-wordmark";

/**
 * Site footer.
 *
 * Currently stripped down to just the giant Flowlined wordmark — the
 * upper section (brand + addresses + sitemap + newsletter form + legal
 * row) has been removed for the time being. To restore that content,
 * see the previous revision of this file in git.
 *
 * The `id="contact"` is preserved so the existing `#contact` CTAs in
 * the header, manifest section, and progress nav still resolve to a
 * scroll target at the bottom of the page.
 */
export default function SiteFooter() {
  return (
    <footer
      id="contact"
      className="bg-[#0a1418] px-8 pt-16 text-white lg:px-16 lg:pt-[74px]"
    >
      <GiantWordmark />
    </footer>
  );
}

import { SiteHeaderShell } from "@/components/layout/site-header-shell";
import { getGlobalNavHeaderData } from "@/lib/global-nav";

export async function SiteHeader() {
  const header = await getGlobalNavHeaderData();

  return <SiteHeaderShell {...header} />;
}

import { BrandLogo } from "@/components/brand/BrandLogo";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return <BrandLogo href={href} className={className} />;
}

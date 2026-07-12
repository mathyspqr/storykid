import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/shared/utils";

export function PricingCard({
  name,
  price,
  description,
  features,
  cta = "Choisir",
  highlighted,
  disabled,
  href = "/creer",
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta?: string;
  highlighted?: boolean;
  disabled?: boolean;
  href?: string;
}) {
  return (
    <Card
      className={cn(
        "relative flex h-full flex-col p-6",
        highlighted && "border-gold bg-[#fffaf0] shadow-book",
      )}
    >
      {highlighted ? (
        <Badge className="absolute right-5 top-5 bg-gold/20 text-ink">
          Recommande
        </Badge>
      ) : null}
      <h3 className="font-display text-3xl font-semibold text-ink">{name}</h3>
      <p className="mt-4 text-4xl font-semibold text-ink">{price}</p>
      <p className="mt-4 text-sm leading-6 text-ink/65">{description}</p>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-ink/72">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            {feature}
          </li>
        ))}
      </ul>
      <Button asChild className="mt-8 w-full" disabled={disabled} variant={highlighted ? "default" : "secondary"}>
        <Link href={href}>{cta}</Link>
      </Button>
    </Card>
  );
}

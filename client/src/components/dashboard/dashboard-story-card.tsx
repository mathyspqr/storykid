import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DashboardStoryCard({
  title,
  childName,
  theme,
  status,
}: {
  title: string;
  childName: string;
  theme: string;
  status: "brouillon" | "generee" | "pdf pret";
}) {
  return (
    <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-ink/60">
            {childName} - {theme}
          </p>
          <Badge className="mt-3">{status}</Badge>
        </div>
      </div>
      <Button asChild variant="secondary">
        <Link href="/story/demo">
          Voir
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </Card>
  );
}


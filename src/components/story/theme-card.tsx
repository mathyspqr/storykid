import { ThemeIcon } from "@/components/story/theme-icon";
import { Card } from "@/components/ui/card";
import type { StoryTheme } from "@/types/story";
import { cn } from "@/lib/utils";

export function ThemeCard({
  theme,
  selected,
  onClick,
}: {
  theme: StoryTheme;
  selected?: boolean;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  const colors = [
    "bg-[#ffe1a6]",
    "bg-[#cfeef9]",
    "bg-[#ffd3df]",
    "bg-[#d9f0ca]",
    "bg-[#e7ddff]",
  ];
  const color = colors[theme.title.length % colors.length];
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="text-left"
    >
      <Card
        className={cn(
          "relative h-full overflow-hidden p-5 transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-book",
          selected && "border-gold bg-[#fffaf0] ring-4 ring-gold/20",
        )}
      >
        <div className={cn("absolute -right-8 -top-8 h-28 w-28 rounded-full", color)} />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink shadow-sm">
          <ThemeIcon icon={theme.icon} />
        </div>
        <h3 className="relative mt-5 font-display text-2xl font-semibold text-ink">
          {theme.title}
        </h3>
        <p className="relative mt-2 text-sm leading-6 text-ink/65">{theme.description}</p>
        <div className="relative mt-5 flex items-end gap-2">
          <span className="block h-10 w-10 rounded-full bg-ink/90" />
          <span className="block h-7 w-7 rounded-full bg-gold" />
          <span className="block h-5 w-14 rounded-full bg-white/85" />
        </div>
      </Card>
    </Comp>
  );
}

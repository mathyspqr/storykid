import Image, { type StaticImageData } from "next/image";
import anchorBackpack from "@/assets/tunnel/choices/anchor-backpack-clean.png";
import anchorFox from "@/assets/tunnel/choices/anchor-fox-clean.png";
import anchorNightlight from "@/assets/tunnel/choices/anchor-nightlight-clean.png";
import anchorOctopus from "@/assets/tunnel/choices/anchor-octopus-clean.png";
import anchorStar from "@/assets/tunnel/choices/anchor-star-clean.png";
import anchorTeddy from "@/assets/tunnel/choices/anchor-teddy-clean.png";
import audio from "@/assets/tunnel/choices/choice-audio.png";
import feelingBrave from "@/assets/tunnel/choices/choice-feeling-brave.png";
import feelingCalm from "@/assets/tunnel/choices/choice-feeling-calm.png";
import feelingMagical from "@/assets/tunnel/choices/choice-feeling-magical.png";
import feelingPlayful from "@/assets/tunnel/choices/choice-feeling-playful.png";
import feelingReassuring from "@/assets/tunnel/choices/choice-feeling-reassuring.png";
import format6 from "@/assets/tunnel/choices/choice-format-6.png";
import format8 from "@/assets/tunnel/choices/choice-format-8.png";
import intent from "@/assets/tunnel/choices/choice-intent.png";
import needChange from "@/assets/tunnel/choices/need-change.png";
import needConfidence from "@/assets/tunnel/choices/need-confidence.png";
import needEmotion from "@/assets/tunnel/choices/need-emotion.png";
import needEvening from "@/assets/tunnel/choices/need-evening.png";
import needSchool from "@/assets/tunnel/choices/need-school.png";
import needSibling from "@/assets/tunnel/choices/need-sibling.png";

const paintedChoices: Record<string, StaticImageData> = {
  evening: needEvening,
  school: needSchool,
  emotion: needEmotion,
  confidence: needConfidence,
  sibling: needSibling,
  change: needChange,
  octopus: anchorOctopus,
  teddy: anchorTeddy,
  star: anchorStar,
  fox: anchorFox,
  nightlight: anchorNightlight,
  backpack: anchorBackpack,
  calm: feelingCalm,
  reassuring: feelingReassuring,
  brave: feelingBrave,
  playful: feelingPlayful,
  magical: feelingMagical,
  "6": format6,
  "8": format8,
  audio,
  intent,
  custom: intent,
};

export function PaintedChoiceIcon({
  choice,
  alt = "",
  className = "",
  sizes = "96px",
}: {
  choice: string | number;
  alt?: string;
  className?: string;
  sizes?: string;
}) {
  const source = paintedChoices[String(choice)] ?? intent;

  return (
    <Image
      src={source}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-cover mix-blend-multiply ${className}`}
    />
  );
}

import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import logoCrystal from "@/assets/cleaned/logo-crystal-clean.png";

const micro = ["Sans compte", "Sans carte bancaire", "Aperçu en ligne immédiat"];

export function FinalCTA() {
  return (
    <section className="px-5 pb-5 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_19%_24%,rgba(124,92,255,0.38),transparent_24%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.12),transparent_22%),linear-gradient(135deg,#07123a_0%,#091946_48%,#050b25_100%)] px-5 py-9 text-center text-white shadow-[0_28px_90px_rgba(7,18,58,0.25)] sm:px-12 md:rounded-[28px] md:py-11 md:text-left lg:px-16">
        <div className="relative grid min-h-[220px] gap-6 md:grid-cols-[350px_1fr] md:items-center md:gap-8">
          <div className="absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.58)_1px,transparent_2px),radial-gradient(circle_at_80%_22%,rgba(255,255,255,0.5)_1px,transparent_2px),radial-gradient(circle_at_68%_72%,rgba(255,255,255,0.36)_1px,transparent_2px),radial-gradient(circle_at_38%_42%,rgba(124,92,255,0.22),transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(4,10,35,0.26))]" />
          <div className="relative flex h-full items-center justify-center md:flex">
            <Image
              src={logoCrystal}
              alt=""
              sizes="120px"
              className="h-32 w-32 object-contain drop-shadow-[0_0_86px_rgba(255,255,255,0.72)] md:h-48 md:w-48"
            />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
              Crée ton premier aperçu gratuit.
            </h2>
            <p className="mt-2 text-base font-semibold text-white/76">
              Deux minutes suffisent pour voir si l'histoire touche juste.
            </p>
            <Link
              href="/creer"
              className="mt-6 inline-flex h-[56px] w-full max-w-[480px] items-center justify-center rounded-xl bg-[#ff6257] px-9 text-sm font-extrabold text-white shadow-[0_20px_48px_rgba(255,98,87,0.36)] transition hover:-translate-y-0.5 hover:bg-[#f2554a] hover:shadow-[0_24px_58px_rgba(255,98,87,0.44)]"
            >
              Créer mon aperçu gratuit
            </Link>
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 md:justify-start md:gap-x-5">
              {micro.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 text-xs font-bold text-white/82">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-[#55d171] text-[#07123a]">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

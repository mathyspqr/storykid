import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";
import logoCrystal from "@/assets/cleaned/logo-crystal-clean.png";

const micro = ["Sans compte", "Sans carte bancaire", "Aperçu immédiat"];

export function FinalCTA() {
  return (
    <section className="px-4 pb-5 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#07123a] px-6 py-11 text-white shadow-[0_28px_90px_rgba(7,18,58,0.25)] sm:px-12 lg:px-16">
        <div className="relative grid min-h-[220px] gap-8 md:grid-cols-[350px_1fr] md:items-center">
          <div className="absolute inset-0 opacity-85 [background-image:radial-gradient(circle_at_14%_18%,rgba(255,255,255,0.55)_1px,transparent_2px),radial-gradient(circle_at_80%_22%,rgba(255,255,255,0.5)_1px,transparent_2px),radial-gradient(circle_at_68%_72%,rgba(255,255,255,0.36)_1px,transparent_2px),radial-gradient(circle_at_40%_40%,rgba(124,92,255,0.35),transparent_22%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(1,6,27,0.6))]" />
          <div className="relative hidden h-full items-center justify-center md:flex">
            <Image
              src={logoCrystal}
              alt=""
              sizes="120px"
              className="h-48 w-48 object-contain drop-shadow-[0_0_70px_rgba(255,255,255,0.62)]"
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
              href="/create-story"
              className="mt-6 inline-flex h-[54px] w-full max-w-[460px] items-center justify-center rounded-xl bg-[#ff6257] px-9 text-sm font-extrabold text-white shadow-[0_18px_42px_rgba(255,98,87,0.34)] transition hover:-translate-y-0.5 hover:bg-[#f2554a] hover:shadow-[0_22px_52px_rgba(255,98,87,0.42)]"
            >
              Créer mon aperçu gratuit
            </Link>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
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

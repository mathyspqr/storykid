"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { StaticImageData } from "next/image";
import type { StoryBook, StoryBookPage } from "@/types/book";

type ReaderStage3D = "cover" | "opening" | "reading";

type Book3DSceneProps = {
  book: StoryBook;
  stage: ReaderStage3D;
  leftPage?: StoryBookPage;
  rightPage?: StoryBookPage;
  singlePage?: StoryBookPage;
  turningPage?: TurningPage | null;
  isMobile: boolean;
  coverHovered?: boolean;
};

type TurningPage = {
  key: number;
  direction: "next" | "prev";
  targetIndex: number;
  frontPage: StoryBookPage;
  backPage: StoryBookPage;
};

const PAGE_W = 2.02;
const PAGE_H = 2.88;
const COVER_W = 2.22;
const COVER_H = 2.96;
const pageTextureCache = new Map<string, THREE.Texture>();

function getCoverCrop(bookId: string) {
  const cropByBookId: Record<string, { x: number; y: number; width: number; height: number }> = {
    fear: { x: 0.006, y: 0.006, width: 0.988, height: 0.988 },
    school: { x: 0.008, y: 0.006, width: 0.984, height: 0.988 },
    anger: { x: 0.035, y: 0.018, width: 0.93, height: 0.948 },
  };

  return cropByBookId[bookId] ?? { x: 0, y: 0, width: 1, height: 1 };
}

function imageSrc(image?: StaticImageData | string) {
  if (!image) return "";
  return typeof image === "string" ? image : image.src;
}

function pageTextureKey(book: StoryBook, page: StoryBookPage | undefined, side: "left" | "right" | "single") {
  return `${book.id}:${page?.id ?? "empty"}:${side}`;
}

function loadHtmlImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
      return;
    }
    line = next;
  });
  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((lineText, index) => {
    context.fillText(lineText, x, y + index * lineHeight);
  });
}

function createBasePageTexture(label = ""): THREE.Texture {
  if (typeof document === "undefined") {
    const texture = new THREE.DataTexture(new Uint8Array([255, 247, 232, 255]), 1, 1);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#fff7e8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(127, 91, 48, 0.014)";
  for (let y = 0; y < canvas.height; y += 18) {
    ctx.fillRect(0, y, canvas.width, 1);
  }
  ctx.fillStyle = "#8a91a6";
  ctx.font = "700 28px Arial";
  ctx.fillText(label.toUpperCase(), 92, 110);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function useStoryPageTexture(book: StoryBook, page?: StoryBookPage, side: "left" | "right" | "single" = "left") {
  const fallback = useMemo(() => createBasePageTexture(page?.type === "moral" ? "Morale" : "Page"), [page?.type]);
  const cacheKey = pageTextureKey(book, page, side);
  const [texture, setTexture] = useState<THREE.Texture>(() => pageTextureCache.get(cacheKey) ?? fallback);

  useEffect(() => {
    let cancelled = false;

    const cached = pageTextureCache.get(cacheKey);
    if (cached) {
      setTexture(cached);
      return () => {
        cancelled = true;
      };
    }

    async function draw() {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const isMoral = page?.type === "moral";
      const isLocked = page?.type === "locked";
      const pageLabel = isMoral ? "Mot de fin" : page?.pageNumber ? `Page ${page.pageNumber}` : "Page";
      const pageImage = page?.image ?? (page?.type === "story" ? book.coverImage : undefined);
      const illustrationBelowText = Boolean(page?.pageNumber && page.pageNumber % 2 === 0);
      const imageBox = illustrationBelowText ? { x: 54, y: 876, w: 1092, h: 620 } : { x: 54, y: 144, w: 1092, h: 728 };

      ctx.fillStyle = "#fff8ec";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pageShade = ctx.createLinearGradient(0, 0, canvas.width, 0);
      if (side === "left") {
        pageShade.addColorStop(0, "rgba(53, 36, 20, 0.075)");
        pageShade.addColorStop(0.12, "rgba(53, 36, 20, 0)");
        pageShade.addColorStop(0.92, "rgba(53, 36, 20, 0.030)");
        pageShade.addColorStop(1, "rgba(53, 36, 20, 0.14)");
      } else {
        pageShade.addColorStop(0, "rgba(53, 36, 20, 0.13)");
        pageShade.addColorStop(0.1, "rgba(53, 36, 20, 0.026)");
        pageShade.addColorStop(0.88, "rgba(53, 36, 20, 0)");
        pageShade.addColorStop(1, "rgba(255,255,255,0.24)");
      }
      ctx.fillStyle = pageShade;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(920, 100, 40, 920, 100, 720);
      gradient.addColorStop(0, "rgba(107, 85, 239, 0.044)");
      gradient.addColorStop(1, "rgba(107, 85, 239, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(119, 89, 49, 0.010)";
      for (let y = 0; y < canvas.height; y += 18) {
        ctx.fillRect(0, y, canvas.width, 1);
      }
      ctx.fillStyle = "rgba(119, 89, 49, 0.018)";
      for (let x = 0; x < canvas.width; x += 34) {
        ctx.fillRect(x, 0, 1, canvas.height);
      }

      ctx.fillStyle = "#8a91a6";
      ctx.font = "800 28px Arial";
      ctx.fillText(pageLabel.toUpperCase(), 96, 112);

      if (isLocked) {
        const glow = ctx.createRadialGradient(600, 520, 40, 600, 520, 620);
        glow.addColorStop(0, "rgba(255, 98, 87, 0.13)");
        glow.addColorStop(0.45, "rgba(107, 85, 239, 0.09)");
        glow.addColorStop(1, "rgba(107, 85, 239, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#fffaf4";
        ctx.strokeStyle = "rgba(7, 11, 45, 0.09)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(120, 260, 960, 980, 46);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ff6257";
        ctx.beginPath();
        ctx.roundRect(482, 350, 236, 74, 37);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SUITE PRÊTE", 600, 398);
        ctx.textAlign = "left";

        ctx.fillStyle = "#070b2d";
        ctx.font = "900 74px Arial";
        wrapText(ctx, page?.title ?? "La suite de l’histoire est prête.", 190, 540, 820, 86, 3);

        ctx.fillStyle = "#59617e";
        ctx.font = "700 40px Arial";
        wrapText(
          ctx,
          page?.text ??
            "Débloque le mini-livre complet pour lire toutes ses pages et le retrouver quand tu veux dans ta bibliothèque.",
          190,
          780,
          820,
          58,
          5,
        );

        ctx.fillStyle = "#ff6257";
        ctx.beginPath();
        ctx.roundRect(190, 1030, 820, 92, 46);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "900 34px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Débloquer le livre — 3,99 €", 600, 1088);

        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "rgba(7, 11, 45, 0.14)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(190, 1148, 820, 86, 43);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#070b2d";
        ctx.font = "900 32px Arial";
        ctx.fillText("Paiement unique · sans abonnement", 600, 1202);
        ctx.textAlign = "left";

        const nextTexture = new THREE.CanvasTexture(canvas);
        nextTexture.colorSpace = THREE.SRGBColorSpace;
        nextTexture.anisotropy = 8;
        nextTexture.needsUpdate = true;
        pageTextureCache.set(cacheKey, nextTexture);
        if (!cancelled) setTexture(nextTexture);
        return;
      }

      if (pageImage) {
        try {
          const image = await loadHtmlImage(imageSrc(pageImage));
          if (!cancelled) {
            const boxX = imageBox.x;
            const boxY = imageBox.y;
            const boxW = imageBox.w;
            const boxH = imageBox.h;
            const crop = getCoverCrop(book.id);
            const sourceX = image.width * crop.x;
            const sourceY = image.height * crop.y;
            const sourceW = image.width * crop.width;
            const sourceH = image.height * crop.height;
            const ratio = Math.max(boxW / sourceW, boxH / sourceH);
            const drawW = sourceW * ratio;
            const drawH = sourceH * ratio;
            const drawX = boxX + (boxW - drawW) / 2;
            const drawY = boxY + (boxH - drawH) / 2;

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(boxX, boxY, boxW, boxH, 46);
            ctx.clip();
            ctx.drawImage(image, sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH);
            ctx.restore();

            ctx.strokeStyle = "rgba(7, 11, 45, 0.07)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(boxX, boxY, boxW, boxH, 46);
            ctx.stroke();
          }
        } catch {
          // Page illustrations are optional. Keep the page readable if one image fails.
        }
      }

      ctx.fillStyle = "#4c5578";
      ctx.font = isMoral ? "700 46px Arial" : "700 41px Arial";
      const textY = pageImage && !illustrationBelowText ? 958 : isMoral ? 430 : 210;
      wrapText(ctx, page?.text ?? "", 96, textY, 1008, 66, illustrationBelowText ? 9 : isMoral ? 6 : 7);

      ctx.fillStyle = side === "left" ? "rgba(7,11,45,0.018)" : "rgba(255,255,255,0.15)";
      ctx.fillRect(side === "left" ? 0 : canvas.width - 42, 0, 42, canvas.height);

      const nextTexture = new THREE.CanvasTexture(canvas);
      nextTexture.colorSpace = THREE.SRGBColorSpace;
      nextTexture.anisotropy = 8;
      nextTexture.needsUpdate = true;
      pageTextureCache.set(cacheKey, nextTexture);
      if (!cancelled) setTexture(nextTexture);
    }

    draw();
    return () => {
      cancelled = true;
    };
  }, [book, cacheKey, fallback, page, side]);

  // Read the cache during render too: a newly selected spread must never paint the
  // previous fallback for one frame while React waits to run the effect above.
  return pageTextureCache.get(cacheKey) ?? texture;
}

function StoryPageTexturePreloader({ book, page }: { book: StoryBook; page: StoryBookPage }) {
  // Build every page face while the cover is displayed, so a flip never waits on a canvas texture.
  useStoryPageTexture(book, page, "left");
  useStoryPageTexture(book, page, "right");
  useStoryPageTexture(book, page, "single");
  return null;
}

function useCoverTexture(book: StoryBook) {
  const fallback = useMemo(() => createBasePageTexture(book.title), [book.title]);
  const [texture, setTexture] = useState<THREE.Texture>(fallback);

  useEffect(() => {
    let cancelled = false;

    async function drawCover() {
      const src = imageSrc(book.coverImage);
      if (!src) return;

      try {
        const image = await loadHtmlImage(src);
        if (cancelled) return;

        const crop = getCoverCrop(book.id);
        const sourceX = image.width * crop.x;
        const sourceY = image.height * crop.y;
        const sourceW = image.width * crop.width;
        const sourceH = image.height * crop.height;

        const canvas = document.createElement("canvas");
        canvas.width = 1200;
        canvas.height = 1600;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#071022";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, sourceX, sourceY, sourceW, sourceH, 0, 0, canvas.width, canvas.height);

        const vignette = ctx.createLinearGradient(0, 0, canvas.width, 0);
        vignette.addColorStop(0, "rgba(0,0,0,0.22)");
        vignette.addColorStop(0.11, "rgba(0,0,0,0.02)");
        vignette.addColorStop(0.88, "rgba(255,255,255,0)");
        vignette.addColorStop(1, "rgba(0,0,0,0.10)");
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const titleWash = ctx.createLinearGradient(0, 0, 0, 590);
        titleWash.addColorStop(0, "rgba(20,36,78,1)");
        titleWash.addColorStop(0.68, "rgba(20,36,78,1)");
        titleWash.addColorStop(1, "rgba(20,36,78,0)");
        ctx.fillStyle = titleWash;
        ctx.fillRect(0, 0, canvas.width, 590);
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.font = "700 31px Arial";
        ctx.fillText("StoryKid", 600, 104);
        ctx.fillStyle = "#ffffff";
        ctx.font = "700 72px Georgia";
        wrapText(ctx, book.title, 600, 218, 1000, 82, 3);
        ctx.textAlign = "left";

        const nextTexture = new THREE.CanvasTexture(canvas);
        nextTexture.colorSpace = THREE.SRGBColorSpace;
        nextTexture.anisotropy = 12;
        nextTexture.needsUpdate = true;
        if (!cancelled) setTexture(nextTexture);
      } catch {
        // Keep the fallback texture if a cover fails to load.
      }
    }

    drawCover();
    return () => {
      cancelled = true;
    };
  }, [book]);

  return texture;
}

function setGroupOpacity(group: THREE.Group | null, opacity: number) {
  if (!group) return;
  group.traverse((object) => {
    const mesh = object as THREE.Mesh;
    const material = mesh.material;
    if (!material) return;
    const materials = Array.isArray(material) ? material : [material];
    materials.forEach((item) => {
      item.transparent = true;
      item.opacity = opacity;
      item.needsUpdate = true;
    });
  });
}

function PageMesh({
  texture,
  side,
}: {
  texture: THREE.Texture;
  side: "left" | "right" | "single";
  isMobile: boolean;
}) {
  const x = side === "single" ? 0 : side === "left" ? -PAGE_W / 2 : PAGE_W / 2;
  const rotationY = side === "left" ? 0.055 : side === "right" ? -0.055 : 0;
  const pageGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 28, 12);
    const positions = geometry.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const px = positions.getX(index);
      const normalized = Math.abs(px) / (PAGE_W / 2);
      const edgeLift = Math.pow(normalized, 2) * 0.032;
      const crease = side === "left" ? Math.max(0, px / (PAGE_W / 2)) : Math.max(0, -px / (PAGE_W / 2));
      positions.setZ(index, edgeLift - crease * 0.012);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, [side]);

  return (
    <group position={[x, 0, 0.03]} rotation-y={rotationY}>
      <mesh position={[0, -0.012, -0.052]} receiveShadow>
        <planeGeometry args={[PAGE_W + 0.08, PAGE_H + 0.09]} />
        <meshBasicMaterial color="#3b2a19" transparent opacity={0.026} />
      </mesh>
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh
          key={`edge-${index}`}
          position={[
            side === "left" ? -PAGE_W / 2 - 0.018 : PAGE_W / 2 + 0.018,
            -0.015 + index * 0.0015,
            -0.02 - index * 0.006,
          ]}
          receiveShadow
        >
          <boxGeometry args={[0.007, PAGE_H - 0.16, 0.003]} />
          <meshStandardMaterial color={index % 2 ? "#e8dcc7" : "#fbf1df"} roughness={0.98} />
        </mesh>
      ))}
      <mesh receiveShadow castShadow>
        <primitive object={pageGeometry} attach="geometry" />
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function BookModel({
  book,
  stage,
  leftPage,
  rightPage,
  singlePage,
  turningPage,
  isMobile,
  coverHovered = false,
}: Book3DSceneProps) {
  const coverTexture = useCoverTexture(book);
  const leftTexture = useStoryPageTexture(book, leftPage, "left");
  const rightTexture = useStoryPageTexture(book, rightPage, "right");
  const singleTexture = useStoryPageTexture(book, singlePage, "single");
  const turningTexture = useStoryPageTexture(
    book,
    turningPage?.frontPage,
    turningPage?.direction === "prev" ? "left" : "right",
  );
  const turningBackTexture = useStoryPageTexture(
    book,
    turningPage?.backPage,
    turningPage?.direction === "prev" ? "right" : "left",
  );
  const closedGroup = useRef<THREE.Group>(null);
  const openGroup = useRef<THREE.Group>(null);
  const coverPivot = useRef<THREE.Group>(null);
  const turnPivot = useRef<THREE.Group>(null);
  const openProgress = useRef(0);
  const turnProgress = useRef(1);
  const lastTurnKey = useRef<number | null>(null);

  useFrame(({ clock }, delta) => {
    const target = stage === "cover" ? 0 : 1;
    openProgress.current += (target - openProgress.current) * 0.048;
    const open = openProgress.current;

    if (closedGroup.current) {
      const closedScale = isMobile ? 0.72 : 1.04;
      const hoverLift = coverHovered && stage === "cover" ? 0.03 : 0;
      closedGroup.current.position.x = isMobile ? 0 : -0.96 * (1 - open);
      closedGroup.current.position.y = 0.12 + hoverLift + Math.sin(clock.elapsedTime * 1.15) * 0.035 * (1 - open);
      closedGroup.current.position.z = open * -0.24;
      closedGroup.current.scale.setScalar(
        closedScale * (1 + (coverHovered && stage === "cover" ? 0.018 : 0) + (stage === "opening" ? 0.035 : 0) - open * 0.04),
      );
      setGroupOpacity(closedGroup.current, Math.max(0, 1 - open * 1.25));
      closedGroup.current.visible = open < 0.98;
    }

    if (coverPivot.current) {
      coverPivot.current.rotation.y = -open * 1.9;
    }

    if (openGroup.current) {
      const visible = Math.min(1, Math.max(0, (open - 0.34) / 0.66));
      openGroup.current.visible = visible > 0.02;
      openGroup.current.scale.setScalar((isMobile ? 0.88 : 1.04) * (0.92 + visible * 0.08));
      openGroup.current.position.y = -0.05 + visible * 0.05;
      setGroupOpacity(openGroup.current, visible);
    }

    if (turningPage && lastTurnKey.current !== turningPage.key) {
      lastTurnKey.current = turningPage.key;
      turnProgress.current = 0;
      if (turnPivot.current) {
        turnPivot.current.visible = true;
      }
    }

    if (turnPivot.current) {
      if (turningPage) {
        turnProgress.current = Math.min(1, turnProgress.current + delta / 0.62);
        const eased = 0.5 - Math.cos(turnProgress.current * Math.PI) / 2;
        turnPivot.current.visible = turnProgress.current < 0.985;
        turnPivot.current.rotation.y =
          turningPage.direction === "next" ? -eased * Math.PI * 0.95 : eased * Math.PI * 0.95;
      } else {
        turnPivot.current.visible = false;
      }
    }
  });

  return (
    <group rotation-x={isMobile ? -0.04 : -0.08} rotation-y={isMobile ? 0 : -0.08}>
      {book.pages.map((page) => (
        <StoryPageTexturePreloader key={`preload-${page.id}`} book={book} page={page} />
      ))}
      <group ref={closedGroup} position={[0, 0, 0]}>
        <mesh position={[0.055, -0.05, -0.115]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[COVER_W * 1.02, 0.62]} />
          <meshBasicMaterial color="#000000" transparent opacity={coverHovered && stage === "cover" ? 0.34 : 0.24} />
        </mesh>
        <mesh position={[COVER_W / 2 - 0.062, -0.012, -0.02]} receiveShadow>
          <boxGeometry args={[0.028, COVER_H * 0.88, 0.062]} />
          <meshStandardMaterial color="#f5ead6" roughness={0.96} />
        </mesh>
        {Array.from({ length: 5 }).map((_, index) => (
          <mesh
            key={`closed-stack-${index}`}
            position={[COVER_W / 2 - 0.085 + index * 0.006, -0.012, 0.012 - index * 0.006]}
            receiveShadow
          >
            <boxGeometry args={[0.004, COVER_H * 0.88, 0.014]} />
            <meshStandardMaterial color={index % 2 ? "#dacfb9" : "#fff3df"} roughness={0.98} />
          </mesh>
        ))}
        <group ref={coverPivot} position={[-COVER_W / 2, 0, 0.055]}>
          <mesh position={[COVER_W / 2, 0, 0]} castShadow>
            <planeGeometry args={[COVER_W, COVER_H]} />
            <meshStandardMaterial
              map={coverTexture}
              roughness={0.48}
              metalness={0.01}
              transparent
              alphaTest={0.03}
              side={THREE.FrontSide}
            />
          </mesh>
        </group>
      </group>

      <group ref={openGroup} visible={false} position={[0, 0, 0]}>
        <mesh position={[0, -0.038, -0.098]} receiveShadow castShadow>
          <boxGeometry args={[PAGE_W * (isMobile ? 1.035 : 2.075), PAGE_H + 0.1, 0.058]} />
          <meshStandardMaterial color="#5b3828" roughness={0.86} />
        </mesh>
        {isMobile ? (
          <PageMesh texture={singleTexture} side="single" isMobile />
        ) : (
          <>
            <PageMesh texture={leftTexture} side="left" isMobile={false} />
            <PageMesh texture={rightTexture} side="right" isMobile={false} />
            <mesh position={[0, 0, 0.066]} receiveShadow>
              <planeGeometry args={[0.07, PAGE_H + 0.02]} />
              <meshBasicMaterial color="#3c2c1f" transparent opacity={0.055} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.02, 0.073]} receiveShadow>
              <planeGeometry args={[0.018, PAGE_H - 0.08]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.20} side={THREE.DoubleSide} />
            </mesh>
          </>
        )}
        <mesh position={[0, -PAGE_H / 2 - 0.06, -0.2]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[isMobile ? PAGE_W * 1.08 : PAGE_W * 2.18, 0.5]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.16} />
        </mesh>
        {turningPage && (
          <group
            ref={turnPivot}
            position={[isMobile ? -PAGE_W / 2 : 0, 0, 0.125]}
            visible={false}
          >
            <group
              position={[
                isMobile ? PAGE_W / 2 : turningPage.direction === "next" ? PAGE_W / 2 : -PAGE_W / 2,
                0,
                0,
              ]}
            >
              <mesh position={[0, 0, 0.004]} castShadow>
                <planeGeometry args={[PAGE_W, PAGE_H, 24, 12]} />
                <meshStandardMaterial
                  map={turningTexture}
                  roughness={0.82}
                  metalness={0}
                  toneMapped={false}
                  side={THREE.FrontSide}
                />
              </mesh>
              <mesh position={[0, 0, -0.004]} rotation-y={Math.PI} castShadow>
                <planeGeometry args={[PAGE_W, PAGE_H, 24, 12]} />
                <meshStandardMaterial
                  map={turningBackTexture}
                  roughness={0.82}
                  metalness={0}
                  toneMapped={false}
                  side={THREE.FrontSide}
                />
              </mesh>
              <mesh position={[turningPage.direction === "next" ? -PAGE_W / 2 : PAGE_W / 2, 0, 0]}>
                <boxGeometry args={[0.012, PAGE_H, 0.014]} />
                <meshStandardMaterial color="#eadcc7" roughness={0.95} />
              </mesh>
            </group>
          </group>
        )}
      </group>
    </group>
  );
}

export function Book3DScene(props: Book3DSceneProps) {
  return (
    <>
      <ambientLight intensity={1.8} />
      <directionalLight position={[3.5, 4.8, 5.5]} intensity={3.2} castShadow />
      <pointLight position={[-3, 2, 4]} intensity={1.1} color="#9c8cff" />
      <BookModel {...props} />
    </>
  );
}

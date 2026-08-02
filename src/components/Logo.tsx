import Image from "next/image";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/logo-mark.png"
        alt=""
        width={119}
        height={128}
        unoptimized
        className="h-8 w-auto rounded-[7px]"
        priority
      />
      <span
        className={`font-display text-xl font-semibold tracking-tight ${
          dark ? "text-canvas" : "text-ink"
        }`}
      >
        Dent<span className={dark ? "text-accent-bright" : "text-accent-ink"}>Digital</span>
      </span>
    </span>
  );
}

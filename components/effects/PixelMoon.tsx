import Image from 'next/image';

const MOON_SRC = '/art/blood-moon-256.png';

export default function PixelMoon({ className = '' }: { className?: string }) {
  return (
    <Image
      src={MOON_SRC}
      width={256}
      height={256}
      className={`pixel-moon ${className}`.trim()}
      alt="Original QOZYD blood moon, with pixel craters and a glowing lunar canyon"
      draggable={false}
      unoptimized
    />
  );
}

import Image from "next/image";

/** The block J. Decorative: the link around it already says where it goes. */
export default function BrandMark() {
  return <Image className="brand-mark" src="/brand/mark.png" alt="" aria-hidden="true" width={128} height={128} priority />;
}

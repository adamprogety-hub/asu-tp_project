import type { SVGProps } from "react";

export default function BrandStar({
  size = 16,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`brand-star-icon ${className}`}
      aria-hidden="true"
      fill="currentColor"
      {...props}
    >
      <path d="M50 5 C50 5,56 38,62 44 C68 50,95 50,95 50 C95 50,68 50,62 56 C56 62,50 95,50 95 C50 95,44 62,38 56 C32 50,5 50,5 50 C5 50,32 50,38 44 C44 38,50 5,50 5 Z" />
    </svg>
  );
}

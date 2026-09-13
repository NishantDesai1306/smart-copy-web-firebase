export function BrandMark({ size = 42 }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
    >
      <rect width="48" height="48" rx="14" fill="#2457FF" />
      <path
        d="M16 14.5h13.5a4 4 0 0 1 4 4V32a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V18.5a4 4 0 0 1 4-4Z"
        fill="white"
      />
      <path d="M20 11h12a4 4 0 0 1 4 4v15" stroke="#8FC7FF" strokeWidth="3" />
      <path
        d="M18.5 22h8M18.5 27h10M18.5 32h6"
        stroke="#2457FF"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

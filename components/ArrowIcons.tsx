function ArrowIcon({ path }: { path: string }) {
  return (
    <svg
      className="ui-arrow"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpRight() {
  return <ArrowIcon path="M7 17L17 7M9 7h8v8" />;
}

export function ArrowDown() {
  return <ArrowIcon path="M12 5v14M6 13l6 6 6-6" />;
}

export function ArrowLeftRight() {
  return <ArrowIcon path="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4" />;
}

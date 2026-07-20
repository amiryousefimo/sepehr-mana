type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({className = "", compact = false}: BrandMarkProps) {
  return (
    <span className={`brand-mark ${className}`.trim()}>
      <svg aria-hidden="true" className="brand-mark__symbol" viewBox="0 0 64 64">
        <path d="M7 48 23 14l9 18-8 16H7Z" />
        <path d="m57 48-16-34-9 18 8 16h17Z" />
        <path d="m25 48 7-14 7 14H25Z" />
      </svg>
      {!compact && (
        <span className="brand-mark__text">
          <b>تکاپوگران</b>
          <small>سپهر مانا</small>
        </span>
      )}
    </span>
  );
}

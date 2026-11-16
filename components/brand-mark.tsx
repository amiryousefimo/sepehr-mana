type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({className = "", compact = false}: BrandMarkProps) {
  return (
    <span className={`brand-mark ${className}`.trim()} aria-label="شرکت تکاپوگران سپهر مانا">
      <img src="/company-logo.jpeg" alt="لوگوی شرکت تکاپوگران سپهر مانا" className={`brand-mark__image${compact ? " brand-mark__image--compact" : ""}`} width={compact ? 44 : 58} height={compact ? 44 : 58} />
    </span>
  );
}

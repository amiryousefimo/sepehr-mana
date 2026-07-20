export function SectionHeading({
  label,
  title,
  description,
  align = "start"
}: {
  label: string;
  title: string;
  description?: string;
  align?: "start" | "center";
}) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <span className="section-kicker">
        <i />
        {label}
      </span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  );
}

export function NetworkVisual({signals}: {signals: string[]}) {
  return (
    <div className="network-visual" aria-hidden="true">
      <div className="network-visual__halo" />
      <svg className="network-visual__lines" viewBox="0 0 620 620">
        <circle cx="310" cy="310" r="182" />
        <circle cx="310" cy="310" r="112" />
        <path d="M94 208 310 310 508 132" />
        <path d="M98 432 310 310 528 410" />
        <path d="M310 74v236l154 174" />
        <path d="m168 106 142 204-94 246" />
      </svg>
      <div className="network-visual__core">
        <span className="network-visual__core-ring" />
        <span className="network-visual__core-letter">ت</span>
      </div>
      {signals.map((signal, index) => (
        <span className={`network-node network-node--${index + 1}`} key={signal}>
          <i />
          {signal}
        </span>
      ))}
      <span className="network-dot network-dot--1" />
      <span className="network-dot network-dot--2" />
      <span className="network-dot network-dot--3" />
    </div>
  );
}

import "./cta.css";

function ArrowIcon() {
  return (
    <svg
      className="btn-icon-icon__arrow"
      data-button-anim-target
      fill="none"
      viewBox="0 0 10 8"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.45231 0.385986H6.02531L9.30131 3.99999L6.02531 7.61399H4.45231L7.40331 4.58499H0.695312V3.42799H7.41631L4.45231 0.385986Z"
        fill="currentColor"
      />
    </svg>
  );
}

type CtaProps = {
  href: string;
  children: string;
  className?: string;
  variant?: "primary" | "secondary";
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

export default function Cta({
  href,
  children,
  className,
  variant = "primary",
  onClick,
}: CtaProps) {
  return (
    <a
      className={[
        "btn-icon-link",
        variant === "secondary" ? "btn-icon-link--secondary" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      href={href}
      onClick={onClick}
    >
      <div className="btn-icon-content">
        <div className="btn-icon-content__mask">
          <span className="btn-icon-content__text" data-button-anim-target>
            {children}
          </span>
        </div>
        <div className="btn-icon-icon" data-icon-size="normal">
          <div className="btn-icon-icon__bg" data-button-anim-target />
          <div className="btn-icon-icon__wrap">
            <div className="btn-icon-icon__list">
              <ArrowIcon />
              <ArrowIcon />
              <ArrowIcon />
            </div>
          </div>
        </div>
        <div className="btn-icon-content__bg" data-button-anim-target />
      </div>
    </a>
  );
}

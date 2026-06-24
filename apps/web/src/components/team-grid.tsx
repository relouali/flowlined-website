import Image from "next/image";
import { User } from "lucide-react";

import "./team-grid.css";

export type TeamMember = {
  name: string;
  role: string;
  /** Optional portrait. When omitted, a neutral placeholder is shown. */
  image?: string;
};

type TeamGridProps = {
  members: ReadonlyArray<TeamMember>;
};

export default function TeamGrid({ members }: TeamGridProps) {
  return (
    <div className="team-grid">
      <div className="team-grid__list">
        {members.map((member) => (
          <div key={member.name} className="team-grid__item">
            <div className="team-card__wrap">
              <div className="team-card">
                {member.image ? (
                  <Image
                    alt={member.name}
                    className="team-card__image"
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 768px) 45vw, 50vw"
                    src={member.image}
                  />
                ) : (
                  <div className="team-card__placeholder" aria-hidden>
                    <User strokeWidth={1} />
                  </div>
                )}
                <div
                  className="team-card__blur"
                  aria-hidden
                  // Inline so the CSS pipeline (Lightning CSS) doesn't strip it.
                  style={{
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}
                />
                <div className="team-card__scrim" aria-hidden />
                <div className="team-card__content">
                  <h3 className="type-body-strong text-white">
                    {member.name}
                  </h3>
                  <p className="type-body text-white/70">{member.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

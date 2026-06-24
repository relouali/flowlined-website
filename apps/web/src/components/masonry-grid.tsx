import Image from "next/image";

import "./masonry-grid.css";

export type MasonryItem = {
  src: string;
  alt: string;
  variant?: "wide" | "square" | "tall";
};

type MasonryGridProps = {
  items: ReadonlyArray<MasonryItem>;
  className?: string;
  sizes?: string;
};

export default function MasonryGrid({
  items,
  className,
  sizes = "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw",
}: MasonryGridProps) {
  return (
    <div className={`masonry-wrap${className ? ` ${className}` : ""}`}>
      <div className="masonry-collection">
        <div className="masonry-list" data-masonry-list>
          {items.map((item, index) => (
            <div key={`${item.src}-${index}`} className="masonry-item">
              <div
                className={`masonry-item__visual${
                  item.variant ? ` is--${item.variant}` : ""
                }`}
              >
                <Image
                  alt={item.alt}
                  className="masonry-item__visual-img"
                  fill
                  loading="lazy"
                  sizes={sizes}
                  src={item.src}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

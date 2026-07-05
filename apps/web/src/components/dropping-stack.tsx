"use client";

import { useEffect, useRef } from "react";

import { initDroppingCardsStack } from "@/lib/init-dropping-stack";

import "./dropping-stack.css";

export type DroppingStackCard = {
  index: string;
  tags: readonly string[];
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
};

type DroppingStackProps = {
  cards: readonly DroppingStackCard[];
};

export default function DroppingStack({ cards }: DroppingStackProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cleanup = () => {};
    const frame = requestAnimationFrame(() => {
      cleanup = initDroppingCardsStack(root);
    });

    return () => {
      cancelAnimationFrame(frame);
      cleanup();
    };
  }, [cards]);

  return (
    <div ref={rootRef} data-dropping-stack-init="" className="dropping-stack">
      <div data-dropping-stack-collection="" className="dropping-stack__collection">
        <div className="dropping-stack__list">
          {cards.map((card) => (
            <div
              key={`${card.index}-${card.title}`}
              data-dropping-stack-item=""
              className="dropping-stack__item"
            >
              <div className="dropping-stack-card">
                <div className="dropping-stack-card__before" />
                <div className="dropping-stack-card__content">
                  <div className="dropping-stack-card__start">
                    <div className="dropping-stack-card__visual">
                      <div className="dropping-stack-card__visual-before" />
                      {card.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={card.imageSrc}
                          loading="lazy"
                          alt={card.imageAlt ?? ""}
                          className="droping-stack-card__visual-img"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="dropping-stack-card__visual-index"
                        >
                          {card.index}
                        </span>
                      )}
                    </div>
                    <div className="dropping-stack-card__words">
                      {card.tags.map((tag) => (
                        <p key={tag} className="dropping-stack-card__p">
                          {tag}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="dropping-stack-card__end">
                    <h3 className="dropping-stack-card__h">{card.title}</h3>
                    <p className="dropping-stack-card__desc">{card.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="dropping-stack__controls">
        <div data-dropping-stack-prev="" className="dropping-stack__control is--prev">
          <div className="dropping-stack__control-circle is--prev">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              viewBox="0 0 18 18"
              fill="none"
              className="dropping-stack__control-svg"
              aria-hidden
            >
              <path
                d="M6.74976 14.25L11.9998 9L6.74976 3.75"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div data-dropping-stack-next="" className="dropping-stack__control">
          <div className="dropping-stack__control-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              viewBox="0 0 18 18"
              fill="none"
              className="dropping-stack__control-svg"
              aria-hidden
            >
              <path
                d="M6.74976 14.25L11.9998 9L6.74976 3.75"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

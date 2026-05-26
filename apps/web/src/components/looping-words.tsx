"use client";

import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";

import "./looping-words.css";

type LoopingWordsProps = {
  words: ReadonlyArray<string>;
  onChange?: (index: number) => void;
  intervalSeconds?: number;
  durationSeconds?: number;
  className?: string;
};

/**
 * Faithful port of Osmo's "Looping Words with Selector" snippet.
 *
 * Differences from the original:
 *  1. The initial DOM order is rotated so the consumer's words[0] lands in
 *     the visual centre (the snippet's center is at DOM index 1 by design).
 *  2. An `indices` array tracks the DOM-to-original mapping through every
 *     recycle so onChange always reports the ORIGINAL word index.
 *  3. The recycled item fades in on appearance — without this, with short
 *     word lists (3 items) the recycle happens on every cycle and the
 *     previously-top word visibly "pops" into the bottom row.
 *
 * Everything else (gradient, bracket easing, slide elastic, dwell time)
 * matches the Osmo reference exactly.
 */
export default function LoopingWords({
  words,
  onChange,
  intervalSeconds = 2,
  durationSeconds = 1.2,
  className,
}: LoopingWordsProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Rotate the array so words[0] is at index 1 in the rendered DOM.
  const arrangedWords = useMemo(() => {
    if (words.length === 0) return [];
    return [words[words.length - 1], ...words.slice(0, -1)];
  }, [words]);

  const initialIndices = useMemo(() => {
    if (words.length === 0) return [];
    return [
      words.length - 1,
      ...Array.from({ length: words.length - 1 }, (_, i) => i),
    ];
  }, [words]);

  useEffect(() => {
    const wordList = listRef.current;
    const edgeElement = selectorRef.current;
    if (!wordList || !edgeElement) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const totalWords = arrangedWords.length;
    if (totalWords === 0) return;

    const wordHeight = 100 / totalWords;
    let currentIndex = 0;
    const indices = [...initialIndices];

    function updateEdgeWidth() {
      const centerIndex = (currentIndex + 1) % totalWords;
      const centerWord = wordList?.children[centerIndex] as
        | HTMLElement
        | undefined;
      if (!wordList || !edgeElement || !centerWord) return;
      const centerWordWidth = centerWord.getBoundingClientRect().width;
      const listWidth = wordList.getBoundingClientRect().width;
      if (listWidth === 0) return;
      const percentageWidth = (centerWordWidth / listWidth) * 100;
      // Frame the word with a bit of breathing room instead of hugging it.
      // Clamped at 94% so very long words still keep some side margin.
      const framedWidth = Math.min(94, percentageWidth + 10);
      gsap.to(edgeElement, {
        width: `${framedWidth}%`,
        duration: 0.5,
        ease: "expo.out",
      });
    }

    function notifyActive() {
      const centerIndex = (currentIndex + 1) % totalWords;
      const originalIdx = indices[centerIndex];
      onChangeRef.current?.(originalIdx);
    }

    function moveWords() {
      if (!wordList) return;
      currentIndex += 1;

      gsap.to(wordList, {
        yPercent: -wordHeight * currentIndex,
        duration: durationSeconds,
        ease: "elastic.out(1, 0.85)",
        onStart: () => {
          updateEdgeWidth();
          notifyActive();
        },
        onComplete: () => {
          if (!wordList) return;
          if (currentIndex >= totalWords - 3) {
            // Capture the item being moved to the end BEFORE appendChild so
            // we can fade it in once it appears in the bottom row.
            const movedItem = wordList.children[0] as HTMLElement | undefined;
            wordList.appendChild(wordList.children[0]);
            currentIndex -= 1;
            gsap.set(wordList, { yPercent: -wordHeight * currentIndex });
            const shifted = indices.shift();
            if (shifted !== undefined) indices.push(shifted);

            // Smooth the recycle: fade the newly-appeared bottom word in
            // instead of letting it pop into existence behind the gradient.
            if (movedItem) {
              gsap.fromTo(
                movedItem,
                { opacity: 0 },
                { opacity: 1, duration: 0.45, ease: "power2.out" },
              );
            }
          }
        },
      });
    }

    updateEdgeWidth();
    notifyActive();

    const tl = gsap
      .timeline({ repeat: -1, delay: 1 })
      .call(moveWords)
      .to({}, { duration: intervalSeconds });

    return () => {
      tl.kill();
      gsap.killTweensOf(wordList);
      gsap.killTweensOf(edgeElement);
      Array.from(wordList.children).forEach((child) => {
        gsap.killTweensOf(child);
      });
    };
  }, [arrangedWords, initialIndices, intervalSeconds, durationSeconds]);

  return (
    <div className={["looping-words", className].filter(Boolean).join(" ")}>
      <div className="looping-words__containers">
        <ul
          ref={listRef}
          data-looping-words-list
          className="looping-words__list"
        >
          {arrangedWords.map((word, i) => (
            <li key={`${word}-${i}`} className="looping-words__item">
              <p className="looping-words__p">{word}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="looping-words__fade" aria-hidden />
      <div
        ref={selectorRef}
        data-looping-words-selector
        className="looping-words__selector"
        aria-hidden
      >
        <div className="looping-words__edge" />
        <div className="looping-words__edge is--2" />
        <div className="looping-words__edge is--3" />
        <div className="looping-words__edge is--4" />
      </div>
    </div>
  );
}

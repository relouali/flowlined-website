"use client";

import gsap from "gsap";
import {
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import "./looping-words.css";

type LoopingWordsProps = {
  words: ReadonlyArray<string>;
  onChange?: (index: number) => void;
  intervalSeconds?: number;
  durationSeconds?: number;
  className?: string;
};

/**
 * Faithful port of Osmo's "Looping Words with Selector" snippet, with two
 * local additions:
 *  1. The slide easing is `power3.out` (Osmo uses `elastic.out`) so the framed
 *     word settles without wiggling inside the selector.
 *  2. The three on-screen words are selectable. Clicking the word above or
 *     below the centre jumps the loop one step in that direction (the only
 *     reachable targets), updates the active index, and restarts the dwell —
 *     so visitors can pick a word instead of waiting for the rotation.
 *
 * Everything else (gradient, bracket easing, recycle, dwell time) matches the
 * Osmo reference.
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
  // Set by the effect so the rendered items can request a jump on click.
  const selectItemRef = useRef<((item: HTMLElement) => void) | null>(null);

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
    let busy = false;
    let autoTl: gsap.core.Timeline | null = null;

    const centerDomIndex = () =>
      (((currentIndex + 1) % totalWords) + totalWords) % totalWords;

    function updateEdgeWidth() {
      const centerWord = wordList?.children[centerDomIndex()] as
        | HTMLElement
        | undefined;
      if (!wordList || !edgeElement || !centerWord) return;
      const centerWordWidth = centerWord.getBoundingClientRect().width;
      const listWidth = wordList.getBoundingClientRect().width;
      if (listWidth === 0) return;
      const percentageWidth = (centerWordWidth / listWidth) * 100;
      const framedWidth = Math.min(94, percentageWidth + 10);
      gsap.to(edgeElement, {
        width: `${framedWidth}%`,
        duration: 0.5,
        ease: "expo.out",
      });
    }

    function notifyActive() {
      onChangeRef.current?.(indices[centerDomIndex()]);
    }

    function recycleForward() {
      if (!wordList) return;
      if (currentIndex >= totalWords - 3) {
        const movedItem = wordList.children[0] as HTMLElement | undefined;
        wordList.appendChild(wordList.children[0]);
        currentIndex -= 1;
        gsap.set(wordList, { yPercent: -wordHeight * currentIndex });
        const shifted = indices.shift();
        if (shifted !== undefined) indices.push(shifted);
        if (movedItem) {
          gsap.fromTo(
            movedItem,
            { opacity: 0 },
            { opacity: 1, duration: 0.45, ease: "power2.out" },
          );
        }
      }
    }

    function recycleBackward() {
      if (!wordList) return;
      if (currentIndex <= 0) {
        const lastChild = wordList.children[
          wordList.children.length - 1
        ] as HTMLElement | undefined;
        if (lastChild) wordList.insertBefore(lastChild, wordList.children[0]);
        currentIndex += 1;
        gsap.set(wordList, { yPercent: -wordHeight * currentIndex });
        const popped = indices.pop();
        if (popped !== undefined) indices.unshift(popped);
        if (lastChild) {
          gsap.fromTo(
            lastChild,
            { opacity: 0 },
            { opacity: 1, duration: 0.45, ease: "power2.out" },
          );
        }
      }
    }

    function moveStep(direction: number, duration: number) {
      if (!wordList) return;
      busy = true;
      currentIndex += direction;
      gsap.to(wordList, {
        yPercent: -wordHeight * currentIndex,
        duration,
        ease: "power3.out",
        onStart: () => {
          updateEdgeWidth();
          notifyActive();
        },
        onComplete: () => {
          if (direction > 0) recycleForward();
          else recycleBackward();
          busy = false;
        },
      });
    }

    function startAutoplay() {
      autoTl?.kill();
      autoTl = gsap
        .timeline({ repeat: -1 })
        .to({}, { duration: intervalSeconds })
        .call(() => {
          if (!busy) moveStep(1, durationSeconds);
        });
    }

    // Jump to a clicked word. Only the prev / center / next words are visible,
    // so a valid target is always exactly one step away in either direction.
    selectItemRef.current = (item: HTMLElement) => {
      if (!wordList || busy) return;
      const domPos = Array.from(wordList.children).indexOf(item);
      if (domPos < 0) return;
      const delta = domPos - (currentIndex + 1);
      if (delta !== 1 && delta !== -1) return;
      autoTl?.kill();
      moveStep(delta, Math.min(durationSeconds, 0.7));
      startAutoplay();
    };

    updateEdgeWidth();
    notifyActive();
    startAutoplay();

    return () => {
      selectItemRef.current = null;
      autoTl?.kill();
      gsap.killTweensOf(wordList);
      gsap.killTweensOf(edgeElement);
      Array.from(wordList.children).forEach((child) => {
        gsap.killTweensOf(child);
      });
    };
  }, [arrangedWords, initialIndices, intervalSeconds, durationSeconds]);

  const handleSelect = (event: MouseEvent<HTMLLIElement>) => {
    selectItemRef.current?.(event.currentTarget);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectItemRef.current?.(event.currentTarget);
    }
  };

  return (
    <div className={["looping-words", className].filter(Boolean).join(" ")}>
      <div className="looping-words__containers">
        <ul
          ref={listRef}
          data-looping-words-list
          className="looping-words__list"
        >
          {arrangedWords.map((word, i) => (
            <li
              key={`${word}-${i}`}
              className="looping-words__item"
              role="button"
              tabIndex={0}
              aria-label={`Selecteer ${word}`}
              onClick={handleSelect}
              onKeyDown={handleKeyDown}
            >
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

'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { gsap } from 'gsap';

import './AccordionGallery.css';

export interface AccordionGalleryItem {
  image: string;
  label: string;
  alt?: string;
  link?: string;
}

export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  className?: string;
  onActiveChange?: (index: number) => void;
}

type PanelElement = HTMLAnchorElement | HTMLButtonElement;

const DEFAULT_ITEMS: AccordionGalleryItem[] = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' },
];

export default function AccordionGallery({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = '#ffffff',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  trigger = 'hover',
  showLabels = true,
  grayscale = true,
  className = '',
  onActiveChange = () => {},
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<PanelElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const textRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === 'vertical';
  const count = items.length;
  const safeDefault = count > 0 ? Math.min(Math.max(defaultIndex, 0), count - 1) : 0;
  const [active, setActive] = useState(safeDefault);
  const activeRef = useRef(safeDefault);

  useEffect(() => {
    if (count === 0) return;
    setActive(current => Math.min(current, count - 1));
  }, [count]);

  useEffect(() => {
    if (count > 0) onActiveChange(active);
  }, [active, count, onActiveChange]);

  const prefersReduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length || count === 0) return;

      const ratio = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1;
      const mediaSize = mediaSizeRef.current;
      const activeIndex = activeRef.current;

      tlRef.current?.kill();
      const animationDuration = animate && !prefersReduced ? duration : 0;
      const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });

      panels.forEach((panel, index) => {
        if (!panel) return;
        const isActive = index === activeIndex;
        const media = mediaRefs.current[index];
        const bar = barRefs.current[index];
        const text = textRefs.current[index];
        const rotation = isActive ? 0 : index < activeIndex ? tilt : -tilt;
        const rotationProps = vertical ? { rotateX: -rotation } : { rotateY: rotation };

        timeline.to(
          panel,
          { flexGrow: isActive ? grow : 1, ...rotationProps, duration: animationDuration, ease },
          0,
        );

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, activeIndex - index));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;
          timeline.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              '--ag-gray': gray,
              '--ag-dim': isActive ? 0 : 0.35,
              duration: animationDuration,
              ease,
            },
            0,
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            timeline.to(
              [bar, text],
              {
                opacity: 1,
                x: 0,
                duration: animationDuration,
                ease,
                stagger: prefersReduced ? 0 : stagger,
              },
              0,
            );
          } else {
            timeline.to(
              [bar, text],
              { opacity: 0, x: -14, duration: animationDuration * 0.6, ease },
              0,
            );
          }
        }
      });

      tlRef.current = timeline;
    },
    [
      count,
      duration,
      ease,
      expandRatio,
      grayscale,
      parallax,
      prefersReduced,
      showLabels,
      stagger,
      tilt,
      vertical,
    ],
  );

  useEffect(() => {
    const element = rootRef.current;
    if (!element || count === 0) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(
        140,
        usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22,
      );
      mediaSizeRef.current = size;
      element.style.setProperty('--ag-media-size', `${size}px`);
      applyLayout(false);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [applyLayout, count, expandRatio, gap, vertical]);

  useEffect(() => {
    activeRef.current = active;
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [active, applyLayout]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
    },
    [],
  );

  const handleEnter = (index: number) => {
    if (trigger === 'hover') setActive(index);
  };

  const handleClick = (index: number, event: MouseEvent<PanelElement>) => {
    if (index !== active) {
      event.preventDefault();
      setActive(index);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<PanelElement>) => {
    if (count === 0) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = (index + 1) % count;
      setActive(next);
      panelRefs.current[next]?.focus();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = (index - 1 + count) % count;
      setActive(next);
      panelRefs.current[next]?.focus();
    }
  };

  const galleryStyle = {
    '--ag-accent': accentColor,
    '--ag-overlay': overlayColor,
    '--ag-text': textColor,
    '--ag-gap': `${gap}px`,
    '--ag-radius': `${radius}px`,
    height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`,
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${className ? ` ${className}` : ''}`}
      style={galleryStyle}
      role="group"
      aria-label="QOZYD concept project gallery"
    >
      {items.map((item, index) => {
        const isActive = index === active;
        const content = (
          <>
            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={element => {
                  mediaRefs.current[index] = element;
                }}
              >
                <img
                  src={item.image}
                  alt={item.alt || item.label || ''}
                  draggable="false"
                  loading="lazy"
                />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span
                  className="ag-panel__bar"
                  ref={element => {
                    barRefs.current[index] = element;
                  }}
                />
                <span
                  className="ag-panel__text"
                  ref={element => {
                    textRefs.current[index] = element;
                  }}
                >
                  {item.label}
                </span>
              </span>
            )}
          </>
        );
        const sharedProps = {
          className: `ag-panel${isActive ? ' ag-panel--active' : ''}`,
          style: { borderRadius: `${radius}px` },
          onMouseEnter: () => handleEnter(index),
          onFocus: () => setActive(index),
          'aria-label': item.label,
        };

        if (item.link) {
          return (
            <a
              {...sharedProps}
              key={`${item.label}-${index}`}
              ref={element => {
                panelRefs.current[index] = element;
              }}
              href={item.link}
              onClick={event => handleClick(index, event)}
              onKeyDown={event => handleKeyDown(index, event)}
            >
              {content}
            </a>
          );
        }

        return (
          <button
            {...sharedProps}
            key={`${item.label}-${index}`}
            ref={element => {
              panelRefs.current[index] = element;
            }}
            type="button"
            aria-pressed={isActive}
            onClick={event => handleClick(index, event)}
            onKeyDown={event => handleKeyDown(index, event)}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

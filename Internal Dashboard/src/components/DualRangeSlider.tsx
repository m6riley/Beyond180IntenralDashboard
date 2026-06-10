import { createElement, useEffect, useRef, useState } from 'react';

type DualRangeSliderProps = {
  min: number;
  max: number;
  startValue: number;
  endValue: number;
  onStartChange: (value: number) => void;
  onEndChange: (value: number) => void;
};

type DragTarget = 'start' | 'end';

const THUMB_SIZE = 16;
const TRACK_HEIGHT = 6;

const centeredTrackStyle = {
  position: 'absolute' as const,
  left: 0,
  right: 0,
  top: '50%',
  height: TRACK_HEIGHT,
  transform: 'translateY(-50%)',
  borderRadius: 999,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getValueFromPointer(
  clientX: number,
  track: HTMLDivElement,
  min: number,
  max: number,
): number {
  const { left, width } = track.getBoundingClientRect();
  if (width <= 0 || max <= min) {
    return min;
  }

  const ratio = clamp((clientX - left) / width, 0, 1);
  return Math.round(min + ratio * (max - min));
}

export function DualRangeSlider({
  min,
  max,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
}: DualRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<DragTarget | null>(null);

  const span = max - min;
  const startPercent = span > 0 ? ((startValue - min) / span) * 100 : 0;
  const endPercent = span > 0 ? ((endValue - min) / span) * 100 : 100;

  useEffect(() => {
    if (!dragging) {
      return;
    }

    const handleMove = (clientX: number) => {
      const track = trackRef.current;
      if (!track) {
        return;
      }

      const nextValue = getValueFromPointer(clientX, track, min, max);

      if (dragging === 'start') {
        onStartChange(Math.min(nextValue, endValue));
        return;
      }

      onEndChange(Math.max(nextValue, startValue));
    };

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      handleMove(event.clientX);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        return;
      }

      event.preventDefault();
      handleMove(event.touches[0].clientX);
    };

    const stopDragging = () => {
      setDragging(null);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', stopDragging);
    document.addEventListener('touchcancel', stopDragging);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', stopDragging);
      document.removeEventListener('touchcancel', stopDragging);
    };
  }, [dragging, endValue, max, min, onEndChange, onStartChange, startValue]);

  const thumbStyle = (percent: number, target: DragTarget) => ({
    position: 'absolute' as const,
    top: '50%',
    left: `${percent}%`,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    transform: 'translate(-50%, -50%)',
    borderRadius: '999px',
    backgroundColor: '#3b82f6',
    border: '2px solid #ffffff',
    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.25)',
    cursor: dragging === target ? 'grabbing' : 'grab',
    zIndex: dragging === target ? 3 : target === 'end' ? 2 : 1,
    touchAction: 'none' as const,
    userSelect: 'none' as const,
  });

  return createElement(
    'div',
    {
      style: {
        position: 'relative',
        height: 24,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      },
    },
    createElement('div', {
      ref: trackRef,
      style: {
        ...centeredTrackStyle,
        backgroundColor: '#cbd5e1',
      },
    }),
    createElement('div', {
      style: {
        ...centeredTrackStyle,
        left: `${startPercent}%`,
        right: 'auto',
        width: `${Math.max(endPercent - startPercent, 0)}%`,
        transform: 'translateY(-50%)',
        backgroundColor: '#93c5fd',
      },
    }),
    createElement('div', {
      role: 'slider',
      'aria-label': 'Start date',
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': startValue,
      onMouseDown: (event: MouseEvent) => {
        event.preventDefault();
        setDragging('start');
      },
      onTouchStart: (event: TouchEvent) => {
        event.preventDefault();
        setDragging('start');
      },
      style: thumbStyle(startPercent, 'start'),
    }),
    createElement('div', {
      role: 'slider',
      'aria-label': 'End date',
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': endValue,
      onMouseDown: (event: MouseEvent) => {
        event.preventDefault();
        setDragging('end');
      },
      onTouchStart: (event: TouchEvent) => {
        event.preventDefault();
        setDragging('end');
      },
      style: thumbStyle(endPercent, 'end'),
    }),
  );
}

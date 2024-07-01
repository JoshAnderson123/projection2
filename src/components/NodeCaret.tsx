import { useAppSelector } from '@/state/store';
import { ARROW_WIDTH, LAYER_SPACING } from '@/utils/constants';
import { layerToPadLeft } from '@/utils/general';
import { useLayoutEffect, useRef } from 'react';

const height = 2;
const width = 2;

export default function NodeCaret() {
  const caret = useAppSelector((state) => state.caret);
  const lineRef = useRef<HTMLDivElement>(null);
  const padLeft = layerToPadLeft(caret.layer);

  useLayoutEffect(() => {
    if (lineRef.current == null) {
      return;
    }
    const xOffset = padLeft + ARROW_WIDTH / 2 - width / 2;

    const endY = Math.max(caret.yCaret, caret.yLastChild);

    lineRef.current.style.top = `${caret.yMe}px`;
    lineRef.current.style.height = `${endY - caret.yMe}px`;
    lineRef.current.style.left = `${xOffset}px`;
  });

  if (!caret.visible) {
    return null;
  }

  return (
    <>
      <div // vertical line
        ref={lineRef}
        className='absolute bg-[#00B2FF] pointer-events-none'
        style={{ width: `${width}px` }}
      ></div>
      <div // horizontal line
        className='absolute bg-[#00B2FF] pointer-events-none'
        style={{
          top: `${caret.yCaret - 0.5}px`,
          left: `${padLeft + LAYER_SPACING / 2 - 2}px`,
          height: `${height}px`,
          width: `${LAYER_SPACING / 2 + 1}px`,
        }}
      ></div>
      <svg
        width={ARROW_WIDTH}
        viewBox='0 0 18 18'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='absolute pointer-events-none'
        style={{
          top: `${caret.yCaret - ARROW_WIDTH / 2}px`,
          left: `${padLeft + LAYER_SPACING / 2 + ARROW_WIDTH / 2 + 1}px`,
        }}
      >
        <circle cx='9' cy='9' r='5' fill='#00B2FF' />
      </svg>
      {/* <svg
        width={CARET_SIZE}
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='absolute pointer-events-none'
        style={{
          top: `${caret.yCaret - CARET_SIZE / 2}px`,
          left: `${padLeft + ARROW_WIDTH / 2 - CARET_SIZE / 2}px`,
        }}
      >
        <circle cx='8' cy='8' r='8' fill='#00B2FF' />
        <rect x='3' y='7' width='10' height='2' fill='white' />
        <rect x='7' y='3' width='2' height='10' fill='white' />
      </svg> */}
    </>
  );
}

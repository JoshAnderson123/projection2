import { sh } from '@/state/shadowStore';
import {
  ARROW_WIDTH,
  DRAG_WIDTH,
  NODE_HEIGHT,
  TREE_LINE_Y_OFFSET_MAX,
  TREE_LINE_Y_OFFSET_MIN,
} from '@/utils/constants';
import { genPositionElems } from '@/utils/dataPositionModel';
import { SIDToLayers, layerToPadLeft } from '@/utils/general';
import { RowData, SID } from '@/utils/types';
import { useLayoutEffect, useRef } from 'react';

type Props = {
  row: RowData;
  sid: SID;
};

function useUpdateDimensions({ sid, row }: Props) {
  const dragRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const layer = SIDToLayers(sid);

  useLayoutEffect(() => {
    if (dragRef.current == null) {
      return;
    }

    if (!sh.positionElemsSet) {
      genPositionElems();
    }

    const meElem = sh.positionElems.get(row.me)!;
    const lastChildElem = sh.positionElems.get(row.lastChild)!;
    const lastDescendantElem = sh.positionElems.get(row.lastDescendant)!;

    const yMe = meElem.offsetTop + meElem.offsetHeight - TREE_LINE_Y_OFFSET_MIN;
    const yLastChild = lastChildElem.offsetTop + NODE_HEIGHT / 2;
    const yLastDescendant = lastDescendantElem.offsetTop + NODE_HEIGHT / 2;
    const xOffset = layerToPadLeft(layer) + ARROW_WIDTH / 2 - DRAG_WIDTH / 2;

    dragRef.current.style.top = `${yMe}px`;
    dragRef.current.style.left = `${xOffset}px`;
    dragRef.current.style.width = `${DRAG_WIDTH}px`;
    dragRef.current.style.height = `${
      yLastDescendant - yMe + TREE_LINE_Y_OFFSET_MAX
    }px`;

    if (lineRef.current == null) {
      return;
    }

    lineRef.current.style.height = `${yLastChild - yMe}px`;
  });

  return [dragRef, lineRef];
}

export default function TreeLine({ sid, row }: Props) {
  const [dragRef, lineRef] = useUpdateDimensions({ sid, row });

  return (
    <div
      ref={dragRef}
      className='flex justify-center absolute w-px drag-line cursor-pointer' // bg-green-400 bg-opacity-30
      data-vline-sid={sid}
    >
      {row.me !== row.lastDescendant && (
        <div
          ref={lineRef}
          className='absolute w-px h-full bg-zinc-600 pointer-events-none'
        ></div>
      )}
    </div>
  );
}

import { SIDToCID, getPositionElem } from '@/utils/general';
import TreeLine from './TreeLine';
import TreeNode from './TreeNode';
import { useAppSelector } from '@/state/store';
import { sh } from '@/state/shadowStore';
import { TREE_CONTAINER_ID } from '@/utils/constants';
import NodeCaret from './NodeCaret';
import { useEffect } from 'react';

export default function TreeContainer() {
  const contentModel = useAppSelector((state) => state.contentModel);
  const structureModel = useAppSelector((state) => state.structureModel);
  useAutoSelectNewInput();

  const visibleNodes = Array.from(sh.positionModel!.values());

  return (
    <div className='grow bg-zinc-900 text-gray-300 text-sm overflow-auto h-screen'>
      <div className='relative flex flex-col m-12' id={TREE_CONTAINER_ID}>
        {visibleNodes.map(({ sid, row }) => (
          <TreeNode
            key={sid}
            sid={sid}
            type={contentModel[SIDToCID(sid)].type}
            opened={structureModel[sid].opened}
            isLeaf={structureModel[sid].children.length === 0}
            row={row.me}
          />
        ))}
        {visibleNodes.map(({ sid, row }) => (
          <TreeLine key={sid} sid={sid} row={row} />
        ))}
        <NodeCaret />
      </div>
    </div>
  );
}

function useAutoSelectNewInput() {
  useEffect(() => {
    if (sh.inputFocusSid != null) {
      const row = sh.positionModel.get(sh.inputFocusSid)!.row;
      const elem = getPositionElem(row.me)!;

      const input = elem.querySelector('input')!;
      input.focus();

      const onblur = (e: FocusEvent) => {
        e.preventDefault();
        input.focus();
        input.select();
      };

      sh.inputFocusSid = null;

      input.addEventListener('blur', onblur, { once: true });
      return () => {
        input.removeEventListener('blur', onblur);
      };
    }
  });
}

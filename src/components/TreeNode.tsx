import Add from '@/assets/Add';
import Arrow from '@/assets/Arrow';
import Goal from '@/assets/Goal';
import Task from '@/assets/Task';
import { toggleOpen, updateText } from '@/state/rootSlice';
import { useAppSelector } from '@/state/store';
import {
  ARROW_WIDTH,
  LAYER_SPACING,
  NODE_HEIGHT,
  NODE_ICON_WIDTH,
} from '@/utils/constants';
import {
  SIDToCID,
  SIDToLayers as SIDToLayer,
  layerToPadLeft,
} from '@/utils/general';
import { NodeType, SID } from '@/utils/types';
import { useDispatch } from 'react-redux';

type Props = {
  sid: SID;
  row: number;
  opened: boolean;
  type: NodeType;
  isLeaf: boolean;
};

export default function TreeNode({ sid, opened, row, isLeaf, type }: Props) {
  const dispatch = useDispatch();
  const contentModel = useAppSelector((state) => state.contentModel);

  const cid = SIDToCID(sid);
  const layer = SIDToLayer(sid);
  const padLeft = layerToPadLeft(layer);

  const cursorStyle = isLeaf
    ? 'cursor-default'
    : opened
    ? 'cursor-nw-resize'
    : 'cursor-nwse-resize';

  return (
    <div
      className='w-full flex items-center select-none gap-2' // border-gray-300 border-b
      data-row={row}
      style={{
        paddingLeft: `${layerToPadLeft(layer)}px`,
        height: `${NODE_HEIGHT}px`,
      }}
    >
      {layer !== 0 && (
        <div
          className='absolute h-px bg-zinc-600'
          style={{
            left: `${padLeft - LAYER_SPACING / 2 - 1}px`,
            width: `${LAYER_SPACING / 2}px`,
          }}
        />
      )}
      <div
        className={`h-full flex items-center justify-center overflow-visible ${cursorStyle}`}
        style={{ width: `${ARROW_WIDTH}px` }}
        onClick={() => !isLeaf && dispatch(toggleOpen(sid))}
      >
        <Arrow opened={opened} isLeaf={isLeaf} />
      </div>
      <div
        className='h-full flex items-center justify-center overflow-visible'
        data-icon-sid={sid}
        style={{ width: `${NODE_ICON_WIDTH}px` }}
      >
        {type === 'goal' ? <Goal /> : <Task />}
      </div>
      <input
        type='text'
        value={contentModel[cid].title}
        className='input-reset'
        onChange={(e) => dispatch(updateText({ cid, text: e.target.value }))}
      />
      {/* <div className='flex-grow'>{contentModel[cid].title}</div> */}
    </div>
  );
}

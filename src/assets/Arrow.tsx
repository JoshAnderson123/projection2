import { ARROW_WIDTH } from '@/utils/constants';
import { SID } from '@/utils/types';

type Props = {
  opened: boolean;
  isLeaf: boolean;
};

export default function Arrow({ opened, isLeaf }: Props) {
  const d = opened ? 'M1 5L9 13L17 5' : 'M5 1L13 9L5 17';

  return (
    <svg
      width={ARROW_WIDTH}
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='absolute pointer-events-none'
    >
      {/* <path d={d} stroke='#aaaaaa' strokeWidth='4' /> */}
      {isLeaf ? (
        <circle cx='9' cy='9' r='5' fill='#aaaaaa' />
      ) : (
        <path d={d} fill='#aaaaaa' />
      )}
      {/* <circle cx='9' cy='9' r='5' fill='#aaaaaa' /> */}
    </svg>
  );
}

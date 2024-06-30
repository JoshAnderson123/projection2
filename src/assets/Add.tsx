import { ARROW_WIDTH } from '@/utils/constants';

export default function Add() {
  return (
    <svg
      width={ARROW_WIDTH}
      viewBox='0 0 18 18'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='absolute'
    >
      <path d='M0 8L17 8M8 0L8 17' stroke='#aaaaaa' strokeWidth='4' />
    </svg>
  );
}

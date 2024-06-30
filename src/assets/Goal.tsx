import { ARROW_WIDTH } from '@/utils/constants';

const color = '#2cb051';

export default function Add() {
  return (
    <svg
      width={ARROW_WIDTH + 6}
      viewBox='0 0 27 26'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='absolute'
    >
      <circle cx='12' cy='13.9035' r='10' stroke={color} strokeWidth='3' />
      <circle cx='12' cy='13.9035' r='5' stroke={color} strokeWidth='3' />
      <path
        d='M12 13.9035L19.0044 6.9035'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
      />
      <path
        d='M17.0939 6.49023L23.5842 -1.44326e-05L23.5832 2.59754L26.1803 2.59608L19.69 9.08633L17.0939 6.49023Z'
        fill={color}
      />
    </svg>
  );
}

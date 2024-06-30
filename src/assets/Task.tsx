import { ARROW_WIDTH } from '@/utils/constants';

export default function Add() {
  return (
    <svg
      width={ARROW_WIDTH + 4}
      viewBox='0 0 19 19'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='absolute'
    >
      <rect width='19' height='19' rx='4' fill='#5699FF' />
      <path
        d='M5.49713 6.59303V4.81818H13.8593V6.59303H10.7422V15H8.61432V6.59303H5.49713Z'
        fill='white'
      />
    </svg>
  );
}

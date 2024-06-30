'use client';

import TreeContainer from '@/components/TreeContainer';
import { store } from '@/state/store';
import { addEventListeners, removeEventListeners } from '@/utils/event';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

export default function Home() {
  useEffect(() => {
    addEventListeners();
    return () => {
      removeEventListeners();
    };
  });

  return (
    <Provider store={store}>
      <main className='flex w-screen h-screen'>
        <div className='grow-0 h-full w-[240px] bg-zinc-800 border-r border-zinc-700'></div>
        <TreeContainer />
      </main>
    </Provider>
  );
}

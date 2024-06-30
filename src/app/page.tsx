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
      <main className='w-screen h-screen bg-gray-900'>
        <TreeContainer />
      </main>
    </Provider>
  );
}

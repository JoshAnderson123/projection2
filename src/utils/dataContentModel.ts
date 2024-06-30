import { ContentModel } from './types';

export const dataContentModel: ContentModel = {
  1: {
    cid: '1',
    children: ['2', '3'],
    title: 'Ensure E2E tests prevent bugs / SEVs',
    type: 'goal',
  },
  2: {
    cid: '2',
    title: 'P0 E2E Test %Push Blocking => 100%',
    type: 'goal',
    children: ['4', '5'],
  },
  3: {
    cid: '3',
    title: 'P0 E2E Test %Reliability => 80%',
    type: 'goal',
    children: ['5', '9'],
  },
  4: {
    cid: '4',
    title: 'Reduce % slow',
    type: 'task',
    children: [], // remove 5
  },
  5: {
    cid: '5',
    title: 'Reduce % flaky',
    type: 'task',
    children: ['6'],
  },
  6: {
    cid: '6',
    title: 'Fix top 10 root causes',
    type: 'task',
    children: ['7', '12', '13'],
  },
  7: {
    cid: '7',
    title: 'Identify top root causes',
    type: 'task',
    children: ['8'],
  },
  8: {
    cid: '8',
    title: 'Create query to identify root causes',
    type: 'task',
    children: [],
  },
  9: {
    cid: '9',
    title: 'Improve test maintainability',
    type: 'task',
    children: ['10', '11'], // remove 5
  },
  10: {
    cid: '10',
    title: 'Improve ops',
    type: 'task',
    children: [],
  },
  11: {
    cid: '11',
    title: 'Reduce number of tests',
    type: 'task',
    children: [],
  },
  12: {
    cid: '12',
    title: 'Root cause initial investigation',
    type: 'task',
    children: [],
  },
  13: {
    cid: '13',
    title: 'Fix root causes based on initial investigation',
    type: 'task',
    children: [],
  },
};

export const rootId = dataContentModel['1'].cid;

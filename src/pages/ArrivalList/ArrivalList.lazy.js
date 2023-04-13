import React, { lazy, Suspense } from 'react';

const LazyArrivalList = lazy(() => import('./ArrivalList'));

const ArrivalList = props => (
  <Suspense fallback={null}>
    <LazyArrivalList {...props} />
  </Suspense>
);

export default ArrivalList;

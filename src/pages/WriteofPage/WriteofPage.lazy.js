import React, { lazy, Suspense } from 'react';

const LazyWriteofPage = lazy(() => import('./WriteofPage'));

const WriteofPage = props => (
  <Suspense fallback={null}>
    <LazyWriteofPage {...props} />
  </Suspense>
);

export default WriteofPage;

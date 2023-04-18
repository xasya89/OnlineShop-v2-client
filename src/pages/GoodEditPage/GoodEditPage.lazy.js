import React, { lazy, Suspense } from 'react';

const LazyGoodEditPage = lazy(() => import('./GoodEditPage'));

const GoodEditPage = props => (
  <Suspense fallback={null}>
    <LazyGoodEditPage {...props} />
  </Suspense>
);

export default GoodEditPage;

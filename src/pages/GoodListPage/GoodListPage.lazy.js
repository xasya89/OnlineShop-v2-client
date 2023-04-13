import React, { lazy, Suspense } from 'react';

const LazyGoodListPage = lazy(() => import('./GoodListPage'));

const GoodListPage = props => (
  <Suspense fallback={null}>
    <LazyGoodListPage {...props} />
  </Suspense>
);

export default GoodListPage;

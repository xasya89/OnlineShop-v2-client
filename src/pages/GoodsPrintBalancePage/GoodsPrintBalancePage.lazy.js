import React, { lazy, Suspense } from 'react';

const LazyGoodsPrintBalancePage = lazy(() => import('./GoodsPrintBalancePage'));

const GoodsPrintBalancePage = props => (
  <Suspense fallback={null}>
    <LazyGoodsPrintBalancePage {...props} />
  </Suspense>
);

export default GoodsPrintBalancePage;

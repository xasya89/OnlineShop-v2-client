import React, { lazy, Suspense } from 'react';

const LazyGoodsPrintPriceTags = lazy(() => import('./GoodsPrintPriceTags'));

const GoodsPrintPriceTags = props => (
  <Suspense fallback={null}>
    <LazyGoodsPrintPriceTags {...props} />
  </Suspense>
);

export default GoodsPrintPriceTags;

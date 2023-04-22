import React, { lazy, Suspense } from 'react';

const LazyMainPage = lazy(() => import('./MainPage'));

const MainPage = props => (
  <Suspense fallback={null}>
    <LazyMainPage {...props} />
  </Suspense>
);

export default MainPage;

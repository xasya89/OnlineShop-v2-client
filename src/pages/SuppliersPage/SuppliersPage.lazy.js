import React, { lazy, Suspense } from 'react';

const LazySuppliersPage = lazy(() => import('./SuppliersPage'));

const SuppliersPage = props => (
  <Suspense fallback={null}>
    <LazySuppliersPage {...props} />
  </Suspense>
);

export default SuppliersPage;

import React, { lazy, Suspense } from 'react';

const LazyShiftListReportPage = lazy(() => import('./ShiftListReportPage'));

const ShiftListReportPage = props => (
  <Suspense fallback={null}>
    <LazyShiftListReportPage {...props} />
  </Suspense>
);

export default ShiftListReportPage;

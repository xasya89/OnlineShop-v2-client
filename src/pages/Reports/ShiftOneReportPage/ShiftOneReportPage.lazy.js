import React, { lazy, Suspense } from 'react';

const LazyShiftOneReportPage = lazy(() => import('./ShiftOneReportPage'));

const ShiftOneReportPage = props => (
  <Suspense fallback={null}>
    <LazyShiftOneReportPage {...props} />
  </Suspense>
);

export default ShiftOneReportPage;

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ShiftOneReportPage from './ShiftOneReportPage';

describe('<ShiftOneReportPage />', () => {
  test('it should mount', () => {
    render(<ShiftOneReportPage />);
    
    const shiftOneReportPage = screen.getByTestId('ShiftOneReportPage');

    expect(shiftOneReportPage).toBeInTheDocument();
  });
});
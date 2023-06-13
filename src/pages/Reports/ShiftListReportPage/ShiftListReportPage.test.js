import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ShiftListReportPage from './ShiftListReportPage';

describe('<ShiftListReportPage />', () => {
  test('it should mount', () => {
    render(<ShiftListReportPage />);
    
    const shiftListReportPage = screen.getByTestId('ShiftListReportPage');

    expect(shiftListReportPage).toBeInTheDocument();
  });
});
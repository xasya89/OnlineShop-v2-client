import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReportsMoneyReport from './ReportsMoneyReport';

describe('<ReportsMoneyReport />', () => {
  test('it should mount', () => {
    render(<ReportsMoneyReport />);
    
    const reportsMoneyReport = screen.getByTestId('ReportsMoneyReport');

    expect(reportsMoneyReport).toBeInTheDocument();
  });
});
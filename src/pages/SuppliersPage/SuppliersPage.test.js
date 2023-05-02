import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SuppliersPage from './SuppliersPage';

describe('<SuppliersPage />', () => {
  test('it should mount', () => {
    render(<SuppliersPage />);
    
    const suppliersPage = screen.getByTestId('SuppliersPage');

    expect(suppliersPage).toBeInTheDocument();
  });
});
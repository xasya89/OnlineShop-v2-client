import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GoodListPage from './GoodListPage';

describe('<GoodListPage />', () => {
  test('it should mount', () => {
    render(<GoodListPage />);
    
    const goodListPage = screen.getByTestId('GoodListPage');

    expect(goodListPage).toBeInTheDocument();
  });
});
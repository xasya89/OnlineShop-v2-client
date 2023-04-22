import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GoodsPrintBalancePage from './GoodsPrintBalancePage';

describe('<GoodsPrintBalancePage />', () => {
  test('it should mount', () => {
    render(<GoodsPrintBalancePage />);
    
    const goodsPrintBalancePage = screen.getByTestId('GoodsPrintBalancePage');

    expect(goodsPrintBalancePage).toBeInTheDocument();
  });
});
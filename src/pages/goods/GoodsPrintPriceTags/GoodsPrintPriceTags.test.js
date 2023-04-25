import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GoodsPrintPriceTags from './GoodsPrintPriceTags';

describe('<GoodsPrintPriceTags />', () => {
  test('it should mount', () => {
    render(<GoodsPrintPriceTags />);
    
    const goodsPrintPriceTags = screen.getByTestId('GoodsPrintPriceTags');

    expect(goodsPrintPriceTags).toBeInTheDocument();
  });
});
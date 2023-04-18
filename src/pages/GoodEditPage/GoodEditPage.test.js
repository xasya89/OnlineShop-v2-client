import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GoodEditPage from './GoodEditPage';

describe('<GoodEditPage />', () => {
  test('it should mount', () => {
    render(<GoodEditPage />);
    
    const goodEditPage = screen.getByTestId('GoodEditPage');

    expect(goodEditPage).toBeInTheDocument();
  });
});
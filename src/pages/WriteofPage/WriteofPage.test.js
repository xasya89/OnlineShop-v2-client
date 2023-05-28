import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WriteofPage from './WriteofPage';

describe('<WriteofPage />', () => {
  test('it should mount', () => {
    render(<WriteofPage />);
    
    const writeofPage = screen.getByTestId('WriteofPage');

    expect(writeofPage).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ArrivalList from './ArrivalList';

describe('<ArrivalList />', () => {
  test('it should mount', () => {
    render(<ArrivalList />);
    
    const arrivalList = screen.getByTestId('ArrivalList');

    expect(arrivalList).toBeInTheDocument();
  });
});
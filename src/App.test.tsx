import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders headers link', () => {
  const { getByText } = render(<App />);

  const createUser = getByText(/Create user/i);
  expect(createUser).toBeInTheDocument();

  const users = getByText(/Users/i);
  expect(users).toBeInTheDocument();

  const todos = getByText(/Todos/i);
  expect(todos).toBeInTheDocument();
});

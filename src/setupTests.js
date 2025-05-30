import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { db } from './App';
import { collection, getDocs, addDoc } from 'firebase/firestore';

// Mock Firestore functions
jest.mock('firebase/firestore', () => {
  const originalModule = jest.requireActual('firebase/firestore');
  return {
    ...originalModule,
    getDocs: jest.fn(),
    addDoc: jest.fn(),
    collection: jest.fn(() => 'mocked-collection'),
  };
});

describe('Reminder App', () => {

  beforeEach(() => {
    getDocs.mockResolvedValue({
      docs: [
        {
          id: '1',
          data: () => ({
            type: 'email',
            to: 'test@example.com',
            message: 'Test reminder message',
            datetime: '2025-05-29T12:00:00',
          }),
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Test Case 1: Schedule Reminder Successfully', async () => {
    addDoc.mockResolvedValue({ id: '2' });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Recipient'), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByPlaceholderText('Message'), {
      target: { value: 'This is a test reminder' },
    });

    fireEvent.change(screen.getByDisplayValue(''), {
      target: { value: '2025-05-29T12:00' },
    });

    fireEvent.click(screen.getByText('Set Reminder'));

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Reminder scheduled successfully')).toBeInTheDocument();
    });
  });

  test('Test Case 2: Input Validation (check empty fields)', async () => {
    render(<App />);

    // Leave recipient blank
    fireEvent.change(screen.getByPlaceholderText('Message'), {
      target: { value: 'This is a test reminder' },
    });

    fireEvent.change(screen.getByDisplayValue(''), {
      target: { value: '2025-06-01T14:00' },
    });

    fireEvent.click(screen.getByText('Set Reminder'));

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
    });

    expect(addDoc).not.toHaveBeenCalled();
  });

  test('Test Case 3: Fetch and Display Reminders', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Test reminder message')).toBeInTheDocument();
      expect(screen.getByText(/Scheduled For:/)).toBeInTheDocument();
    });
  });
});

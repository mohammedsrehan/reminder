// ReminderApp.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

// Mock Firestore
jest.mock('firebase/firestore', () => {
  let mockData = [];

  return {
    getFirestore: jest.fn(),
    collection: jest.fn(() => 'reminders'),
    addDoc: jest.fn(async (_collection, data) => {
      mockData.push({ ...data });
      return { id: 'mock-id' };
    }),
    getDocs: jest.fn(async () => ({
      docs: mockData.map((doc, i) => ({
        id: `mock-id-${i}`,
        data: () => doc,
      }))
    })),
    serverTimestamp: jest.fn(() => 'mock-timestamp'),
  };
});

describe('Reminder App Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Test Case 1: Schedule Reminder Successfully', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/Recipient/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Message/i), {
      target: { value: 'This is a test reminder' },
    });
    fireEvent.change(screen.getByDisplayValue(''), {
      target: { value: '2025-05-29T10:00' },
    });
    fireEvent.click(screen.getByLabelText(/Email/i));
    fireEvent.click(screen.getByText(/Set Reminder/i));

    await waitFor(() => {
      expect(screen.getByText(/Reminder scheduled successfully/i)).toBeInTheDocument();
    });
  });

  test('Test Case 2: Input Validation (Empty "To")', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/Recipient/i), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Message/i), {
      target: { value: 'This is a test reminder' },
    });
    fireEvent.change(screen.getByDisplayValue(''), {
      target: { value: '2025-06-01T14:00' },
    });
    fireEvent.click(screen.getByLabelText(/Email/i));
    fireEvent.click(screen.getByText(/Set Reminder/i));

    await waitFor(() => {
      expect(screen.queryByText(/Reminder scheduled successfully/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Failed to schedule reminder/i)).toBeInTheDocument();
    });
  });

  test('Test Case 3: Fetch and Display Reminders', async () => {
    // Add a mock reminder to be fetched
    const { getDocs } = require('firebase/firestore');
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: '1',
          data: () => ({
            to: 'fetch@example.com',
            message: 'Reminder from DB',
            datetime: '2025-06-01T14:00',
            type: 'email',
          }),
        },
      ],
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Scheduled Reminders/i)).toBeInTheDocument();
      expect(screen.getByText(/fetch@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/Reminder from DB/i)).toBeInTheDocument();
      expect(screen.getByText(/Email/i)).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { getFirestore, connectFirestoreEmulator, collection, deleteDoc, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080);

const clearReminders = async () => {
  const snapshot = await getDocs(collection(db, 'reminders'));
  const deletes = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletes);
};

beforeEach(async () => {
  await clearReminders();
});

afterEach(async () => {
  await clearReminders();
});

describe('Reminder App (Emulator Test)', () => {
  test('Schedules reminder successfully', async () => {
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
      expect(screen.getByText('Reminder scheduled successfully')).toBeInTheDocument();
    });
  });

  test('Blocks empty fields', async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Message'), {
      target: { value: 'Only message' },
    });

    fireEvent.change(screen.getByDisplayValue(''), {
      target: { value: '2025-05-29T12:00' },
    });

    fireEvent.click(screen.getByText('Set Reminder'));

    await waitFor(() => {
      expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
    });
  });

  test('Fetches and displays existing reminders', async () => {
    // Insert a test reminder into Firestore
    const remindersRef = collection(db, 'reminders');
    await import('firebase/firestore').then(({ addDoc }) =>
      addDoc(remindersRef, {
        type: 'email',
        to: 'fetchtest@example.com',
        message: 'Hello from Firestore',
        datetime: '2025-06-01T12:00',
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('fetchtest@example.com')).toBeInTheDocument();
      expect(screen.getByText('Hello from Firestore')).toBeInTheDocument();
    });
  });
});

import React, { useState, useEffect } from 'react';
import './App.css';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCcJLhCtbdZmyyDkh49tgTyHFiii6MKAnA",
  authDomain: "reminder-f3bb2.firebaseapp.com",
  projectId: "reminder-f3bb2",
  storageBucket: "reminder-f3bb2.firebasestorage.app",
  messagingSenderId: "736106555815",
  appId: "1:736106555815:web:b19905d60c4286654f2e82",
  measurementId: "G-7B7XME3BY3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db}

function App() {
  const [type, setType] = useState('email');
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [datetime, setDatetime] = useState('');
  const [status, setStatus] = useState(null);
  const [reminders, setReminders] = useState([]);

  const fetchReminders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reminders"));
      const data = querySnapshot.docs.map(doc => ({
         id: doc.id,
      ...doc.data(),
      }));
      setReminders(data);
    } catch (err) {
      console.error('Error fetching reminders', err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const sendReminder = async () => {
    try {
      await addDoc(collection(db, "reminders"), {
        type,
        to,
        message,
        datetime,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      fetchReminders();
    } catch (err) {
      console.log('Error sending reminder', err);
      setStatus('error');
    }
  };

  return (
    <div>

    <div className="container">
      <h1>Schedule Reminder</h1>

      <input
        type="text"
        placeholder="Recipient"
        className="input"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <textarea
        placeholder="Message"
        className="textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        type="datetime-local"
        className="input"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
      />

      <div className="radio-group">
        <label>
          <input
            type="radio"
            value="email"
            checked={type === 'email'}
            onChange={() => setType('email')}
          />
          Email
        </label>
        <label>
          <input
            type="radio"
            value="sms"
            checked={type === 'sms'}
            onChange={() => setType('sms')}
          />
          SMS
        </label>
      </div>

      <button onClick={sendReminder} className="button">Set Reminder</button>

      {status === 'success' && <p className="success">Reminder scheduled successfully</p>}
      {status === 'error' && <p className="error">Failed to schedule reminder</p>}
      </div>
    <div className="container">

      <h2>Scheduled Reminders</h2>
      <div className="dashboard">
        {reminders.map((reminder, index) => (
          <div key={index} className="reminder-card">
            <p><strong>To:</strong> {reminder.to}</p>
            <p><strong>Type:</strong> {reminder.type}</p>
            <p><strong>Message:</strong> {reminder.message}</p>
            <p><strong>Scheduled For:</strong> {new Date(reminder.datetime).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
    </div>

  );
}

export default App;
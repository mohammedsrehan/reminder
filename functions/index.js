import {onSchedule} from 'firebase-functions/v2/scheduler';
import {initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import nodemailer from 'nodemailer';

initializeApp();
const db = getFirestore();

// Set up your email transport (Gmail example — use environment variables in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_EMAIL@gmail.com',
    pass: 'YOUR_APP_PASSWORD'
  }
});

// Runs every minute and checks for reminders due in the next minute
export const sendScheduledReminders = onSchedule(
  {
    schedule: '* * * * *',
    timeZone: 'UTC'
  },
  async () => {
    const now = new Date();
    const nextMinute = new Date(now.getTime() + 60000);

    const snapshot = await db.collection('reminders')
      .where('datetime', '>=', now.toISOString())
      .where('datetime', '<', nextMinute.toISOString())
      .get();

    const promises = [];

    snapshot.forEach(doc => {
      const reminder = doc.data();

      if (reminder.type === 'email') {
        const mailOptions = {
          from: 'YOUR_EMAIL@gmail.com',
          to: reminder.to,
          subject: 'Reminder Notification',
          text: reminder.message
        };
        promises.push(transporter.sendMail(mailOptions));
      }

      // Add SMS support here if needed
    });

    await Promise.all(promises);
    console.log(`Processed ${promises.length} reminders`);
  }
);

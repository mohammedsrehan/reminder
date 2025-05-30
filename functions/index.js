import {initializeApp} from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";
import {onSchedule} from 'firebase-functions/v2/scheduler';
import nodemailer from 'nodemailer';

initializeApp();
const db = getFirestore();

// Set up your email transport (Gmail example — use environment variables in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'replace with your email address',
    pass: 'replace with your password',
  }
});

// Runs every minute and checks for reminders due in the next minute
export const sendScheduledReminders = onSchedule(
  {
    schedule: 'every 1 minutes',
    timeZone: 'UTC'
  },
  async () => {
    console.log('Checking for scheduled reminders...');
    const now = new Date();
    const nextMinute = new Date(now.getTime() + 60000);

    const snapshot = await db.collection('reminders')
      .where('datetime', '>=', now.toISOString())
      .where('datetime', '<', nextMinute.toISOString())
      .get();

    const promises = [];
    console.log('Found reminders:', snapshot.docs.length);
    snapshot.forEach(doc => {
      const reminder = doc.data();
      console.log('Processing reminder:', reminder);

      if (reminder.type === 'email') {
        const mailOptions = {
          from: 'replace with your email address',
          to: reminder.to,
          subject: 'Reminder Notification',
          text: reminder.message
        };
        console.log('Sending email reminder to:', reminder.to);
        promises.push(transporter.sendMail(mailOptions));
      }

      // Add SMS support here if needed
    });

    await Promise.all(promises);
    console.log(`Processed ${promises.length} reminders`);
  }
);
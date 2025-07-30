# 📅 Reminder Web Application – Email Notification Scheduler

A lightweight, web-based reminder scheduling tool built to help users manage tasks and deadlines via **email notifications**. Designed for busy individuals and remote teams.

---

## 🚀 Overview

Users often forget important tasks, meetings, or deadlines. This project solves that by allowing users to:

- Schedule reminders via email
- View upcoming tasks in a dashboard
- Get confirmation of successful scheduling

---

## 🔧 Features

- ✅ Schedule email reminders with date and time
- 🧾 View scheduled reminders on a dashboard
- 🛑 Form validation with error messages
- 🧠 Firebase Firestore integration
- ⚙️ Cloud Functions (via Firebase emulator)
- 🧪 Automated tests with Jest

---

## 🛠️ Tech Stack

| Layer        | Technology                      |
|--------------|----------------------------------|
| Frontend     | React                            |
| Backend      | Firebase Cloud Functions (Local) |
| Database     | Firestore (NoSQL)                |
| Hosting      | Firebase + GitHub CI/CD          |
| Testing      | Jest, React Testing Library      |

---

## 🧪 Testing (Automated)

- **✅ Schedule Reminder**: Adds entry to Firestore
- **⚠️ Input Validation**: Prevents incomplete submissions
- **📋 Display Reminders**: Loads reminders from DB

---

## 📕 Lessons Learned

- Emulating Firebase functions locally for dev/testing
- Trade-offs of using cloud functions vs full-stack backend
- Efficient state management and UI validation in React

---

## ⚠️ Challenges & Workarounds

- Couldn’t deploy to Firebase Functions due to billing → used local emulator
- Switched from MERN to Firebase for faster development
- Encountered timeouts while testing against remote DB → solved by local emulator setup

---

## 📌 Improvements for Future

- Add SMS reminder support
- Allow update/delete of existing reminders
- Use scheduled triggers instead of interval polling (for cost efficiency)

---

## 🔗 Links

- **GitHub Repo**: [https://github.com/mohammedsrehan/reminder](#)

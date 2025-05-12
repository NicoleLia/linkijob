# LinkedIn Scraper

This project is a LinkedIn data scraper. It consists of a **backend** built with **Express** and **Puppeteer**, and a **frontend** built with **React** and **Material UI (MUI)**.

## Prerequisites

- Node.js >= 18
- A LinkedIn account
- A method to extract your LinkedIn cookies (recommended: use the **EditThisCookie** browser extension)

---

## Backend Setup

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Replace `cookie.json`

Create a file named `cookie.json` in the backend folder. To get the content:

- Open [https://www.linkedin.com](https://www.linkedin.com)
- Log in
- Right-click the page → Inspect → Go to **Application** tab → **Cookies**
- Use **EditThisCookie** to export cookies from `https://www.linkedin.com`
- Paste them into `cookie.json`

> This is required for Puppeteer to bypass login.

### 4. Start the backend server

```bash
node server.js
```

---

## Frontend Setup

### 1. Navigate to the frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The frontend should now be running at `http://localhost:5173` (default Vite port).

---

## Notes

- Make sure the backend is running before using the frontend.
- This project is for educational or internal use only. Scraping LinkedIn may violate their Terms of Service.

> This project was set up and tested for experimental and testing purposes only. I do not take responsibility for its development, maintenance, or any potential misuse. Use responsibly and ensure compliance with LinkedIn's Terms of Service.

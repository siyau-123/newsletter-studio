# Newsletter Studio — How to Run

## Requirements
- [Node.js](https://nodejs.org) (version 14 or higher)

## Start the app

Open a Terminal, navigate to this folder, then run:

```bash
node server.js
```

Then open your browser to: **http://localhost:3000**

## Stop the app

Press `Ctrl + C` in the terminal.

## How it works

- Newsletters are saved to `newsletters.json` in this folder
- Each newsletter gets a short unique link like `http://localhost:3000/n/a3f91c2b`
- Share that link with friends — they see a clean reading view
- If you're running this on a server with a public domain, replace `localhost:3000` with your domain

## Files

```
newsletter-studio/
├── server.js          ← The backend (no npm install needed)
├── package.json
├── newsletters.json   ← Auto-created; stores all newsletters
└── public/
    ├── index.html     ← The builder app
    └── view.html      ← The reader view (shared links)
```

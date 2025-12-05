# FutureNet Pitch Deck

This guide explains how to edit, run, export, and print the FutureNet pitch deck. It is written for non‑technical users.

## 1. One‑time setup: install the tools

You need two things on your computer:

- **Node.js** (includes **npm**)  
  - If you don’t have it yet, go to <https://nodejs.org>, download the **LTS** version, and install it.
- This project folder (for example `futurenet-demo`) on your computer.

## 2. One‑time setup: install the project dependencies

Do this **once** after you download or clone the project.

1. Open a **Terminal** / **Command Prompt** window.
2. Go to the project folder (for example `futurenet-demo`).
3. Run this command and wait until it finishes:

   ```bash
   npm install
   ```

This downloads everything the project (and pitch deck) needs to run.

## 3. How to open and edit the pitch deck slides

The pitch deck content is in a simple text file using Markdown:

- File: `presentations/futurenet-pitch/slides.md`

You can edit this file with **any text editor**, for example:

- Notepad (Windows)
- VS Code
- TextEdit (macOS, in plain text mode)

Basic rules:

- Lines starting with `#` are **slide titles**.
- Lines starting with `##` are **subtitles** or section titles.
- A line containing only `---` creates a **new slide**.

You can safely change the text and add/remove slides by editing this file.

After you save changes to `slides.md`, go back to the browser and **refresh the page** to see your updates. If the changes don’t appear, use a **hard refresh**:

- Windows: `Ctrl + Shift + R` (or `Ctrl + F5`)
- Mac: `Cmd + Shift + R`

## 4. How to run the pitch deck in your browser

Every time you want to **present** or **preview** the deck:

1. Open a **Terminal / Command Prompt**.
2. Make sure you are inside the project folder (for example `futurenet-demo`).
3. Run this command:

   ```bash
   npm run pitch
   ```

4. After a few seconds, your default web browser should open automatically.  
   - If it doesn’t, open a browser yourself and go to the link shown in the Terminal (usually something like `http://127.0.0.1:8080`).

You should now see the **FutureNet Pitch Deck**. Use the arrow keys on your keyboard to move between slides.

## 5. How to export the deck as a PDF

1. Make sure the deck is running in your browser (follow step 4 above first).
2. In the top‑right corner of the deck, click the button **“Export as PDF”**.
3. A new browser tab will open with a print‑friendly version of the slides.
4. Open the browser’s **Print** dialog:
   - On Windows: press `Ctrl + P`
   - On Mac: press `Cmd + P`
5. In the Print dialog:
   - Change **Destination / Printer** to **“Save as PDF”**.
   - Choose **Landscape** orientation (recommended).
   - Turn off page headers/footers if your browser shows them.
6. Click **Save**, choose a filename and location.  
   You now have a **PDF version** of the pitch deck.

## 6. How to print the pitch deck on paper

Once you have exported the PDF (step 5):

1. Open the PDF file.
2. Click **Print** (or press `Ctrl + P` / `Cmd + P`).
3. Select your physical printer.
4. Choose **Landscape** orientation.
5. Print.

If you ever get stuck, you can:

- Re‑run `npm run pitch` and try again.
- Double‑check that you ran `npm install` at least once before trying to run the pitch.

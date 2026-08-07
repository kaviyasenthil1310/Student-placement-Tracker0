© 2026 Kaviya Senthil. All Rights Reserved.

This project and its source code are the intellectual property of Kaviya Senthil.
No part of this project may be copied, modified, or distributed without prior written permission.

# Student Placement Tracker (Web)

A simple frontend web application to track student placement status using HTML, CSS, and JavaScript. It is designed for college placement cells to quickly view students, companies, and placement status on a clean dashboard. [69][74]

## Features

- Display students with roll number, department, CGPA, placement status, and company.
- Display companies with role, package (LPA), and eligibility CGPA.
- Filter students by department (CSE, IT, ECE) and placement status (Placed / Not Placed).
- Toggle student status between "Placed" and "Not Placed" with one click.
- Responsive layout suitable for desktop and tablet screens. [69][74]

## Tech Stack

- HTML
- CSS
- JavaScript (no framework, runs completely in the browser) [13][78]

## Project Structure

```text
student-placement-tracker-web/
├── index.html      # Main page layout
├── style.css       # Styles and responsive UI
├── script.js       # Data and interaction logic
└── README.md       # Project documentation
```

## How to Run

1. Clone or download this project:
   - If using Git:
     ```bash
     git clone https://github.com/<your-username>/student-placement-tracker-web.git
     cd student-placement-tracker-web
     ```
2. Option A – Open directly:
   - Double-click `index.html` to open it in your browser (Chrome / Edge).
3. Option B – Use VS Code Live Server (recommended):
   - Open the folder in VS Code.
   - Install the **Live Server** extension.
   - Right-click `index.html` → **Open with Live Server**.
   - The app will open at a URL like `http://127.0.0.1:5500/index.html`. [27][34]

## Usage

- Use the **Filters** section to select a department and placement status, then click **Apply Filter**.
- Use the **Action** buttons in the Students table to mark a student as *Placed* or *Not Placed*.
- The dashboard cards automatically update counts for total students, placed students, and total companies. [69][74]

## Intended Users

- Final-year students showcasing web development and UI/UX skills.
- College Training & Placement Officers needing a simple, visual tracker.
- Recruiters viewing basic placement statistics in a demo environment. [73][75]

## Future Enhancements

- Persist data using a backend (Python/Flask or Node.js) and database (SQLite/PostgreSQL).
- Add authentication for TPO and student login.
- Add charts for department-wise placements and company-wise selections.
- Export placed students list as CSV for reporting. [71][73]

## Author

- **Kaviya** 

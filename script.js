// Sample data: you can later load this from JSON or API.
const companies = [
  { id: 1, name: "TCS", role: "Software Engineer", package: 3.6, eligibilityCgpa: 7.0 },
  { id: 2, name: "Infosys", role: "System Engineer", package: 4.0, eligibilityCgpa: 7.5 },
  { id: 3, name: "Zoho", role: "Developer", package: 5.5, eligibilityCgpa: 8.0 }
];

let students = [
  { id: 1, rollNo: "CSE001", name: "Kaviya", department: "CSE", cgpa: 8.4, status: "Placed", companyId: 3 },
  { id: 2, rollNo: "CSE002", name: "Arun", department: "CSE", cgpa: 7.2, status: "Not Placed", companyId: null },
  { id: 3, rollNo: "IT001", name: "Priya", department: "IT", cgpa: 8.0, status: "Placed", companyId: 1 },
  { id: 4, rollNo: "ECE001", name: "Rahul", department: "ECE", cgpa: 7.0, status: "Not Placed", companyId: null }
];

const deptFilter = document.getElementById("deptFilter");
const statusFilter = document.getElementById("statusFilter");
const applyFilterBtn = document.getElementById("applyFilterBtn");

const totalStudentsEl = document.getElementById("totalStudents");
const placedStudentsEl = document.getElementById("placedStudents");
const totalCompaniesEl = document.getElementById("totalCompanies");

const studentsTableBody = document.getElementById("studentsTableBody");
const companiesTableBody = document.getElementById("companiesTableBody");

// Helper to get company name by id
function getCompanyName(id) {
  const company = companies.find(c => c.id === id);
  return company ? company.name : "-";
}

function renderStats() {
  totalStudentsEl.textContent = students.length;
  placedStudentsEl.textContent = students.filter(s => s.status === "Placed").length;
  totalCompaniesEl.textContent = companies.length;
}

function renderCompanies() {
  companiesTableBody.innerHTML = "";
  companies.forEach(company => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${company.name}</td>
      <td>${company.role}</td>
      <td>${company.package.toFixed(1)}</td>
      <td>${company.eligibilityCgpa.toFixed(1)}</td>
    `;
    companiesTableBody.appendChild(tr);
  });
}

function renderStudents() {
  studentsTableBody.innerHTML = "";

  const deptValue = deptFilter.value;
  const statusValue = statusFilter.value;

  students
    .filter(student => {
      let ok = true;
      if (deptValue !== "all") {
        ok = ok && student.department === deptValue;
      }
      if (statusValue !== "all") {
        ok = ok && student.status === statusValue;
      }
      return ok;
    })
    .forEach(student => {
      const tr = document.createElement("tr");

      const statusClass = student.status === "Placed" ? "status-placed" : "status-not-placed";
      const companyName = getCompanyName(student.companyId);

      tr.innerHTML = `
        <td>${student.rollNo}</td>
        <td>${student.name}</td>
        <td>${student.department}</td>
        <td>${student.cgpa.toFixed(1)}</td>
        <td>
          <span class="status-pill ${statusClass}">
            ${student.status}
          </span>
        </td>
        <td>${companyName}</td>
        <td>
          ${
            student.status === "Placed"
              ? `<button class="action-btn action-unplace" data-id="${student.id}">Mark Not Placed</button>`
              : `<button class="action-btn action-place" data-id="${student.id}">Mark Placed</button>`
          }
        </td>
      `;

      studentsTableBody.appendChild(tr);
    });

  // Attach click handlers to action buttons
  document.querySelectorAll(".action-place").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      placeStudent(id);
    });
  });

  document.querySelectorAll(".action-unplace").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      unplaceStudent(id);
    });
  });
}

function placeStudent(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  // Simple logic: assign first company that matches eligibility
  const eligibleCompany = companies.find(c => student.cgpa >= c.eligibilityCgpa);
  if (eligibleCompany) {
    student.status = "Placed";
    student.companyId = eligibleCompany.id;
    alert(`${student.name} placed at ${eligibleCompany.name}`);
  } else {
    alert(`${student.name} is not eligible for any listed company.`);
  }

  renderStats();
  renderStudents();
}

function unplaceStudent(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  student.status = "Not Placed";
  student.companyId = null;
  renderStats();
  renderStudents();
}

applyFilterBtn.addEventListener("click", () => {
  renderStudents();
});

// Initial render
renderStats();
renderCompanies();
renderStudents();
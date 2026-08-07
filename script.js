const STORAGE_KEY = "placement-tracker-data";
const companies = [];
let students = [];

const deptFilter = document.getElementById("deptFilter");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const applyFilterBtn = document.getElementById("applyFilterBtn");
const reportCompanyFilter = document.getElementById("reportCompanyFilter");
const reportOutput = document.getElementById("reportOutput");

const totalStudentsEl = document.getElementById("totalStudents");
const placedStudentsEl = document.getElementById("placedStudents");
const totalCompaniesEl = document.getElementById("totalCompanies");
const openPositionsEl = document.getElementById("openPositions");

const studentsTableBody = document.getElementById("studentsTableBody");
const companiesTableBody = document.getElementById("companiesTableBody");
const studentForm = document.getElementById("studentForm");
const rollNoInput = document.getElementById("rollNo");
const studentNameInput = document.getElementById("studentName");
const studentEmailInput = document.getElementById("studentEmail");
const studentDepartmentInput = document.getElementById("studentDepartment");
const studentCgpaInput = document.getElementById("studentCgpa");
const studentSkillsInput = document.getElementById("studentSkills");
const studentStatusInput = document.getElementById("studentStatus");
const studentCompanyInput = document.getElementById("studentCompanyId");
const companyForm = document.getElementById("companyForm");
const companyNameInput = document.getElementById("companyName");
const companyRoleInput = document.getElementById("companyRole");
const companyPackageInput = document.getElementById("companyPackage");
const companyRequirementsInput = document.getElementById("companyRequirements");
const companyDepartmentInput = document.getElementById("companyDepartment");
const companyOpeningsInput = document.getElementById("companyOpenings");

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ students, companies }));
}

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);
    if (parsed.students) students = parsed.students;
    if (parsed.companies) companies.splice(0, companies.length, ...parsed.companies);
  } catch (error) {
    console.error("Failed to load placement data", error);
  }
}

function getCompanyName(id) {
  const company = companies.find(c => c.id === id);
  return company ? company.name : "-";
}

function renderStats() {
  totalStudentsEl.textContent = students.length;
  placedStudentsEl.textContent = students.filter(s => s.status === "Placed").length;
  totalCompaniesEl.textContent = companies.length;
  openPositionsEl.textContent = companies.reduce((sum, company) => sum + company.openings, 0);
}

function renderReport() {
  if (!reportCompanyFilter || !reportOutput) return;

  reportCompanyFilter.innerHTML = '<option value="">Select Company</option>';
  companies.forEach(company => {
    const option = document.createElement("option");
    option.value = company.id;
    option.textContent = company.name;
    reportCompanyFilter.appendChild(option);
  });

  const selectedCompanyId = Number(reportCompanyFilter.value);
  if (!selectedCompanyId) {
    reportOutput.innerHTML = "<p>Select a company to view its candidate report.</p>";
    return;
  }

  const company = companies.find(c => c.id === selectedCompanyId);
  const matchedStudents = students.filter(student => student.companyId === selectedCompanyId);

  if (!company || matchedStudents.length === 0) {
    reportOutput.innerHTML = "<p>No students linked to this company yet.</p>";
    return;
  }

  reportOutput.innerHTML = `
    <h3>${company.name} – ${company.role}</h3>
    <p><strong>Requirements:</strong> ${company.requirements || "Open to all"}</p>
    <ul>
      ${matchedStudents.map(student => `<li>${student.name} — ${student.status} (${student.department})</li>`).join("")}
    </ul>
  `;
}

function renderStudentCompanyOptions() {
  if (!studentCompanyInput) return;

  studentCompanyInput.innerHTML = '<option value="">Assign Company (optional)</option>';
  companies.forEach(company => {
    const option = document.createElement("option");
    option.value = company.id;
    option.textContent = company.name;
    studentCompanyInput.appendChild(option);
  });
}

function renderCompanies() {
  companiesTableBody.innerHTML = "";

  companies.forEach(company => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${company.name}</td>
      <td>${company.role}</td>
      <td>${company.package.toFixed(1)} LPA</td>
      <td>${company.requirements || "Open to all candidates"} (${company.eligibleDepartment === "All" ? "All departments" : company.eligibleDepartment})</td>
      <td>${company.openings}</td>
      <td><button class="action-btn action-delete company-delete" data-company-id="${company.id}">Delete</button></td>
    `;
    companiesTableBody.appendChild(tr);
  });

  document.querySelectorAll(".company-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      deleteCompany(Number(btn.dataset.companyId));
    });
  });
}

function renderStudents() {
  studentsTableBody.innerHTML = "";

  const deptValue = deptFilter.value;
  const statusValue = statusFilter.value;
  const searchValue = searchInput.value.trim().toLowerCase();

  students
    .filter(student => {
      let ok = true;
      if (deptValue !== "all") {
        ok = ok && student.department === deptValue;
      }
      if (statusValue !== "all") {
        ok = ok && student.status === statusValue;
      }
      if (searchValue) {
        const haystack = `${student.name} ${student.rollNo} ${student.department} ${student.email} ${student.skills}`.toLowerCase();
        ok = ok && haystack.includes(searchValue);
      }
      return ok;
    })
    .forEach(student => {
      const tr = document.createElement("tr");
      const statusClass = student.status === "Placed"
        ? "status-placed"
        : student.status === "Selected"
          ? "status-selected"
          : student.status === "Rejected"
            ? "status-rejected"
            : "status-active";
      const companyName = getCompanyName(student.companyId);
      const statusOptions = ["Applied", "Shortlisted", "Interviewed", "Selected", "Placed", "Rejected"]
        .map(option => `<option value="${option}" ${student.status === option ? "selected" : ""}>${option}</option>`)
        .join("");

      tr.innerHTML = `
        <td>${student.rollNo}</td>
        <td>${student.name}</td>
        <td>${student.email || "-"}</td>
        <td>${student.department}</td>
        <td>${student.cgpa.toFixed(1)}</td>
        <td>${student.skills || "-"}</td>
        <td><span class="status-pill ${statusClass}">${student.status}</span></td>
        <td>${companyName}</td>
        <td>
          <select class="status-select" data-id="${student.id}">${statusOptions}</select>
          <button class="action-btn action-update" data-id="${student.id}">Update</button>
          <button class="action-btn action-delete student-delete" data-id="${student.id}">Remove</button>
        </td>
      `;

      studentsTableBody.appendChild(tr);
    });

  document.querySelectorAll(".action-update").forEach(btn => {
    btn.addEventListener("click", () => {
      updateStudentStatus(Number(btn.dataset.id));
    });
  });

  document.querySelectorAll(".student-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      deleteStudent(Number(btn.dataset.id));
    });
  });
}

function freeCompanySlot(student) {
  if (!student.companyId) return;

  const company = companies.find(c => c.id === student.companyId);
  if (company) {
    company.openings += 1;
  }
  student.companyId = null;
}

function assignCompanySlot(student, companyId) {
  const company = companies.find(c => c.id === companyId);
  if (!company) return false;

  if (company.openings <= 0) {
    alert(`${company.name} has no openings left.`);
    return false;
  }

  if (student.companyId !== companyId) {
    company.openings -= 1;
  }

  student.companyId = companyId;
  return true;
}

function updateStudentStatus(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  const select = document.querySelector(`.status-select[data-id="${studentId}"]`);
  if (!select) return;

  const nextStatus = select.value;
  const placementStatuses = ["Selected", "Placed"];

  if (placementStatuses.includes(nextStatus)) {
    if (companies.length === 0) {
      alert("Add a company first.");
      return;
    }

    const companyList = companies.map(c => `${c.name} (${c.role})`).join("\n");
    const companyName = prompt(`Choose a company for ${student.name}:\n\n${companyList}`);
    if (!companyName) return;

    const selectedCompany = companies.find(c => c.name.toLowerCase() === companyName.trim().toLowerCase());
    if (!selectedCompany) {
      alert("Company not found.");
      return;
    }

    const meetsCriteria = selectedCompany.eligibleDepartment === "All" || student.department === selectedCompany.eligibleDepartment;

    if (!meetsCriteria) {
      alert(`${student.name} is not eligible for ${selectedCompany.name}.`);
      return;
    }

    if (student.companyId && student.companyId !== selectedCompany.id) {
      freeCompanySlot(student);
    }

    if (!student.companyId || student.companyId !== selectedCompany.id) {
      if (!assignCompanySlot(student, selectedCompany.id)) {
        return;
      }
    }
  } else {
    if (student.companyId && ["Placed", "Selected"].includes(student.status)) {
      freeCompanySlot(student);
    }
    student.companyId = null;
  }

  student.status = nextStatus;
  saveData();
  renderStats();
  renderCompanies();
  renderReport();
  renderStudents();
}

function deleteStudent(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return;

  students = students.filter(s => s.id !== studentId);
  saveData();
  renderStats();
  renderReport();
  renderStudents();
  alert(`${student.name} has been removed.`);
}

function deleteCompany(companyId) {
  const company = companies.find(c => c.id === companyId);
  if (!company) return;

  companies.splice(companies.findIndex(c => c.id === companyId), 1);
  students.forEach(student => {
    if (student.companyId === companyId) {
      student.companyId = null;
      if (["Placed", "Selected"].includes(student.status)) {
        student.status = "Applied";
      }
    }
  });

  saveData();
  renderStats();
  renderStudentCompanyOptions();
  renderCompanies();
  renderReport();
  renderStudents();
  alert(`${company.name} has been removed.`);
}

function addStudent(event) {
  event.preventDefault();

  const newStudent = {
    id: Date.now(),
    rollNo: rollNoInput.value.trim(),
    name: studentNameInput.value.trim(),
    email: studentEmailInput.value.trim(),
    department: studentDepartmentInput.value,
    cgpa: Number(studentCgpaInput.value),
    skills: studentSkillsInput.value.trim(),
    status: studentStatusInput.value,
    companyId: studentCompanyInput.value ? Number(studentCompanyInput.value) : null
  };

  if (["Selected", "Placed"].includes(newStudent.status) && newStudent.companyId) {
    const selectedCompany = companies.find(c => c.id === newStudent.companyId);
    if (!selectedCompany) {
      newStudent.companyId = null;
      newStudent.status = "Applied";
    } else {
      const meetsCriteria = selectedCompany.eligibleDepartment === "All" || newStudent.department === selectedCompany.eligibleDepartment;
      if (!meetsCriteria || selectedCompany.openings <= 0) {
        newStudent.companyId = null;
        newStudent.status = "Applied";
      } else {
        selectedCompany.openings -= 1;
      }
    }
  }

  students.unshift(newStudent);
  studentForm.reset();
  saveData();
  renderStats();
  renderStudentCompanyOptions();
  renderCompanies();
  renderReport();
  renderStudents();
  alert(`${newStudent.name} added successfully.`);
}

function addCompany(event) {
  event.preventDefault();

  const newCompany = {
    id: Date.now(),
    name: companyNameInput.value.trim(),
    role: companyRoleInput.value.trim(),
    package: Number(companyPackageInput.value),
    requirements: companyRequirementsInput.value.trim(),
    eligibleDepartment: companyDepartmentInput.value,
    openings: Number(companyOpeningsInput.value)
  };

  companies.unshift(newCompany);
  companyForm.reset();
  saveData();
  renderStudentCompanyOptions();
  renderCompanies();
  renderReport();
  renderStats();
  alert(`${newCompany.name} added successfully.`);
}

applyFilterBtn.addEventListener("click", () => {
  renderStudents();
});

searchInput.addEventListener("input", () => {
  renderStudents();
});

reportCompanyFilter.addEventListener("change", () => {
  renderReport();
});

studentForm.addEventListener("submit", addStudent);
companyForm.addEventListener("submit", addCompany);

loadData();
renderStats();
renderStudentCompanyOptions();
renderCompanies();
renderReport();
renderStudents();

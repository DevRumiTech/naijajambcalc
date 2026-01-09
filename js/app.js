/* =========================
   GRADE SYSTEM (SAFE & SIMPLE)
========================= */
const gradePoints = {
    A1: 10,
    B2: 9,
    B3: 8,
    C4: 7,
    C5: 6,
    C6: 5
  };
  
  const gradeOptions = ["", "A1", "B2", "B3", "C4", "C5", "C6"];
  
  /* =========================
     ELEMENTS
  ========================= */
  const utmeInput = document.getElementById("utmeScore");
  const gradeSelects = document.querySelectorAll(".grade");
  const weightingSelect = document.getElementById("weighting");
  const resultBox = document.getElementById("result");
  const breakdownBox = document.getElementById("breakdown");
  const form = document.getElementById("calcForm");
  
  const lightBtn = document.getElementById("lightMode");
  const darkBtn = document.getElementById("darkMode");
  
  /* =========================
     INIT
  ========================= */
  function populateGrades() {
    gradeSelects.forEach(select => {
      gradeOptions.forEach(grade => {
        const option = document.createElement("option");
        option.value = grade;
        option.textContent = grade || "Select grade";
        select.appendChild(option);
      });
    });
  }
  
  populateGrades();
  
  /* =========================
     CALCULATION
  ========================= */
  function calculate() {
    const utme = Number(utmeInput.value);
  
    if (!utme) {
        resultBox.textContent = "Enter your scores to see an estimate.";
        breakdownBox.textContent = "";
        return;
      }
      
      if (utme < 0 || utme > 400) {
        resultBox.innerHTML = '<span class="error">Invalid UTME score. Enter a value between 0 and 400.</span>';

        breakdownBox.textContent = "";
        return;
      }
      
  
    /* Normalize UTME to 100 */
    const utmeNormalized = (utme / 400) * 100;
  
    /* O'level calculation */
    let totalGradePoints = 0;
    let validGrades = 0;
  
    gradeSelects.forEach(select => {
      const grade = select.value;
      if (gradePoints[grade]) {
        totalGradePoints += gradePoints[grade];
        validGrades++;
      }
    });
  
    if (validGrades === 0) {
      resultBox.textContent = "Select at least one O’level grade.";
      breakdownBox.textContent = "";
      return;
    }
  
    const oLevelAverage = (totalGradePoints / (validGrades * 10)) * 100;
  
    /* Weighting */
    const utmeWeight = Number(weightingSelect.value);
    const oLevelWeight = 100 - utmeWeight;
  
    const aggregate =
      (utmeNormalized * utmeWeight) / 100 +
      (oLevelAverage * oLevelWeight) / 100;
  
    /* Output */
    resultBox.textContent = `Estimated Aggregate Score: ${aggregate.toFixed(1)}%`;
  
    breakdownBox.innerHTML = `
      UTME: ${utme} / 400 → ${utmeNormalized.toFixed(1)}%<br>
      O’level average: ${oLevelAverage.toFixed(1)}% (${validGrades} subjects)<br>
      Weighting: ${utmeWeight}% UTME / ${oLevelWeight}% O’level<br>
      <strong>This is an estimate only.</strong>
    `;
  }
  
  /* =========================
     EVENTS
  ========================= */
  utmeInput.addEventListener("input", calculate);
  weightingSelect.addEventListener("change", calculate);
  gradeSelects.forEach(select => select.addEventListener("change", calculate));
  
  form.addEventListener("reset", () => {
    resultBox.textContent = "Enter your scores to see an estimate.";
    breakdownBox.textContent = "";
  });
  
  /* =========================
     THEME CONTROLS
  ========================= */
  lightBtn.addEventListener("click", () => {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  });
  
  darkBtn.addEventListener("click", () => {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  });
  
  /* Persist theme */
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
  
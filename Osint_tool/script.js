let startTime = Date.now();
let keystrokes = 0;
let pasted = false;

document.addEventListener("keydown", () => keystrokes++);
document.addEventListener("paste", () => pasted = true);

document.getElementById("idForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const dob = document.getElementById("dob").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  let risk = 0;
  let reasons = [];

  // Age vs DOB check
  const birthYear = new Date(dob).getFullYear();
  const realAge = new Date().getFullYear() - birthYear;
  if (Math.abs(realAge - age) > 1) {
    risk += 20;
    reasons.push("Age and Date of Birth mismatch");
  }

  // Typing speed
  const typingSpeed = keystrokes / ((Date.now() - startTime) / 1000);
  if (typingSpeed < 2) {
    risk += 15;
    reasons.push("Abnormal typing behavior detected");
  }

  // Paste detection
  if (pasted) {
    risk += 15;
    reasons.push("Copy-paste behavior detected");
  }

  // Email entropy
  const emailEntropy = new Set(email).size / email.length;
  if (emailEntropy < 0.3) {
    risk += 10;
    reasons.push("Low entropy email pattern");
  }

  // Name randomness
  const vowelRatio = (name.match(/[aeiou]/gi)?.length || 0) / name.length;
  if (vowelRatio < 0.25) {
    risk += 10;
    reasons.push("Name appears auto-generated");
  }

  // Fast form submission
  const fillTime = (Date.now() - startTime) / 1000;
  if (fillTime < 20) {
    risk += 20;
    reasons.push("Form filled unusually fast");
  }

  risk = Math.min(risk, 100);

  showResult(risk, reasons);
});

function showResult(risk, reasons) {
  const result = document.getElementById("result");
  const bar = document.getElementById("riskBar");
  const scoreText = document.getElementById("scoreText");
  const verdict = document.getElementById("verdict");
  const list = document.getElementById("reasons");

  result.classList.remove("hidden");
  bar.style.width = risk + "%";

  bar.className = "risk-bar";
  if (risk < 30) {
    bar.classList.add("safe");
    verdict.innerText = "GENUINE ID ✅";
  } else if (risk < 60) {
    bar.classList.add("warn");
    verdict.innerText = "SUSPICIOUS ID⚠️";
  } else {
    bar.classList.add("danger");
    verdict.innerText = "FAKE ID 🚨";
  }

  scoreText.innerText = `Risk Score: ${risk}%`;
  list.innerHTML = "";
  reasons.forEach(r => {
    const li = document.createElement("li");
    li.innerText = r;
    list.appendChild(li);
  });
}

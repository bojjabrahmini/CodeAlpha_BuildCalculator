const displayExpression = document.querySelector(".display .expression");
const displayResult = document.querySelector(".display .result");

let currentInput = "0";
let previousInput = "";
let operator = null;
let shouldReset = false;

const OPERATOR_SYMBOLS = {
  "+": "+",
  "-": "\u2212",
  "*": "\u00d7",
  "/": "\u00f7",
};

function updateDisplay() {
  displayExpression.textContent =
    previousInput !== "" && operator
      ? `${previousInput} ${OPERATOR_SYMBOLS[operator]}`
      : "";
  displayResult.textContent = currentInput;
  displayResult.classList.remove("error");
}

function inputNumber(num) {
  if (shouldReset) {
    currentInput = "0";
    shouldReset = false;
  }
  if (currentInput === "0") {
    currentInput = num;
  } else {
    if (currentInput.replace("-", "").length >= 12) return;
    currentInput += num;
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldReset) {
    currentInput = "0";
    shouldReset = false;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
}

function setOperator(nextOperator) {
  if (operator && !shouldReset) {
    calculate();
  }
  if (currentInput === "Error") return;

  previousInput = currentInput;
  operator = nextOperator;
  shouldReset = true;
  updateDisplay();
}

function calculate() {
  if (operator === null || previousInput === "") return;

  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let result;

  switch (operator) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      if (curr === 0) {
        currentInput = "Error";
        previousInput = "";
        operator = null;
        shouldReset = true;
        displayResult.textContent = "Error";
        displayResult.classList.add("error");
        displayExpression.textContent = "";
        return;
      }
      result = prev / curr;
      break;
    default:
      return;
  }

  result = Math.round((result + Number.EPSILON) * 1e10) / 1e10;
  currentInput = String(result);
  previousInput = "";
  operator = null;
  shouldReset = true;
  updateDisplay();
}

function clearAll() {
  currentInput = "0";
  previousInput = "";
  operator = null;
  shouldReset = false;
  updateDisplay();
}

function backspace() {
  if (shouldReset || currentInput === "Error") {
    clearAll();
    return;
  }
  if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith("-"))) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

document.querySelectorAll("[data-action]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === "number") inputNumber(value);
    else if (action === "decimal") inputDecimal();
    else if (action === "operator") setOperator(value);
    else if (action === "equals") calculate();
    else if (action === "clear") clearAll();
    else if (action === "backspace") backspace();
  });
});

document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key >= "0" && key <= "9") inputNumber(key);
  else if (key === ".") inputDecimal();
  else if (key === "+" || key === "-" || key === "*" || key === "/") setOperator(key);
  else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") backspace();
  else if (key === "Escape") clearAll();
});

updateDisplay();

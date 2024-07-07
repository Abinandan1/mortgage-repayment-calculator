const form = document.querySelector("form");
const radioContainers = document.querySelectorAll(".radio-container");
const clearBtn = document.querySelector(".clear-btn");
const completed = document.querySelector(".completed");
const empty = document.querySelector(".empty");

// SHOW EMPTY RESULTS WHEN FORM IS RESET
clearBtn.addEventListener("click", () => {
  showEmptyResults();
});
// MAXIMIZE RADIO BUTTON CLICK
radioContainers.forEach((radioContainer) => {
  radioContainer.addEventListener("click", (e) => {
    radioContainer.querySelector(".form-radio").checked = true;
  });
});
// FORM SUBMISSION
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //   FETCHING INPUT DATA ENTERED BY USER
  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);
  //   VALIDATING FORM DATA
  const isValid = validateInputs(data);
  if (isValid) {
    const { monthlyPayment, totalPayment } = calculateAmounts(data);
    // DISPLAY AMOUNTS
    document.querySelector(".monthly-repayment").innerHTML = monthlyPayment;
    document.querySelector(".total-repayment").innerHTML = totalPayment;
    //   DISPLAY COMPLETED RESULTS
    showCompletedResults();
  } else {
    //   DISPLAY EMPTY RESULTS
    showEmptyResults();
  }
});

const validateInputs = (data) => {
  const { mortgageAmount, mortgageTerm, interestRate, mortgageType } = data;
  const formInputs = document.querySelectorAll(".form-input");
  const formRadio = document.querySelector(".form-radio");
  let isValid = true;
  //   REMOVE ERROR STYLES FOR RADIO INPUT
  if (data[formRadio.id]) {
    const errorMessage =
      formRadio.parentElement.parentElement.nextElementSibling;
    errorMessage.classList.remove("show-message");
  }
  //   REMOVE ERROR STYLES FOR FORM INPUTS
  formInputs.forEach((input) => {
    if (data[input.id]) {
      input.classList.remove("error-form-input");
      const inputUnits = input.parentElement.querySelector(".input-units");
      inputUnits.classList.remove("error-units");
      const errorMessage = input.parentElement.nextElementSibling;
      errorMessage.classList.remove("show-message");
    }
  });
  if (!mortgageAmount) {
    setErrorStyles("mortgageAmount");
    isValid = false;
  }
  if (!mortgageTerm) {
    setErrorStyles("mortgageTerm");
    isValid = false;
  }
  if (!interestRate) {
    setErrorStyles("interestRate");
    isValid = false;
  }
  if (!mortgageType) {
    //   SET ERROR STYLES FOR RADIO INPUT
    const input = document.querySelector("#mortgageType");
    const errorMessage = input.parentElement.parentElement.nextElementSibling;
    errorMessage.classList.add("show-message");
    isValid = false;
  }

  //   SET ERROR STYLES FOR FORM INPUTS
  function setErrorStyles(id) {
    const input = document.querySelector(`#${id}`);
    const inputUnits = input.parentElement.querySelector(".input-units");
    inputUnits.classList.add("error-units");
    input.classList.add("error-form-input");
    const errorMessage = input.parentElement.nextElementSibling;
    errorMessage.classList.add("show-message");
  }

  return isValid;
};

function showCompletedResults() {
  completed.classList.add("show-results");
  completed.classList.remove("hide-results");
  empty.classList.add("hide-results");
  empty.classList.remove("show-results");
}

function showEmptyResults() {
  completed.classList.remove("show-results");
  completed.classList.add("hide-results");
  empty.classList.remove("hide-results");
  empty.classList.add("show-results");
}

function calculateAmounts(data) {
  let { mortgageAmount: P, mortgageTerm: n, interestRate: r } = data;
  n = n * 12;
  r = r / 100 / 12;

  let monthlyPayment = (P * (r * (1 + r) ** n)) / ((1 + r) ** n - 1);
  let totalPayment = monthlyPayment * n;
  monthlyPayment = `&euro;${addCommas(monthlyPayment.toFixed(2))}`;
  totalPayment = `&euro;${addCommas(totalPayment.toFixed(2))}`;
  return { monthlyPayment, totalPayment };
}

function addCommas(num) {
  let [number, decimal] = `${num}`.split(".");
  let len = number.length;
  while (len - 3 >= 1) {
    len -= 3;
    number =
      number.substring(0, len) + "," + number.substring(len, number.length);
  }
  return decimal ? `${number}.${decimal}` : number;
}

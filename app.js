/* Replace this adapter with a real destination when one is selected. */
const leadDestination = {
  async submit(lead) {
    // Intentionally local: this MVP does not send or persist personal data.
    console.info("Lead captured for adapter:", lead);
  },
};

const form = document.querySelector("#lead-form");
const successPanel = document.querySelector("#success-panel");
const formError = document.querySelector("#form-error");
const interestsError = document.querySelector("#interests-error");
const interestsGroup = document.querySelector(".interests-section");
const resetButton = document.querySelector("#reset-form");

function clearValidation() {
  formError.textContent = "";
  interestsError.textContent = "";
  interestsGroup.classList.remove("invalid-group");
  form.querySelectorAll(".field").forEach((field) => field.classList.remove("invalid"));
}

function validateForm() {
  clearValidation();
  let valid = true;
  const requiredFields = form.querySelectorAll("input[required]:not([type=radio]):not([type=checkbox]), select[required]");
  requiredFields.forEach((control) => {
    const field = control.closest(".field");
    const valueMissing = !control.value.trim();
    const typeMismatch = control.type === "email" && !control.validity.valid;
    if (valueMissing || typeMismatch) {
      field.classList.add("invalid");
      control.setAttribute("aria-invalid", "true");
      valid = false;
    } else {
      control.removeAttribute("aria-invalid");
    }
  });

  const whatsapp = form.elements.whatsapp;
  if (whatsapp.value && !/^[+\d][\d\s().-]{6,}$/.test(whatsapp.value.trim())) {
    whatsapp.closest(".field").classList.add("invalid");
    whatsapp.setAttribute("aria-invalid", "true");
    valid = false;
  }

  if (!form.querySelector('input[name="experience"]:checked')) valid = false;
  if (!form.querySelector('input[name="interests"]:checked')) {
    interestsError.textContent = "Choose at least one interest.";
    interestsGroup.classList.add("invalid-group");
    valid = false;
  }
  if (!form.elements.consent.checked) valid = false;

  if (!valid) formError.textContent = "Please complete the required fields and check your selections.";
  return valid;
}

form.addEventListener("input", (event) => {
  if (event.target.matches("input, select")) {
    event.target.removeAttribute("aria-invalid");
    event.target.closest(".field")?.classList.remove("invalid");
    formError.textContent = "";
    if (event.target.name === "interests") {
      interestsError.textContent = "";
      interestsGroup.classList.remove("invalid-group");
    }
  }
});

form.addEventListener("change", (event) => {
  if (event.target.name === "interests" && form.querySelector('input[name="interests"]:checked')) {
    interestsError.textContent = "";
    interestsGroup.classList.remove("invalid-group");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateForm()) {
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  const data = new FormData(form);
  const lead = {
    name: data.get("name").trim(),
    whatsapp: data.get("whatsapp").trim(),
    email: data.get("email").trim(),
    experience: data.get("experience"),
    interests: data.getAll("interests"),
    goal: data.get("goal"),
    hoursPerWeek: data.get("hours"),
    consent: data.get("consent") === "on",
  };

  const submitButton = form.querySelector(".submit-button");
  submitButton.disabled = true;
  submitButton.querySelector("span:first-child").textContent = "Adding you…";
  try {
    await leadDestination.submit(lead);
    form.hidden = true;
    successPanel.hidden = false;
    document.querySelector("#form-title").textContent = "Thanks for your interest.";
  } catch {
    formError.textContent = "We couldn’t submit your response. Please try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.querySelector("span:first-child").textContent = "Join the interest list";
  }
});

resetButton.addEventListener("click", () => {
  form.reset();
  clearValidation();
  form.hidden = false;
  successPanel.hidden = true;
  document.querySelector("#form-title").textContent = "Tell us what you want to learn.";
  document.querySelector("#name").focus();
});

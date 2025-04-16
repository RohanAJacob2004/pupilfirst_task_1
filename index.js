const email = document.getElementById("email");
const password = document.getElementById("password");
const Name = document.getElementById("name");
const dob = document.getElementById("dob");

email.addEventListener("input", () => validate(email));
// Add validation for name input
Name.addEventListener("input", () => validateName(Name));
// Add validation for dob input
dob.addEventListener("input", () => validateDOB(dob));

const submit = document.getElementById("submit");
submit.addEventListener("click", () => validate(email));
submit.addEventListener("click", () => validateName(Name));
submit.addEventListener("click", () => validateDOB(dob));

function validate(element) {
    if (element.validity.typeMismatch) {
        element.setCustomValidity("Please enter a valid email.");
        element.reportValidity();
    }
    else {
        element.setCustomValidity("");
        element.reportValidity();
    }
}

// Function to validate Name
function validateName(element) {
    if (element.value.trim() === "") {
        element.setCustomValidity("Name cannot be empty.");
    } else {
        element.setCustomValidity("");
    }
    element.reportValidity();
}

// Function to validate Date of Birth
function validateDOB(element) {
    const dobValue = new Date(element.value);
    const today = new Date();

    // Calculate age
    const minAgeDate = new Date();
    minAgeDate.setFullYear(today.getFullYear() - 18);

    const maxAgeDate = new Date();
    maxAgeDate.setFullYear(today.getFullYear() - 55);

    if (dobValue > minAgeDate) {
        element.setCustomValidity("You must be at least 18 years old.");
    }
    else if (dobValue < maxAgeDate) {
        element.setCustomValidity("You must be less than 55 years old.");
    }
    else {
        element.setCustomValidity("");
    }

    element.reportValidity();
}

let userForm = document.getElementById("user-form");
const retrieveEntries = () => {
    let entries = localStorage.getItem("user-entries");
    if (entries) {
        entries = JSON.parse(entries);
    }
    else {
        entries = [];
    }
    return entries;
}

let userEntries = retrieveEntries();

const displayEntries = () => {
    const entries = retrieveEntries();

    // Fixed: syntax for function and template literals
    const tableEntries = entries.map((entry) => {
        const nameCell = `<td class='border px-4 py-2'>${entry.nameValue}</td>`;
        const emailCell = `<td class='border px-4 py-2'>${entry.emailValue}</td>`;
        const passwordCell = `<td class='border px-4 py-2'>${entry.passwordValue}</td>`;
        const dobCell = `<td class='border px-4 py-2'>${entry.dobValue}</td>`;
        const acceptTermsCell = `<td class='border px-4 py-2'>${entry.acceptedTermsAndconditionsValue ? 'Yes' : 'No'}</td>`;
        const row = `<tr>${nameCell}${emailCell}${passwordCell}${dobCell}${acceptTermsCell}</tr>`;
        return row;
    }).join("\n");

    const table = `<table class="table-auto w-full"><tr>
        <th class="px-4 py-2">Name</th>
        <th class="px-4 py-2">Email</th>
        <th class="px-4 py-2">Password</th>
        <th class="px-4 py-2">dob</th>
        <th class="px-4 py-2">accepted terms?</th>
        </tr>${tableEntries}</table>`;

    let details = document.getElementById("user-entries");
    details.innerHTML = table; // Fixed: capital 'HTML' in innerHTML
}

const saveUserForm = (event) => {
    event.preventDefault();

    // Validate inputs before saving
    validateName(document.getElementById("name"));
    validate(document.getElementById("email"));
    validateDOB(document.getElementById("dob"));

    // Get all form controls
    const form = document.getElementById("user-form");

    // Check if the form is valid
    if (!form.checkValidity()) {
        // If not valid, report validity (will show the browser's default error messages)
        form.reportValidity();
        return;
    }

    const nameValue = document.getElementById("name").value;
    const emailValue = document.getElementById("email").value;
    const passwordValue = document.getElementById("password").value;
    const dobValue = document.getElementById("dob").value;
    const acceptedTermsAndconditionsValue = document.getElementById("acceptTerms").checked;
    const entry = {
        nameValue,
        emailValue,
        passwordValue,
        dobValue,
        acceptedTermsAndconditionsValue
    };
    userEntries.push(entry);
    localStorage.setItem("user-entries", JSON.stringify(userEntries));
    displayEntries();

    // Reset the form
    form.reset();
}

userForm.addEventListener("submit", saveUserForm);
displayEntries();

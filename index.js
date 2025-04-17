document.addEventListener('DOMContentLoaded', function () {
    const userForm = document.getElementById('user-form');
    const tableBody = document.getElementById('tableBody');

    // Add email validation event listeners
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('input', function () {
        // Use browser's built-in validation
        if (emailInput.validity.typeMismatch) {
            emailInput.setCustomValidity("The Email is not in the right format!!!");
            emailInput.reportValidity();
        } else {
            emailInput.setCustomValidity('');
        }
    });

    // Load existing data from localStorage
    loadDataFromLocalStorage();

    userForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Reset error messages
        clearErrors();

        // Force browser validation on email before form validation
        if (emailInput.validity.typeMismatch) {
            emailInput.reportValidity();
            return; // Stop form submission if email is invalid
        }

        // Validate the form
        if (validateForm()) {
            // Get form data
            const userData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                dob: document.getElementById('dob').value,
                acceptedTerms: document.getElementById('acceptTerms').checked
            };

            // Save to localStorage
            saveToLocalStorage(userData);

            // Add to table
            addRowToTable(userData);

            // Reset form
            userForm.reset();
        }
    });

    function validateForm() {
        let isValid = true;

        // Name validation
        const name = document.getElementById('name').value;
        if (name.trim() === '') {
            displayError('nameError', 'Name is required');
            isValid = false;
        } else if (name.length < 3) {
            displayError('nameError', 'Name must be at least 3 characters');
            isValid = false;
        }

        // Remove custom email validation with regex
        // Email will be validated by the browser's built-in validation

        // Date of birth validation
        const dob = document.getElementById('dob').value;
        if (!dob) {
            displayError('dobError', 'Date of birth is required');
            isValid = false;
        } else {
            const dobDate = new Date(dob);
            const today = new Date();

            // Calculate min age (18 years ago)
            const minAgeDate = new Date();
            minAgeDate.setFullYear(today.getFullYear() - 18);

            // Calculate max age (55 years ago)
            const maxAgeDate = new Date();
            maxAgeDate.setFullYear(today.getFullYear() - 55);

            if (dobDate > today) {
                displayError('dobError', 'Date of birth cannot be in the future');
                isValid = false;
            } else if (dobDate > minAgeDate) {
                displayError('dobError', 'You must be at least 18 years old');
                isValid = false;
            } else if (dobDate < maxAgeDate) {
                displayError('dobError', 'Age cannot be more than 55 years');
                isValid = false;
            }
        }

        return isValid;
    }

    function displayError(elementId, message) {
        document.getElementById(elementId).textContent = message;
    }

    function clearErrors() {
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(element => {
            element.textContent = '';
        });
    }

    function saveToLocalStorage(userData) {
        // Get existing data
        let users = JSON.parse(localStorage.getItem('user-entries')) || [];

        // Add new user
        users.push(userData);

        // Save back to localStorage
        localStorage.setItem('user-entries', JSON.stringify(users));
    }

    function loadDataFromLocalStorage() {
        const users = JSON.parse(localStorage.getItem('user-entries')) || [];

        // Clear the table first
        tableBody.innerHTML = '';

        // Add each user to the table
        users.forEach(user => {
            addRowToTable(user);
        });
    }

    function addRowToTable(userData) {
        const row = document.createElement('tr');

        // Create cells for each data point
        const nameCell = document.createElement('td');
        nameCell.textContent = userData.name;

        const emailCell = document.createElement('td');
        emailCell.textContent = userData.email;

        const passwordCell = document.createElement('td');
        passwordCell.textContent = userData.password; // Mask the password for security

        const dobCell = document.createElement('td');
        dobCell.textContent = userData.dob;

        const termsCell = document.createElement('td');
        termsCell.textContent = userData.acceptedTerms;

        // Add cells to row
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(passwordCell);
        row.appendChild(dobCell);
        row.appendChild(termsCell);

        // Add row to table
        tableBody.appendChild(row);
    }
});


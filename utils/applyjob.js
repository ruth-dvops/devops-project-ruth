const Application = require('../models/application');

async function applyjob(req, res) {
    try {
        const { name, age, education, phone, email } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        if (!age) {
            return res.status(400).json({ message: 'Age is required' });
        }

        if (!education) {
            return res.status(400).json({ message: 'Education is required' });
        }

        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Validate name (no special characters or numbers allowed)
        const nameRegex = /^[A-Za-z\s]+$/; // Only alphabets and spaces allowed
        if (!nameRegex.test(name)) {
            return res.status(400).json({ message: 'Validation error: name must not contain numbers or special characters' });
        }

        // Validate phone number (at least 6 digits)
        if (!phone || phone.length < 6) {
            return res.status(400).json({ message: 'Validation error: phone number must be at least 6 digits' });
        }

        // Validate that phone contains only numbers
        const phoneRegex = /^\d+$/;  // Regex to match only digits
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ message: 'Validation error: phone number must contain only numbers' });
        }

        // Email validation (basic format check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Trim email to remove leading/trailing spaces
        const trimmedEmail = email.trim();
        if (trimmedEmail !== email) {
            return res.status(400).json({ message: 'Validation error: email address should not have leading or trailing spaces' });
        }
        if (!emailRegex.test(trimmedEmail)) {
            return res.status(400).json({ message: 'Validation error: invalid email format' });
        }

        // Validate that age is a number
        const ageRegex = /^\d+$/;  // Regex to match only digits
        if (!age || !ageRegex.test(age)) {
            return res.status(400).json({ message: 'Validation error: age must be a number' });
        }

        // Validate minimum age of 18
        if (age < 18) {
            return res.status(400).json({ message: 'Minimum age is 18 to apply.' });
        }

        // Create the application document and save it
        const newApplication = new Application({
            name,
            age,
            education,
            phone,
            email
        });

        // Save the application and respond
        const savedApplication = await newApplication.save();
        return res.status(201).json(savedApplication);
    } catch (error) {
        console.error("Error applying for job:", error);
        return res.status(500).json({ message: 'An error occurred', error });
    }
}

module.exports = {
    applyjob
};

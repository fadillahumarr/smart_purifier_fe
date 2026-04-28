const validateName = (name: string) => {
    if (!name.trim()) return "Full name is required";
    return "";
};

const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Invalid email format";

    return "";
};

const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";

    return "";
};

const validateConfirmPassword = (
    password: string,
    confirmPassword: string
) => {
    if (!confirmPassword) return "Confirm password is required";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
};

export { validateName, validateEmail, validatePassword, validateConfirmPassword };
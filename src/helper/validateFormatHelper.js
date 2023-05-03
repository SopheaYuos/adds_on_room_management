export function isValidPassword(password) {
    const errors = [];

    if (password.length < 8 || password.length > 20) {
        errors.push({ key: 1, message: 'Password must be at least 8 or at most 20 characters long.', error: true });
    } else {
        errors.push({ key: 1, message: 'Password must be at least 8 or at most 20 characters long.', error: false });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/.test(password)) {
        errors.push({ key: 2, message: 'Contains at least 1 lowercase, 1 uppercase, & 1 special character.', error: true });
    } else {
        errors.push({ key: 2, message: 'Contains at least 1 lowercase, 1 uppercase, & 1 special character.', error: false });
    }

    if (!/\d/.test(password)) {
        errors.push({ key: 3, message: 'Contains at least one digit.', error: true });
    } else {
        errors.push({ key: 3, message: 'Contains at least one digit.', error: false });
    }

    return errors;
}
export const passwordRuleMessages = [
    { key: 1, message: 'Password must be at least 8 or at most 20 characters long.', error: false },
    { key: 2, message: 'Contains at least 1 lowercase, 1 uppercase, & 1 special character.', error: false },
    { key: 3, message: 'Contains at least one digit.', error: false }
];
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function isValidCambodiaPhone(phone) {
    const cambodiaPhoneRegex = /^(\+855|0)[1-9]\d{7}$/;
    return cambodiaPhoneRegex.test(phone);
}
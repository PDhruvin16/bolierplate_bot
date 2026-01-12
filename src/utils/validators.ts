// Email validation
export const validateEmail = email => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = password => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const validatePhone = phone => {
  // Basic phone validation - can be customized based on requirements
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Required field validation
export const validateRequired = value => {
  return value && value.trim().length > 0;
};

// Minimum length validation
export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

// Maximum length validation
export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

// URL validation
export const validateUrl = url => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Date validation
export const validateDate = date => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

// Number validation
export const validateNumber = value => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];

    // Required validation
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = fieldRules.required;
    }

    // Email validation
    if (fieldRules.email && value && !validateEmail(value)) {
      errors[field] = fieldRules.email;
    }

    // Password validation
    if (fieldRules.password && value && !validatePassword(value)) {
      errors[field] = fieldRules.password;
    }

    // Phone validation
    if (fieldRules.phone && value && !validatePhone(value)) {
      errors[field] = fieldRules.phone;
    }

    // Min length validation
    if (
      fieldRules.minLength &&
      value &&
      !validateMinLength(value, fieldRules.minLength.value)
    ) {
      errors[field] = fieldRules.minLength.message;
    }

    // Max length validation
    if (
      fieldRules.maxLength &&
      value &&
      !validateMaxLength(value, fieldRules.maxLength.value)
    ) {
      errors[field] = fieldRules.maxLength.message;
    }

    // Custom validation
    if (fieldRules.custom && value) {
      const customError = fieldRules.custom(value, values);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return errors;
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateUrl,
  validateDate,
  validateNumber,
  validateForm,
};

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule[];
}

export const commonRules = {
  required: {
    validate: (value: any) => value !== undefined && value !== null && value !== '',
    message: 'This field is required',
  },
  email: {
    validate: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address',
  },
  minLength: (length: number) => ({
    validate: (value: string) => value.length >= length,
    message: `Must be at least ${length} characters`,
  }),
  maxLength: (length: number) => ({
    validate: (value: string) => value.length <= length,
    message: `Must be no more than ${length} characters`,
  }),
  pattern: (regex: RegExp, message: string) => ({
    validate: (value: string) => regex.test(value),
    message,
  }),
  password: {
    validate: (value: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
    message:
      'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
  },
  username: {
    validate: (value: string) => /^[a-zA-Z0-9_-]{3,20}$/.test(value),
    message: 'Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens',
  },
  url: {
    validate: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: 'Please enter a valid URL',
  },
  number: {
    validate: (value: any) => !isNaN(Number(value)),
    message: 'Please enter a valid number',
  },
  integer: {
    validate: (value: any) => Number.isInteger(Number(value)),
    message: 'Please enter a valid integer',
  },
  positive: {
    validate: (value: any) => Number(value) > 0,
    message: 'Please enter a positive number',
  },
  date: {
    validate: (value: string) => !isNaN(Date.parse(value)),
    message: 'Please enter a valid date',
  },
  fileType: (allowedTypes: string[]) => ({
    validate: (file: File) => allowedTypes.includes(file.type.split('/')[1]),
    message: `Only ${allowedTypes.join(', ')} files are allowed`,
  }),
  fileSize: (maxSize: number) => ({
    validate: (file: File) => file.size <= maxSize,
    message: `File size must be less than ${maxSize / 1024 / 1024}MB`,
  }),
};

export function validateForm(data: any, rules: ValidationRules): ValidationError[] {
  const errors: ValidationError[] = [];

  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const fieldRules = rules[field];

    fieldRules.forEach((rule) => {
      if (!rule.validate(value)) {
        errors.push({
          field,
          message: rule.message,
        });
      }
    });
  });

  return errors;
}

export function validateField(value: any, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return null;
}

export function createFormValidator(rules: ValidationRules) {
  return (data: any) => validateForm(data, rules);
}

// Example usage:
/*
const loginValidator = createFormValidator({
  username: [commonRules.required, commonRules.username],
  password: [commonRules.required, commonRules.password],
});

const errors = loginValidator({ username: '', password: '123' });
*/ 
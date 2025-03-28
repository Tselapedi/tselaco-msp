import { VALIDATION_CONFIG, S3_CONFIG, ERROR_MESSAGES } from '../aws/config';

export function validateSouthAfricanIDNumber(idNumber: string): { isValid: boolean; age: number | null; birthDate: Date | null; gender: string | null } {
  const result = {
    isValid: false,
    age: null,
    birthDate: null,
    gender: null,
  };

  // Check basic format
  if (!VALIDATION_CONFIG.ID_NUMBER_REGEX.test(idNumber)) {
    return result;
  }

  // Extract date components
  const year = parseInt(idNumber.substring(0, 2));
  const month = parseInt(idNumber.substring(2, 4));
  const day = parseInt(idNumber.substring(4, 6));

  // Validate month and day
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return result;
  }

  // Determine century and create birth date
  const currentYear = new Date().getFullYear();
  const century = year + 2000 > currentYear ? 1900 : 2000;
  const fullYear = century + year;

  const birthDate = new Date(fullYear, month - 1, day);

  // Validate birth date is not in the future
  if (birthDate > new Date()) {
    return result;
  }

  // Extract gender
  const genderNum = parseInt(idNumber.substring(6, 10));
  const gender = genderNum < 5000 ? 'Female' : 'Male';

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // Validate citizenship/residency
  const citizenshipStatus = parseInt(idNumber.charAt(10));
  if (citizenshipStatus !== 0 && citizenshipStatus !== 1) {
    return result;
  }

  // Validate check digit using Luhn algorithm
  const digits = idNumber.split('').map(Number);
  const checkDigit = digits.pop()!;
  const sum = digits
    .reverse()
    .map((digit, index) => {
      if (index % 2 === 0) {
        const doubled = digit * 2;
        return doubled > 9 ? doubled - 9 : doubled;
      }
      return digit;
    })
    .reduce((acc, curr) => acc + curr, 0);

  const calculatedCheckDigit = (10 - (sum % 10)) % 10;

  if (checkDigit !== calculatedCheckDigit) {
    return result;
  }

  return {
    isValid: true,
    age,
    birthDate,
    gender,
  };
}

export function validateSouthAfricanPhoneNumber(phoneNumber: string): boolean {
  return VALIDATION_CONFIG.PHONE_REGEX.test(phoneNumber);
}

export function validatePassword(password: string): boolean {
  return (
    password.length >= VALIDATION_CONFIG.PASSWORD_MIN_LENGTH &&
    VALIDATION_CONFIG.PASSWORD_REGEX.test(password)
  );
}

export function validateFileUpload(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (!S3_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE };
  }

  if (file.size > S3_CONFIG.MAX_FILE_SIZE) {
    return { isValid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE };
  }

  return { isValid: true };
} 

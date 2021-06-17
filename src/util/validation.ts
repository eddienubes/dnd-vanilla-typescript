import {IValidatable} from "../models/validation";

// validation
export function validate(validatable: IValidatable) {
  let isValid = true;
  if (validatable.required && validatable.value != null) {
    isValid = isValid && validatable.value.toString().trim().length !== 0;
  }

  if (validatable.minLength != null && typeof validatable.value === 'string') {
    isValid = isValid && validatable.value.trim().length >= validatable.minLength;
  }

  if (validatable.maxLength != null && typeof validatable.value === 'string') {
    isValid = isValid && validatable.value.trim().length <= validatable.maxLength;
  }

  if (validatable.min != null && typeof validatable.value === 'number') {
    isValid = isValid && validatable.value >= validatable.min;
  }

  if (validatable.max != null && typeof validatable.value === 'number') {
    isValid = isValid && validatable.value <= validatable.max;
  }

  return isValid;
}


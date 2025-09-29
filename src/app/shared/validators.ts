import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordStrengthValidator = (): ValidatorFn => {
  const regexLower = /[a-z]/;
  const regexUpper = /[A-Z]/;
  const regexDigit = /\d/;
  const regexSpecial = /[^A-Za-z0-9]/;
  return (control: AbstractControl): ValidationErrors | null => {
    const v = (control.value || '') as string;
    if (!v) return { required: true };
    const lenOk = v.length >= 8 && v.length <= 16;
    const hasLower = regexLower.test(v);
    const hasUpper = regexUpper.test(v);
    const hasDigit = regexDigit.test(v);
    const hasSpecial = regexSpecial.test(v);
    return (lenOk && hasLower && hasUpper && hasDigit && hasSpecial)
      ? null
      : { weak: { lenOk, hasLower, hasUpper, hasDigit, hasSpecial } };
  };
};

export const matchValidator = (otherControlName: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent as any;
    if (!parent) return null;
    const other = parent.get(otherControlName);
    if (!other) return null;
    return control.value === other.value ? null : { nomatch: true };
  };
};

export const phoneDigitsValidator = (min = 8, max = 15): ValidatorFn => {
  const re = new RegExp(`^\\d{${min},${max}}$`);
  return (c: AbstractControl) => {
    const v = (c.value || '').toString().trim();
    if (!v) return null; // opcional
    return re.test(v) ? null : { phone: { min, max } };
  };
};

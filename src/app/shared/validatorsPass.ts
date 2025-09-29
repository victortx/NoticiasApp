import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordStrengthValidator = (): ValidatorFn => {
  const lower = /[a-z]/, upper = /[A-Z]/, digit = /\d/, special = /[^A-Za-z0-9]/;
  return (c: AbstractControl): ValidationErrors | null => {
    const v = (c.value || '') as string;
    if (!v) return { required: true };
    const lenOk = v.length >= 8 && v.length <= 16;
    return (lenOk && lower.test(v) && upper.test(v) && digit.test(v) && special.test(v))
      ? null
      : { weak: true };
  };
};

export const matchValidator = (other: string): ValidatorFn => {
  return (c: AbstractControl): ValidationErrors | null => {
    const p = c.parent as any; if (!p) return null;
    const oc = p.get(other);
    return oc && c.value === oc.value ? null : { nomatch: true };
  };
};

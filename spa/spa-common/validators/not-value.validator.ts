import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const getCronString = require('@darkeyedevelopers/natural-cron.js');

export const notIdenticalTo =
  (confirmField: string): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    const cron = getCronString(value);
    console.log(cron, confirmField);

    return cron !== confirmField ? null : { identical: true };
  };

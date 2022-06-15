import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const getCronString = require('@darkeyedevelopers/natural-cron.js');

export const isNotTimeCron =
  (): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    const cron = getCronString(value) as string;
    const [minute, hour] = cron.split(' ');

    return minute === '*' && hour === '*' ? { isNotTimeCron: true } : null;
  };

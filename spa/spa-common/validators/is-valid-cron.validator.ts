import * as Cron from 'cron-converter';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { cleanCron } from '@util';

const getCronString = require('@darkeyedevelopers/natural-cron.js');

export const isValidCron =
  (): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    try {
      const cronString = cleanCron(getCronString(value) as string);
      console.log(cronString);
      const cronInstance = new Cron({
        timezone: 'Europe/London',
      });
      cronInstance.fromString(cronString);
      return null;
    } catch (e) {
      console.log('error', e);
      return { invalidCron: true };
    }
  };

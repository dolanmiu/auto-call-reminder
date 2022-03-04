import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MyAccountRoutingModule } from './my-account-routing.module';
import { MyAccountComponent } from './my-account.component';

@NgModule({
  declarations: [MyAccountComponent],
  imports: [CommonModule, MyAccountRoutingModule, ReactiveFormsModule],
})
export class MyAccountModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ModalModule, SharedModule } from '@shared';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';

@NgModule({
  declarations: [ConfigComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule,
  ],
})
export class ConfigModule {}

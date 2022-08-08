import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ModalModule, SharedModule } from '@shared';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { WhatsappSharedModule } from '../../whatsapp-shared/whatsapp-shared.module';

@NgModule({
  declarations: [ConfigComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule,
    WhatsappSharedModule,
  ],
})
export class ConfigModule {}

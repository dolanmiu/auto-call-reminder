import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhatsappIdToNamePipe } from './whatsapp-id-to-name.pipe';

@NgModule({
  declarations: [WhatsappIdToNamePipe],
  imports: [CommonModule],
  exports: [WhatsappIdToNamePipe],
})
export class WhatsappSharedModule {}

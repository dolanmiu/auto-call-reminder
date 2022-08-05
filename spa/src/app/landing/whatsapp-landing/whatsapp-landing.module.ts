import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeModule } from 'ng-qrcode';

import { WhatsappDashboardRoutingModule } from './whatsapp-landing-routing.module';
import { WhatsappLandingComponent } from './whatsapp-landing.component';
import { WhatsappAuthService } from './whatsapp-auth.service';
import { WhatsappAuthGuard } from './whatsapp-auth.guard';

@NgModule({
  declarations: [WhatsappLandingComponent],
  imports: [CommonModule, WhatsappDashboardRoutingModule, QrCodeModule],
  providers: [WhatsappAuthService, WhatsappAuthGuard],
})
export class WhatsappLandingModule {}

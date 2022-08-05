import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeModule } from 'ng-qrcode';

import { LinkingRoutingModule } from './linking-routing.module';
import { LinkingComponent } from './linking.component';

@NgModule({
  declarations: [LinkingComponent],
  imports: [CommonModule, LinkingRoutingModule, QrCodeModule],
})
export class LinkingModule {}

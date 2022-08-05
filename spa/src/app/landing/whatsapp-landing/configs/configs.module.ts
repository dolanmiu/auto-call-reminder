import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigsRoutingModule } from './configs-routing.module';
import { ConfigsComponent } from './configs.component';

@NgModule({
  declarations: [ConfigsComponent],
  imports: [CommonModule, ConfigsRoutingModule],
})
export class ConfigsModule {}

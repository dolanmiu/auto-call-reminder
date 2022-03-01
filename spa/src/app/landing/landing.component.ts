import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  public constructor(private readonly authService: AuthService) {}

  public signOut(): void {
    this.authService.signOut();
  }
}

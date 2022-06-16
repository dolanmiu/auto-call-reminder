import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public readonly loginForm: UntypedFormGroup;

  constructor(fb: UntypedFormBuilder, private readonly authService: AuthService) {
    this.loginForm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  public async login(): Promise<void> {
    if (!this.loginForm.valid) {
      return;
    }

    await this.authService.emailSignin(
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value
    );
  }
}

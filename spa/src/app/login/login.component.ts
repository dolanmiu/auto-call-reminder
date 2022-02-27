import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public readonly loginForm: FormGroup;

  constructor(fb: FormBuilder, private readonly authService: AuthService) {
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

    console.log('logging in', this.loginForm.value);
    await this.authService.emailSignin(
      this.loginForm.get('username')?.value,
      this.loginForm.get('password')?.value
    );
  }
}

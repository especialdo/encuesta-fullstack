import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { selectError, selectIsLoading } from '../../Store/auth/selector/auth.selector';
import { RegisterActions } from '../../Store/auth/actions/auth.actions';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pass = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  loading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      { validators: passwordMatchValidator },
    );
  }

  get passwordStrength(): number {
    const val = this.registerForm.get('password')?.value ?? '';
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  }

  get strengthLabel(): string {
    const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
    return labels[this.passwordStrength];
  }

  get strengthClass(): string {
    const classes = ['', 'weak', 'fair', 'good', 'strong'];
    return classes[this.passwordStrength];
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const { name, email, password } = this.registerForm.value;
    this.store.dispatch(RegisterActions.register({ name, email, password }));
  }

  getNameError(): string {
    const ctrl = this.registerForm.get('name');
    if (ctrl?.hasError('required')) return 'El nombre es obligatorio';
    if (ctrl?.hasError('minlength')) return 'Mínimo 3 caracteres';
    return '';
  }

  getEmailError(): string {
    const ctrl = this.registerForm.get('email');
    if (ctrl?.hasError('required')) return 'El correo es obligatorio';
    if (ctrl?.hasError('email')) return 'Ingresa un correo válido';
    return '';
  }

  getPasswordError(): string {
    const ctrl = this.registerForm.get('password');
    if (ctrl?.hasError('required')) return 'La contraseña es obligatoria';
    if (ctrl?.hasError('minlength')) return 'Mínimo 8 caracteres';
    if (ctrl?.hasError('pattern')) return 'Debe incluir letras y números';
    return '';
  }

  getConfirmPasswordError(): string {
    const ctrl = this.registerForm.get('confirmPassword');
    if (ctrl?.hasError('required')) return 'Confirma tu contraseña';
    if (this.registerForm.hasError('passwordMismatch')) return 'Las contraseñas no coinciden';
    return '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

export class RegisterRequestDto {
  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}
}

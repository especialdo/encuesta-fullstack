export class AuthResponseDto {
  token!: string;

  static fromJson(json: { access_token: string }): AuthResponseDto {
    const dto = new AuthResponseDto();
    dto.token = json.access_token;
    return dto;
  }
}

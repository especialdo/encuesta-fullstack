export class JwtPayloadDto {
  sub!: string;
  email!: string;
  name!: string;
  role!: string;
  iat!: number;
  exp!: number;

  static fromDecoded(decoded: Record<string, unknown>): JwtPayloadDto {
    const dto = new JwtPayloadDto();
    dto.sub = decoded['sub'] as string;
    dto.email = decoded['email'] as string;
    dto.name = decoded['name'] as string;
    dto.role = decoded['role'] as string;
    dto.iat = decoded['iat'] as number;
    dto.exp = decoded['exp'] as number;
    return dto;
  }
}

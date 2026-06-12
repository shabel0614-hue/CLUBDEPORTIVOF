export type UserRole = 'Admin' | 'Fundador' | 'Usuario';

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionalCode: string;
  memberType: string;
  academicUnit: string;
  profilePictureUrl: string;
  phoneNumber: string;
  foundedClubId?: string | null;
}

export interface LoginResponseDto {
  user: UserDto;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: string;
  institutionalCode: string;
  memberType: string;
  academicUnit: string;
}

export interface RefreshRequestDto {
  refreshToken: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  role?: UserRole;
  foundedClubId?: string | null;
}
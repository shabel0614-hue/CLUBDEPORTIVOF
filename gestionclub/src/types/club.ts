export interface ClubResponseDto {
  id: string;
  name: string;
  sportType: string;
  facultyOrArea: string;
  isApproved: boolean;
  logoUrl: string;
  description: string;
  address: string;
  maxCapacity: number;
  creationDate: string; // ISO Date
  founderId: string;
  founderName: string;
  memberCount?: number;
}

export interface CreateClubDto {
  name: string;
  sportType: string;
  facultyOrArea: string;
  logoUrl: string;
  description: string;
  address: string;
  maxCapacity: number;
}

export interface UpdateClubDto {
  name?: string;
  sportType?: string;
  facultyOrArea?: string;
  logoUrl?: string;
  description?: string;
  address?: string;
  maxCapacity?: number;
  memberCount?: number;
}
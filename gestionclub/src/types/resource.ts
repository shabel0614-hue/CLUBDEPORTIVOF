export interface ResourceResponseDto {
  id: string;
  name: string;
  type: string;
  totalQuantity: number;
  status: string;
  campus: string;
  inventoryCode: string;
  imageUrl: string;
  clubId: string;
  clubName: string;
}

export interface CreateResourceDto {
  name: string;
  type: string;
  totalQuantity: number;
  clubId: string;
  status: string;
  campus: string;
  inventoryCode: string;
  imageUrl: string;
}

export interface UpdateResourceDto {
  name?: string;
  type?: string;
  totalQuantity?: number;
  status?: string;
  campus?: string;
  inventoryCode?: string;
  imageUrl?: string;
}

export interface ResourceReservationDto {
  quantity: number;
}
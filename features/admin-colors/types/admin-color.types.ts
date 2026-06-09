export interface AdminColor {
  id: number;
  hex_code: string;
  is_active?: boolean | number;
}

export interface CreateColorPayload {
  hex_code: string;
  is_active?: boolean;
}

export interface UpdateColorPayload extends CreateColorPayload {}

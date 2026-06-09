import { UserColor } from '../types/user-colors.types';

export interface PresetColorOption {
  hex: string;
  name: string;
}

export const FALLBACK_PRESET_COLORS: PresetColorOption[] = [
  { hex: '#1DB7F0', name: 'Raiyansoft' },
  { hex: '#10B981', name: 'Teal' },
  { hex: '#FACC15', name: 'Gold' },
  { hex: '#8B5CF6', name: 'Purple' },
  { hex: '#EF4444', name: 'Red' },
  { hex: '#FFFFFF', name: 'White' },
];

export function mapUserColorsToPresetOptions(colors: UserColor[]): PresetColorOption[] {
  if (!colors.length) return FALLBACK_PRESET_COLORS;

  return colors.map((color) => ({
    hex: color.hex_code,
    name: color.hex_code,
  }));
}

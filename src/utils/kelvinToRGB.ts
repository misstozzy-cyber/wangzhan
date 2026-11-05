export interface KelvinColor {
  kelvin: number;
  r: number;
  g: number;
  b: number;
  hex: string;
  rgbString: string;
  label: string;
}

/**
 * Tanner Helland algorithm converting color temperature in Kelvin (1600K - 12000K)
 * to perceptual RGB values for diffused architectural LED lighting.
 */
export function kelvinToRGB(kelvin: number): KelvinColor {
  const clamped = Math.max(1600, Math.min(12000, Math.round(kelvin)));
  const temp = clamped / 100;

  let r: number;
  let g: number;
  let b: number;

  if (temp <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(temp) - 161.1195681661;
    if (temp <= 19) {
      b = 0;
    } else {
      b = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
    }
  } else {
    r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
    b = 255;
  }

  const clampByte = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const rByte = clampByte(r);
  const gByte = clampByte(g);
  const bByte = clampByte(b);

  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  const hex = `#${toHex(rByte)}${toHex(gByte)}${toHex(bByte)}`;

  let label = 'Warm White';
  if (clamped <= 1900) label = 'Amber Candle';
  else if (clamped <= 2500) label = 'Sunset Warm';
  else if (clamped <= 2850) label = 'Warm Architectural';
  else if (clamped <= 3200) label = 'Warm White';
  else if (clamped <= 3700) label = 'Neutral Warm';
  else if (clamped <= 4300) label = 'Natural White';
  else if (clamped <= 5500) label = 'Daylight White';
  else if (clamped <= 7000) label = 'Cool Daylight';
  else label = 'Sky / Polar Blue';

  return {
    kelvin: clamped,
    r: rByte,
    g: gByte,
    b: bByte,
    hex,
    rgbString: `${rByte}, ${gByte}, ${bByte}`,
    label,
  };
}

export const KELVIN_PRESETS = [
  { kelvin: 1800, short: '1800K', name: 'Amber' },
  { kelvin: 2400, short: '2400K', name: 'Extra Warm' },
  { kelvin: 2700, short: '2700K', name: 'Warm' },
  { kelvin: 3000, short: '3000K', name: 'Soft Warm' },
  { kelvin: 3500, short: '3500K', name: 'Neutral' },
  { kelvin: 4000, short: '4000K', name: 'Natural' },
  { kelvin: 5000, short: '5000K', name: 'Daylight' },
  { kelvin: 6500, short: '6500K', name: 'Cool' },
  { kelvin: 10000, short: '10000K', name: 'Arctic' },
];

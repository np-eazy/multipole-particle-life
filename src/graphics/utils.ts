export class Color {
    r: number;
    g: number;
    b: number;
    hex: string | undefined;

    constructor(r: number, b: number, g: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    set(r: number, b: number, g: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.hex = undefined;
    }

    add(r: number, b: number, g: number) {
        this.r += r;
        this.g += g;
        this.b += b;
        this.hex = undefined;
    }
    
    clamp() {
        this.r = Math.max(0, Math.min(255, this.r));
        this.g = Math.max(0, Math.min(255, this.g));
        this.b = Math.max(0, Math.min(255, this.b));
        return this;
    }


    toHex() {
        if (this.hex) {
            return this.hex;
        } else {
            this.hex = undefined;

        }
        const conv = (c: number) => c.toString(16).padStart(2, '0');
        return `#${conv(this.r)}${conv(this.g)}${conv(this.b)}`;
    }
}



export function hueToRgb(hue: number): Color {
    hue = hue % 360; // Ensure hue is within 0-360
    const c = 1; // Saturation and value are maxed out at 1 for full color
    const x = 1 - Math.abs((hue / 60) % 2 - 1);
    const m = 0; // RGB color model does not use a brightness component

    let r = 0, g = 0, b = 0;

    if (hue < 60) {
        r = c; g = x; b = 0;
    } else if (hue < 120) {
        r = x; g = c; b = 0;
    } else if (hue < 180) {
        r = 0; g = c; b = x;
    } else if (hue < 240) {
        r = 0; g = x; b = c;
    } else if (hue < 300) {
        r = x; g = 0; b = c;
    } else {
        r = c; g = 0; b = x;
    }

    // Convert to 0-255 range
    r = Math.floor((r + m) * 255);
    g = Math.floor((g + m) * 255);
    b = Math.floor((b + m) * 255);

    return new Color(r, g, b);
}

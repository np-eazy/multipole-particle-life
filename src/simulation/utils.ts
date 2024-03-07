export const normalize = (x: number[]): number[] => {
    const norm = Math.sqrt(x.reduce((prev, curr) => prev + curr * curr, 0));
    return x.map(x_i => x_i / norm);
}

export const randomUnitVector = (n: number): number[] => {
    let vector = Array.from({length: n}, () => gaussianRandom());
    const magnitude = Math.sqrt(vector.reduce((sum, component) => sum + component * component, 0));
    return vector.map(component => component / magnitude);
}

export const gaussianRandom = (): number => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export const angleBetweenUnitVectors = (v1: number[], v2: number[]): number => {
    const dotProduct = v1.reduce((sum, component, index) => sum + component * v2[index], 0);
    const angle = Math.acos(dotProduct);
    return angle;
}

export const getDistance = (v1: number[], v2: number[], square?: boolean): number => {
    const distSquared = v1.reduce((sum, component, index) => sum + (v2[index] - component) ** 2, 0);
    return square ? distSquared : Math.sqrt(distSquared);
}

export const randomNormal2D = (x: number, y: number, sigma: number = 1/3): number => {
    const factor = 1 / (2 * Math.PI * sigma * sigma);
    const exponent = -(x*x + y*y) / (2 * sigma * sigma);
    return factor * Math.exp(exponent);
}

export const sample2DGaussian = (sigma: number): number[] => {
    // Generate two uniform random numbers
    const u1 = Math.random();
    const u2 = Math.random();

    // Box-Muller transform
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    // Scale by the desired standard deviation (sigma)
    const x = z0 * sigma;
    const y = z1 * sigma;

    return [x, y];
}

export const secantApprox = (fn: Function, x: number, positiveOnly=false, h=1e-9, zeroLim = 1e-12) => {
    if (positiveOnly) {
        if (x > h/2) {
            return (fn(x + h/2) - fn(x - h/2)) / h;
        } else {
            return (fn(h + zeroLim) - fn(zeroLim)) / h; 
        }
    } else {
        return (fn(x + h/2) / fn(x - h/2)) / h;
    }
}

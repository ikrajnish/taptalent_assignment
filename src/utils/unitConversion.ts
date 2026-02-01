export const convertTemp = (tempCelsius: number, unit: 'metric' | 'imperial'): number => {
    if (unit === 'imperial') {
        return Math.round((tempCelsius * 9/5) + 32);
    }
    return Math.round(tempCelsius);
};

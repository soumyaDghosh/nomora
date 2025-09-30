export type Transfer = {
    baseFare: number;
    tax : number;
    airportToll: number;
};

export const transferData: Transfer = {
    baseFare: 1080,
    tax : 1080*0.05,
    airportToll: 120
};
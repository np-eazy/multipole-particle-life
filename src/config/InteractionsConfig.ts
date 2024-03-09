export const snake = (diversity: number, lambdaRepulsion: number, selfAttraction: number, couplingAttraction: number, couplingRepulsion: number): number[][] => {
    const allInteractions = [];
    for (let i = 0; i < diversity; i++) {
        const interactions = [];
        for (let j = 0; j < diversity; j++) {
            interactions.push(i == j ? selfAttraction :
                i == j + 1 ? couplingAttraction :
                i == j - 1 ? couplingRepulsion :
                lambdaRepulsion);
        }
        allInteractions.push(interactions);
    }
    return allInteractions;
}

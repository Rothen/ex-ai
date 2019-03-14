export interface AIAlgorithm<D, T> {
    learn(data: D): D;
    transform(data: D): T;
    learn_transform(data: D): T;
}

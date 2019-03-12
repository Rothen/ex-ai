import { Vector } from '../../type/Vector';

export abstract class DistanceCalculator {
    public abstract calculate(vectorA: Vector, vectorB: Vector): number;
}

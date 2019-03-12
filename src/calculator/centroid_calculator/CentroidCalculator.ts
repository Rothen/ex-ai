import { Vector } from '../../type/Vector';

export abstract class CentroidCalculator {
    public abstract calculate(vectors: Vector[]): Vector;
}

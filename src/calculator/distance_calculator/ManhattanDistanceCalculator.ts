import { DistanceCalculator } from './DistanceCalculator';
import { Vector } from '../../type/Vector';

export class ManhattanDistanceCalculator extends DistanceCalculator {
    public calculate(vectorA: Vector, vectorB: Vector): number {
        let sum = 0;

        for (let i = 0; i < vectorA.length; i++) {
            sum += vectorA[i] - vectorB[i];
        }
        return sum;
    }
}

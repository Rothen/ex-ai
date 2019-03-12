import { CentroidCalculator } from './CentroidCalculator';
import { Vector } from '../../type/Vector';

export class MedianCentroidCalculator extends CentroidCalculator {
    public calculate(vectors: Vector[]): Vector {
        const result: Vector = [];

        for (let i = 0; i < vectors.length; i++) {
            for (let j = 0; j < vectors[i].length; j++) {
                if (!result[j]) {
                    result[j] = 0;
                }
                result[j] += vectors[i][j];
            }
        }

        for (let k = 0; k < result.length; k++) {
            result[k] /= vectors.length;
        }

        return result;
    }
}

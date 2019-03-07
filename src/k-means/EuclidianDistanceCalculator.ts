import { DistanceCalculator } from './DistanceCalculator';
import { Point } from '@alkocats/ex-math';

export class EuclidianDistanceCalculator extends DistanceCalculator {
    public calculate(pointA: Point, pointB: Point): number {
        return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
    }
}

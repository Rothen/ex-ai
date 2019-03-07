import { DistanceCalculator } from './DistanceCalculator';
import { Point } from '@alkocats/ex-math';

export class ManhattanDistanceCalculator extends DistanceCalculator {
    public calculate(pointA: Point, pointB: Point): number {
        return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
    }
}

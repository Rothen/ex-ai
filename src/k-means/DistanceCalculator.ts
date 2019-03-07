import { Point } from '@alkocats/ex-math';

export abstract class DistanceCalculator {
    public abstract calculate(pointA: Point, pointB: Point): number;
}

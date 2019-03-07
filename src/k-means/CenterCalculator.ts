import { Point } from '@alkocats/ex-math';

export abstract class CenterCalculator {
    public abstract calculate(points: Point[]): Point;
}

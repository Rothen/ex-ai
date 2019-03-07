import { CenterCalculator } from './CenterCalculator';
import { Point } from '@alkocats/ex-math';

export abstract class SimpleCenterCalculator extends CenterCalculator {
    protected abstract exMathClass: any;
    protected abstract exMathFnName: string;

    public calculate(points: Point[]): Point {
        return this.exMathClass[this.exMathFnName].call(this.exMathClass, points, ['x', 'y']);
    }
}

import { SimpleCenterCalculator } from './SimpleCenterCalculator';
import { ExMath } from '@alkocats/ex-math';

export class AverageCenterCalculator extends SimpleCenterCalculator {
    protected exMathClass = ExMath;
    protected exMathFnName = 'average';
}

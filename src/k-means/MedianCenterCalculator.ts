import { SimpleCenterCalculator } from './SimpleCenterCalculator';
import { ExStat } from '@alkocats/ex-math';

export class MedianCenterCalculator extends SimpleCenterCalculator {
    protected exMathClass = ExStat;
    protected exMathFnName = 'median';
}

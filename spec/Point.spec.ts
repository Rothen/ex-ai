import { expect } from 'chai';
import { Point } from '../src';

describe('Point', () => {
    let point = new Point(0, 0);
    beforeEach(() => {
    });

    it('should be created', () => {
        expect(Point).to.be.ok;
    });
});

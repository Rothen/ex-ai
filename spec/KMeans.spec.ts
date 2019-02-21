import { expect } from 'chai';
import { KMeans } from '../src';

describe('KMeans', () => {
    let kMeans = new KMeans();
    beforeEach(() => {
    });

    it('should be created', () => {
        expect(kMeans).to.be.ok;
    });
});

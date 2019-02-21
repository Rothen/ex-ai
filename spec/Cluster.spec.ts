import { expect } from 'chai';
import { Cluster } from '../src';

describe('Cluster', () => {
    let cluster = new Cluster();
    beforeEach(() => {
    });

    it('should be created', () => {
        expect(cluster).to.be.ok;
    });
});

import { expect } from 'chai';
import { KMeans, Point, Cluster } from '../src';

describe('KMeans', () => {
    beforeEach(() => {
    });

    it('should be created', () => {
        const kMeans = new KMeans();
        expect(kMeans).to.be.ok;
    });

    it('should calculate k-Means with defined centers correctly', () => {
        const testPoints = [
            new Point(1, 1),
            new Point(1.5, 2),
            new Point(3, 4),
            new Point(5, 7),
            new Point(3.5, 5),
            new Point(4.5, 5),
            new Point(3.5, 4.5)
        ];
        const kMeans: KMeans = new KMeans(testPoints, 2, [new Point(1, 1), new Point(5, 7)]);
        const result = kMeans.start(20);
        const clusters: Cluster[] = result.clusters;

        expect(result.iterations).to.be.within(1, 4);

        expect(clusters).to.have.lengthOf(2);

        let clusterA: Cluster = clusters[0];
        let clusterB: Cluster = clusters[1];

        if (clusters[0].getCenter().x < 3) {
            clusterA = clusters[1];
            clusterB = clusters[0];
        }
        expect(clusterA.getCenter().x).to.equal(3.9);
        expect(clusterA.getCenter().y).to.equal(5.1);

        expect(clusterB.getCenter().x).to.equal(1.25);
        expect(clusterB.getCenter().y).to.equal(1.5);

        expect(clusterA.getPoints()).to.have.lengthOf(5);
        expect(clusterB.getPoints()).to.have.lengthOf(2);

        expect(clusterA.getPoints()[0].x).to.equal(3);
        expect(clusterA.getPoints()[0].y).to.equal(4);

        expect(clusterA.getPoints()[1].x).to.equal(5);
        expect(clusterA.getPoints()[1].y).to.equal(7);

        expect(clusterA.getPoints()[2].x).to.equal(3.5);
        expect(clusterA.getPoints()[2].y).to.equal(5);

        expect(clusterA.getPoints()[3].x).to.equal(4.5);
        expect(clusterA.getPoints()[3].y).to.equal(5);

        expect(clusterA.getPoints()[4].x).to.equal(3.5);
        expect(clusterA.getPoints()[4].y).to.equal(4.5);

        expect(clusterB.getPoints()[0].x).to.equal(1);
        expect(clusterB.getPoints()[0].y).to.equal(1);

        expect(clusterB.getPoints()[1].x).to.equal(1.5);
        expect(clusterB.getPoints()[1].y).to.equal(2);
    });

    /*
        File-Test
    */
});

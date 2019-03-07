import { Cluster } from '../Cluster';
import { Point } from '@alkocats/ex-math';
import { DistanceCalculator } from './DistanceCalculator';
import { CenterCalculator } from './CenterCalculator';
import { EuclidianDistanceCalculator } from './EuclidianDistanceCalculator';
import { AverageCenterCalculator } from './AverageCenterCalculator';
import { Thread } from '../Thread';

export class KMeans {
    private points: Point[];
    private clusters: Cluster[];
    private distanceCalculator: DistanceCalculator;
    private centerCalculator: CenterCalculator;
    private clusterCount: number;
    private minX: number;
    private minY: number;
    private maxX: number;
    private maxY: number;

    constructor(points: Point[] = [], clusterCount?: number, centers?: Point[]) {
        this.points = points;
        this.clusters = [];
        this.clusterCount = clusterCount;

        this.calculateBoundaries();
        this.setDistanceCalculator(new EuclidianDistanceCalculator());
        this.setCenterCalculator(new AverageCenterCalculator());
        this.generateStartingClusters(centers);
    }

    public getClusters(): Cluster[] {
        return this.clusters;
    }

    private generateStartingClusters(centers: Point[]) {
        if (centers) {
            if (centers.length !== this.clusterCount) {
                throw new Error('Number of centers must equal k');
            }

            this.generateStartingClustersByGivenCenters(centers);
        } else {
            this.generateStartingClustersByRandomCenters();
        }
    }

    private generateStartingClustersByGivenCenters(centers: Point[]) {
        for (let i = 0; i < this.clusterCount; i++) {
            const cluster = new Cluster();

            cluster.setCenter(centers[i]);
            this.clusters.push(cluster);
        }
    }

    private generateStartingClustersByRandomCenters() {
        for (let i = 0; i < this.clusterCount; i++) {
            const cluster = new Cluster();

            cluster.setRandomCenter(this.minX, this.minY, this.maxX, this.maxY);
            this.clusters.push(cluster);
        }
    }

    public setDistanceCalculator(distancecalculator: DistanceCalculator) {
        this.distanceCalculator = distancecalculator;
    }

    public setCenterCalculator(centerCalculator: CenterCalculator) {
        this.centerCalculator = centerCalculator;
    }

    public start(maxIterations: number): { clusters: Cluster[], iterations: number } {
        let centersHaveChanged = true;
        let iterations = 0;

        while (iterations < maxIterations && centersHaveChanged) {
            this.next();
            iterations++;
            centersHaveChanged = this.centersHaveChanged();
        }

        return {
            clusters: this.clusters,
            iterations: iterations
        };
    }

    private centersHaveChanged(): boolean {
        let centersHaveChanged = false;

        for (const cluster of this.clusters) {
            centersHaveChanged = centersHaveChanged || cluster.centerHasChanged();
        }

        return centersHaveChanged;
    }

    private next(): void {
        for (const cluster of this.clusters) {
            cluster.reset();
        }

        for (const point of this.points) {
            const nearestCluster = this.getNearesCluster(point);
            nearestCluster.addPoint(point);
        }

        for (const cluster of this.clusters) {
            const newCenter = this.centerCalculator.calculate(cluster.getPoints());
            cluster.setCenter(newCenter);
        }
    }

    private getNearesCluster(point: Point): Cluster {
        let assignedCluster = this.clusters[0];

        for (let i = 1; i < this.clusterCount; i++) {
            const cluster = this.clusters[i];
            const newDistance = this.distanceCalculator.calculate(point, cluster.getCenter());
            const currentDistance = this.distanceCalculator.calculate(point, assignedCluster.getCenter());

            if (newDistance <= currentDistance) {
                assignedCluster = cluster;
            }
        }

        return assignedCluster;
    }

    private calculateBoundaries() {
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;

        for (const point of this.points) {
            this.minX = Math.min(this.minX, point.x);
            this.minY = Math.min(this.minY, point.y);
            this.maxX = Math.max(this.maxX, point.x);
            this.maxY = Math.max(this.maxY, point.y);
        }
    }
}

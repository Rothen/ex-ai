import { Point } from './Point';
import { Cluster } from './Cluster';
import { K } from 'handlebars';

export class KMeans {
    private points: Point[];
    private clusters: Cluster[];
    private k: number;
    private minX: number;
    private minY: number;
    private maxX: number;
    private maxY: number;

    constructor(points?: Point[], k?: number, centers?: Point[]) {
        this.points = [];
        this.clusters = [];
        this.k = k;

        if (points) {
            this.points = points;
        }

        this.calculateBoundaries();

        if (centers && centers.length != k) {
            throw new Error('Number of centers must equal k');
        }

        for (let i = 0; i < k; i++) {
            const cluster = new Cluster();
            if (centers[i]) {
                cluster.setCenter(centers[i])
            } else {
                cluster.setRandomCenter(this.minX, this.minY, this.maxX, this.maxY);
            }
            this.clusters.push(cluster);
        }
    }

    public start(maxIterations: number): Cluster[] {
        let centersHaveChanged: boolean = true;

        while (maxIterations > 0 && centersHaveChanged) {
            this.next();
            maxIterations--;
            centersHaveChanged = this.centersHaveChanged();
        }

        return this.clusters;
    }

    private centersHaveChanged(): boolean {
        let centersHaveChanged = false;

        for (const cluster of this.clusters) {
            centersHaveChanged = centersHaveChanged || cluster.centerHasChanged();
        }

        return centersHaveChanged;
    }

    private next(): Point[] {
        for (const cluster of this.clusters) {
            cluster.reset();
        }

        for (const point of this.points) {
            let assignedCluster = this.clusters[0];

            for (let i = 1; i < this.k; i++) {
                const cluster = this.clusters[i];

                if (cluster.calculateDistance(point) <= assignedCluster.calculateDistance(point)) {
                    assignedCluster = cluster;
                }
            }

            assignedCluster.addPoint(point);
        }

        const recalculatedCenters: Point[] = [];

        for (const cluster of this.clusters) {
            recalculatedCenters.push(cluster.recalculateCenter());
        }

        return recalculatedCenters;
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

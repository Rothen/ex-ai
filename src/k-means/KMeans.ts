import { Cluster } from '../Cluster';
import { DistanceCalculator } from '../calculator/distance_calculator/DistanceCalculator';
import { CentroidCalculator } from '../calculator/centroid_calculator/CentroidCalculator';
import { EuclidianDistanceCalculator } from '../calculator/distance_calculator/EuclidianDistanceCalculator';
import { AverageCentroidCalculator } from '../calculator/centroid_calculator/AverageCentroidCalculator';
import { Algorithm } from '../Algorithm';
import { Vector } from '../type/Vector';
import { Matrix } from '../type/Matrix';

interface KMeansResult {
    clusters: Cluster[];
    iterations: number;
    meanSquaredError: number;
}

export class KMeans implements Algorithm<KMeansResult> {
    private vectors: Vector[] | Matrix;
    private clusters: Cluster[];
    private meanSquaredError: number;
    private distanceCalculator: DistanceCalculator;
    private centroidCalculator: CentroidCalculator;
    private clusterCount: number;
    public maxIterations = 100;

    constructor(vectors: Vector[] | Matrix = [], clusterCount?: number, centroids?: Vector[]) {
        this.vectors = vectors;
        this.clusters = [];
        this.clusterCount = clusterCount;

        this.setDistanceCalculator(new EuclidianDistanceCalculator());
        this.setCentroidCalculator(new AverageCentroidCalculator());
        this.kMeansPlusPlus();
    }

    public start(): KMeansResult {
        let centroidsHaveChanged = true;
        let iterations = 0;

        while (iterations < this.maxIterations && centroidsHaveChanged) {
            this.next();
            iterations++;
            centroidsHaveChanged = this.centroidsHaveChanged();
        }

        this.calculateMeanSquaredError();

        return {
            clusters: this.clusters,
            iterations: iterations,
            meanSquaredError: this.meanSquaredError
        };
    }

    public setDistanceCalculator(distancecalculator: DistanceCalculator) {
        this.distanceCalculator = distancecalculator;
    }

    public setCentroidCalculator(centroidCalculator: CentroidCalculator) {
        this.centroidCalculator = centroidCalculator;
    }

    public getClusters(): Cluster[] {
        return this.clusters;
    }

    public getMeanSquaredError(): number {
        return this.meanSquaredError;
    }

    private generateStartingClusters(centroids: Vector[]) {
        if (centroids) {
            if (centroids.length !== this.clusterCount) {
                throw new Error('Number of centroids must equal k');
            }

            this.generateStartingClustersByGivenCentroids(centroids);
        } else {
            this.generateStartingClustersByRandomCentroids();
        }
    }

    private kMeansPlusPlus() {
        let mean = this.vectors[Math.round(Math.random() * this.vectors.length - 1)];
        let newCluster = new Cluster();
        newCluster.setCentroid(mean);
        this.clusters.push(newCluster);

        for (let i = 1; i < this.clusterCount; i++) {
            let res;
            let high = -Infinity;

            for (const vector of this.vectors) {
                const nearest = this.getNearestCluster(vector);
                let dist = this.distanceCalculator.calculate(vector, nearest.getCentroid());

                if (dist > high) {
                    res = vector;
                    high = dist;
                }
            }

            newCluster = new Cluster();
            newCluster.setCentroid(res);
            this.clusters.push(newCluster);
        }
    }

    private generateStartingClustersByGivenCentroids(centroids: Vector[]) {
        for (let i = 0; i < this.clusterCount; i++) {
            const cluster = new Cluster();

            cluster.setCentroid(centroids[i]);
            this.clusters.push(cluster);
        }
    }

    private generateStartingClustersByRandomCentroids() {
        for (let i = 0; i < this.clusterCount; i++) {
            const cluster = new Cluster();
            const index = Math.round(Math.random() * this.vectors.length - 1);
            const centroid = this.vectors[index];

            cluster.setRandomCentroid(centroid);
            this.clusters.push(cluster);
        }
    }

    private calculateMeanSquaredError() {
        this.meanSquaredError = 0;

        for (const cluster of this.clusters) {
            for (const vector of cluster.getVectors()) {
                const centroid = cluster.getCentroid();
                const distance = this.distanceCalculator.calculate(vector, centroid);
                this.meanSquaredError += distance;
            }
        }

        this.meanSquaredError /= this.vectors.length;
    }

    private centroidsHaveChanged(): boolean {
        let centroidsHaveChanged = false;

        for (const cluster of this.clusters) {
            centroidsHaveChanged = centroidsHaveChanged || cluster.centroidHasChanged();
        }

        return centroidsHaveChanged;
    }

    private next(): void {
        for (const cluster of this.clusters) {
            cluster.reset();
        }

        for (const vector of this.vectors) {
            const nearestCluster = this.getNearestCluster(vector);
            nearestCluster.addVector(vector);
        }

        for (const cluster of this.clusters) {
            const newCentroid = this.centroidCalculator.calculate(cluster.getVectors());
            cluster.setCentroid(newCentroid);
        }
    }

    private getNearestCluster(vector: Vector): Cluster {
        let currentCluster = this.clusters[0];

        for (let i = 1; i < this.clusters.length; i++) {
            const cluster = this.clusters[i];
            const newDistance = this.distanceCalculator.calculate(vector, cluster.getCentroid());
            const currentDistance = this.distanceCalculator.calculate(vector, currentCluster.getCentroid());

            if (newDistance <= currentDistance) {
                currentCluster = cluster;
            }
        }

        return currentCluster;
    }

    public predict(vectors: Vector[] | Matrix): number[] {
        let result: number[] = [];

        for (const vector of vectors) {
            const nearestCluster = this.getNearestCluster(vector);
            result.push(this.clusters.indexOf(nearestCluster));
        }

        return result;
    }
}

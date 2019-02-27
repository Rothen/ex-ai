import * as fs from 'fs';
import { Cluster } from './Cluster';
import { ExMath, ExStat, Point } from '@alkocats/ex-math';

export abstract class DistanceCalculator {
    public abstract calculate(pointA: Point, pointB: Point): number;
}

export class EuclidianDistanceCalculator extends DistanceCalculator {
    public calculate(pointA: Point, pointB: Point): number {
        return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
    }
}

export class ManhattanDistanceCalculator extends DistanceCalculator {
    public calculate(pointA: Point, pointB: Point): number {
        return Math.abs(pointA.x - pointB.x) + Math.abs(pointA.y - pointB.y);
    }
}

export abstract class CenterCalculator {
    public abstract calculate(points: Point[]): Point;
}

export class AverageCenterCalculator extends CenterCalculator {
    public calculate(points: Point[]): Point {
        return ExMath.average(points, ['x', 'y']) as Point;
    }
}

export class MedianCenterCalculator extends CenterCalculator {
    public calculate(points: Point[]): Point {
        return ExStat.median(points, ['x', 'y']) as Point;
    }
}

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

    public exportMatlab(fileName: string): string {
        let result = '';
        let legend = [];
        for (let i = 0; i < this.clusters.length; i++) {
            const cluster = this.clusters[i];

            let clusterStr = `c_x${i} = ${cluster.getCenter().x};\nc_y${i} = ${cluster.getCenter().y};\n`;
            let clusterPointsXStr = `x${i} = [`;
            let clusterPointsYStr = `y${i} = [`;

            for (const point of cluster.getPoints()) {
                clusterPointsXStr += `${point.x} `;
                clusterPointsYStr += `${point.y} `;
            }

            clusterStr += `${clusterPointsXStr}];\n`;
            clusterStr += `${clusterPointsYStr}];\n`;
            clusterStr += `figure(1);\nhold on\nplot(x${i}, y${i}, 'x');\n`;
            clusterStr += `plot(c_x${i}, c_y${i}, 'o');\n`;

            result += clusterStr;
            legend.push(`Cluster ${i}`);
            legend.push(`Center ${i}`);
        }

        result += `legend('${legend.join(`', '`)}');`;

        fs.writeFileSync(fileName, result);

        return result;
    }
}

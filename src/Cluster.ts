import { Point } from './Point';

export class Cluster {
    private points: Point[];
    private center: Point;

    constructor() {
        this.points = [];
    }

    public addPoint(point: Point): void {
        this.points.push(point);
    }

    public removePoint(point: Point): Point {
        const index = this.points.indexOf(point);
        let pointToRemove: Point = null;

        if (index > -1) {
            pointToRemove = this.points[index];
            this.points.splice(index, 1);
        }

        return pointToRemove;
    }

    public setCenter(center: Point): void {
        this.center = center;
    }

    public getCenter(): Point {
        return this.center;
    }

    public calculateDistance(point: Point): number {
        return Math.sqrt(Math.pow(point.x - this.center.x, 2) + Math.pow(point.y - this.center.y, 2));
    }

    public reset() {
        this.points = [];
    }

    public recalculateCenter() {
        let sumX = 0;
        let sumY = 0;

        for (const point of this.points) {
            sumX += point.x;
            sumY += point.y;
        }

        this.center.x = sumX / this.points.length;
        this.center.y = sumY / this.points.length;
    }
}

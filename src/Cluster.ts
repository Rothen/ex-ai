import { ExMath, Point } from '@alkocats/ex-math';

export class Cluster {
    private points: Point[];
    private lastCenter: Point;
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
        this.lastCenter = this.center;
        this.center = center;
    }

    public getCenter(): Point {
        return this.center;
    }

    public getPoints(): Point[] {
        return this.points;
    }

    public setRandomCenter(minX: number, minY: number, maxX: number, maxY: number): Point {
        const x = (Math.random() * maxX) + minX;
        const y = (Math.random() * maxY) + minY;
        const center = {x: x, y: y};

        this.center = center;
        return center;
    }

    public reset() {
        this.points = [];
    }

    public recalculateCenter(): Point {
        let average = ExMath.average(this.points, ['x', 'y']) as {x: number, y: number};

        this.lastCenter = this.center;
        this.center = {x: average.x, y: average.y};

        return this.center;
    }

    public centerHasChanged(): boolean {
        return this.center.x !== this.lastCenter.x || this.center.y !== this.lastCenter.y;
    }
}

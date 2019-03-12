import { Vector } from './type/Vector';

export class Cluster {
    private vectors: Vector[];
    private lastCentroid: Vector;
    private centroid: Vector;

    constructor() {
        this.vectors = [];
    }

    public addVector(vector: Vector): void {
        this.vectors.push(vector);
    }

    public removeVector(vector: Vector): Vector {
        const index = this.vectors.indexOf(vector);
        let vectorToRemove: Vector = null;

        if (index > -1) {
            vectorToRemove = this.vectors[index];
            this.vectors.splice(index, 1);
        }

        return vectorToRemove;
    }

    public setCentroid(centroid: Vector): void {
        this.lastCentroid = this.centroid;
        this.centroid = centroid;
    }

    public getCentroid(): Vector {
        return this.centroid;
    }

    public getVectors(): Vector[] {
        return this.vectors;
    }

    public setRandomCentroid(centroid: Vector): Vector {
        this.centroid = centroid;
        return centroid;
    }

    public reset() {
        this.vectors = [];
    }

    public centroidHasChanged(): boolean {
        for (let i = 0; i < this.centroid.length; i++) {
            if (this.centroid[i] !== this.lastCentroid[i]) {
                return true;
            }
        }
        return false;
    }
}

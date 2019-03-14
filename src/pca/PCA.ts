import { Algorithm } from '../Algorithm';
import { SingularValueDecomposition } from 'ml-matrix';
import { Vector } from '../type/Vector';
import { Matrix } from '../type/Matrix';
import { AverageCentroidCalculator } from '../calculator/centroid_calculator/AverageCentroidCalculator';

interface EigenContainer {
    vector: Vector;
    value: number;
}

export class PCA implements Algorithm<void> {
    private vectors: Vector[] | Matrix;
    private eigenResults: EigenContainer[];
    private nComponents: number;
    private devSumOfSquares: Matrix;
    private varianceCovariance: Matrix;
    private eigenVectors: Vector[];
    private eigenValues: number[];

    constructor(vectors: Vector[] | Matrix) {
        this.vectors = vectors;
    }

    public start(): EigenContainer[] {
        this.computeDeviationMatrix();
        this.computeDeviationScores();
        this.computeVarianceCovariance(false);
        this.computeSVD();

        return this.eigenResults;
    }

    /**
     * The first step is to subtract the mean and center data
     *
     * @param {Array} matrix - data in an mXn matrix format
     * @returns
     */
    public computeDeviationMatrix() {
        const centroidCalculator = new AverageCentroidCalculator();
        const centroid = centroidCalculator.calculate(this.vectors);

        for (let i = 0; i < this.vectors.length; i++) {
            const vector = this.vectors[i];

            for (let c = 0; c < vector.length; c++) {
                vector[c] -= centroid[c];
            }
        }
    }
    /**
     * Computes variance from deviation
     *
     * @param {Array} deviation - data minus mean as calculated from computeDeviationMatrix
     * @returns
     */
    public computeDeviationScores() {
        this.devSumOfSquares = this.multiply(this.transpose(this.vectors as Matrix), this.vectors as Matrix);
    }
    /**
     * Calculates the let colet square matrix using either population or sample
     *
     * @param {Array} devSumOfSquares
     * @param {boolean} sample - true/false whether data is from sample or not
     * @returns
     */
    public computeVarianceCovariance(sample) {
        if (sample) {
            this.varianceCovariance = this.scale(this.devSumOfSquares, 1 / (this.devSumOfSquares.length - 1));
        } else {
            this.varianceCovariance = this.scale(this.devSumOfSquares, 1 / (this.devSumOfSquares.length));
        }
    }
    /**
     * Matrix is the deviation sum of squares as computed earlier
     *
     * @param {Array} matrix - output of computeDeviationScores
     * @returns
     */
    public computeSVD() {
        this.eigenResults = [];

        const svd = new SingularValueDecomposition(this.vectors as number[][], {
            computeLeftSingularVectors: false,
            computeRightSingularVectors: true,
            autoTranspose: true
        });

        const eigenVectors = svd.rightSingularVectors.to2DArray() as Vector[];
        const eigenValues = svd.diagonal;

        this.eigenResults = eigenValues.map((value, i) => {
            const eigenResult: EigenContainer = {
                value: value,
                vector: eigenVectors.map((eigenVector, j) => {
                    return eigenVector[i];
                })
            }

            return  eigenResult;
        });
    }

    public computeAdjustedData(selectedEigenResults: EigenContainer[]): Vector[] | Matrix {
        // FIXME no need to transpose vectors since they're already in row normal form
        let eigenVectors = selectedEigenResults.map(function(v) { return v.vector; });
        let adjustedData = this.multiply(eigenVectors as any as Matrix, this.transpose(this.vectors as Matrix));

        // adjustedData[1] = adjustedData[1].map((v: number) => v * -1);

        return adjustedData;
    }

    /**
     * Get original data set from reduced data set (decompress)
     * @param {*} adjustedData = formatted or unformatted adjusted data
     * @param {*} vectors = selectedVectors
     * @param {*} avgData = avgData
     */
    public computeOriginalData(adjustedData, vectors, avgData) {
        let originalWithoutMean = this.transpose(this.multiply(this.transpose(vectors), adjustedData));
        let originalWithMean = this.subtract(originalWithoutMean, avgData);
        let formattedData = originalWithMean;
        return {
            originalData: originalWithMean,
            formattedOriginalData: formattedData
        };
    }

    /**
     * Get percentage explained, or loss
     * @param {*} vectors
     * @param {*} selected
     */
    public computePercentageExplained(selected: EigenContainer[]) {
        let total = this.eigenResults.map(function (v: EigenContainer) {
            return v.value;
        }).reduce(function (a, b) {
            return a + b;
        });
        let explained = selected.map(function (v: EigenContainer) {
            return v.value;
        }).reduce(function (a, b) {
            return a + b;
        });

        return (explained * 100 / total);
    }

    public getEigenVectors(): Vector[] {
        return this.eigenVectors;
    }

    public getEigenValues(): number[] {
        return this.eigenValues;
    }

    public analyseTopResult() {
        this.computeSVD();
        const sorted = this.eigenResults.sort((containerA: EigenContainer, containerB: EigenContainer) => {
            return containerA.value - containerB.value;
        });

        const selected = (sorted[0] as any).vector;
        return this.computeAdjustedData(selected);
    }

    /**
     * Multiplies AxB, where A and B are matrices of nXm and mXn dimensions
     * @param {} matrixA
     * @param {*} matrixB
     */
    public multiply(matrixA: Matrix, matrixB: Matrix): Matrix {
        if (!matrixA[0] || !matrixB[0] || !matrixA.length || !matrixB.length) {
            throw new Error('Both A and B should be matrices');
        }

        if (matrixB.length !== matrixA[0].length) {
            throw new Error('Columns in A should be the same as the number of rows in B');
        }
        const product = [];

        for (let i = 0; i < matrixA.length; i++) {
            product[i] = [];
            for (let j = 0; j < matrixB[0].length; j++) {
                for (let k = 0; k < matrixA[0].length; k++) {
                    // tslint:disable-next-line:max-line-length
                    (product[i])[j] = !!(product[i])[j] ? (product[i])[j] + (matrixA[i])[k] * (matrixB[k])[j] : (matrixA[i])[k] * (matrixB[k])[j];
                }
            }
        }
        return product;
    }

    /**
     * Utility function to subtract matrix b from a
     *
     * @param {any} matrixA
     * @param {any} matrixB
     * @returns
     */
    public subtract(matrixA: Matrix, matrixB: Matrix): Matrix {
        if (!(matrixA.length === matrixB.length && matrixA[0].length === matrixB[0].length)) {
            throw new Error('Both A and B should have the same dimensions');
        }

        const result = [];
        for (let i = 0; i < matrixA.length; i++) {
            result[i] = [];
            for (let j = 0; j < matrixB[0].length; j++) {
                (result[i])[j] = (matrixA[i])[j] - (matrixB[i])[j];
            }
        }
        return result;
    }
    /**
     * Multiplies a matrix into a factor
     *
     * @param {any} matrix
     * @param {any} factor
     * @returns
     */
    public scale(matrix: Matrix, factor: number): Matrix {
        const result = [];
        for (let i = 0; i < matrix.length; i++) {
            result[i] = [];
            for (let j = 0; j < matrix[0].length; j++) {
                (result[i])[j] = (matrix[i])[j] * factor;
            }
        }
        return result;
    }

    /**
     * Generates a unit square matrix
     * @param {*} rows = number of rows to fill
     */
    public unitSquareMatrix(rows: number): Matrix {
        const result = [];
        for (let i = 0; i < rows; i++) {
            result[i] = [];
            for (let j = 0; j < rows; j++) {
                (result[i])[j] = 1;
            }
        }
        return result;
    }
    /**
     * Transposes a matrix, converts rows to columns
     * @param {*} matrix
     */
    public transpose(matrix: Matrix): Matrix {
        const operated = this.clone(matrix);
        return operated[0].map(function (m, c) {
            return matrix.map(function (r) {
                return r[c];
            });
        });
    }
    /**
     * Deep Clones a matrix
     * @param {*} arr
     */
    public clone(arr: Matrix): Matrix {
        const string = JSON.stringify(arr);
        const result = JSON.parse(string);
        return result;
    }
}

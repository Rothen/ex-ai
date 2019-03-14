import { Algorithm } from '../Algorithm';
import { SingularValueDecomposition } from 'ml-matrix';
import { Vector } from '../type/Vector';
import { Matrix } from '../type/Matrix';
import { AverageCentroidCalculator } from '../calculator/centroid_calculator/AverageCentroidCalculator';

interface EigenContainer {
    vector: Vector;
    value: number;
}

export class PCA {
    private eigenResults: EigenContainer[];
    private nComponents: number;
    private devSumOfSquares: Matrix;
    private varianceCovariance: Matrix;
    private eigenVectors: Vector[];
    private eigenValues: number[];
    private sumEigenValues;

    constructor() {
    }

    public learn(data: Matrix): EigenContainer[] {
        this.computeDeviationMatrix(data);
        this.computeDeviationScores(data);
        this.computeVarianceCovariance(false);
        this.computeSVD(data);

        return this.eigenResults;
    }

    public learnTransform(data: Matrix, dimensions: number): Vector[] | Matrix {
        this.learn(data);
        return this.transform(data, dimensions);
    }

    public learnTransformByPercentage(data: Matrix, percentage: number): Vector[] | Matrix {
        this.learn(data);
        return this.transformByPercentage(data, percentage);
    }

    public getEigenVectors(): Vector[] {
        return this.eigenVectors;
    }

    public getEigenValues(): number[] {
        return this.eigenValues;
    }

    public transform(data: Vector[] | Matrix, dimensions: number): Vector[] | Matrix {
        // FIXME no need to transpose vectors since they're already in row normal form
        const eigenMatrix: Matrix = this.eigenResults.slice(0, dimensions).map(function(v) { return v.vector; }) as any as Matrix;
        const adjustedData = this.multiply(eigenMatrix, this.transpose(data as Matrix));

        return adjustedData;
    }

    public transformByPercentage(data: Vector[] | Matrix, percentage: number): Vector[] | Matrix {
        percentage /= 100;
        let sumPercentage = 0;
        const eigenVectors = [];

        for (const eigenResult of this.eigenResults) {
            sumPercentage += eigenResult.value / this.sumEigenValues;
            eigenVectors.push(eigenResult.vector);

            if (sumPercentage >= percentage) {
                break;
            }
        }

        // FIXME no need to transpose vectors since they're already in row normal form
        const adjustedData = this.multiply(eigenVectors, this.transpose(data as Matrix));

        return adjustedData;
    }

    public getExplainedPercentagePerDimension(): Map<number, number> {
        const result = new Map<number, number>();
        let sumPercentage = 0;

        for (let i = 0; i < this.eigenResults.length; i++) {
            const eigenResult = this.eigenResults[i];
            sumPercentage += eigenResult.value / this.sumEigenValues;

            result.set(i + 1, sumPercentage * 100);
        }

        return result;
    }

    /**
     * The first step is to subtract the mean and center data
     *
     * @param {Array} matrix - data in an mXn matrix format
     * @returns
     */
    public computeDeviationMatrix(data: Matrix) {
        const centroidCalculator = new AverageCentroidCalculator();
        const centroid = centroidCalculator.calculate(data);

        for (let i = 0; i < data.length; i++) {
            const vector = data[i];

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
    public computeDeviationScores(data: Matrix) {
        this.devSumOfSquares = this.multiply(this.transpose(data), data);
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
    public computeSVD(data: Matrix) {
        this.eigenResults = [];
        this.sumEigenValues = 0;

        const svd = new SingularValueDecomposition(data as number[][], {
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
            };

            this.sumEigenValues += value;

            return  eigenResult;
        });
    }

    /**
     * Get original data set from reduced data set (decompress)
     * @param {*} adjustedData = formatted or unformatted adjusted data
     * @param {*} vectors = selectedVectors
     * @param {*} avgData = avgData
     */
    /*public computeOriginalData(adjustedData, vectors, avgData) {
        let originalWithoutMean = this.transpose(this.multiply(this.transpose(vectors), adjustedData));
        let originalWithMean = this.subtract(originalWithoutMean, avgData);
        let formattedData = originalWithMean;
        return {
            originalData: originalWithMean,
            formattedOriginalData: formattedData
        };
    }*/

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

import { TFIDFVectorizer } from './tf_idf/TFIDFVectorizer';
import * as Plotly from 'plotly';
import * as fs from 'fs';
import { KMeans } from './k-means/KMeans';
import { JSONParser } from './JSONParser';
import { KMeansExporter } from './KMeansExporter';
import { MedianCentroidCalculator } from './calculator/centroid_calculator/MedianCentroidCalculator';
import { PCA } from './pca/PCA';
import { Matrix } from './type/Matrix';
import { AverageCentroidCalculator } from './calculator/centroid_calculator/AverageCentroidCalculator';

export * from './k-means/KMeans';
export * from './Cluster';


const iris = JSON.parse(fs.readFileSync('iris.json').toString());
const matrix: Matrix = [];

for (const iri of iris) {
    matrix.push([
        iri.sepal_length,
        iri.sepal_width,
        iri.petal_length,
        iri.peatl_width
    ]);
}

const mean = new AverageCentroidCalculator().calculate(matrix);
const standardDeviation = [];


for (let c = 0; c < matrix[0].length; c++) {
    standardDeviation[c] = 0;

    for (let r = 0; r < matrix.length; r++) {
        standardDeviation[c] += Math.pow(matrix[r][c] - mean[c], 2);
    }

    standardDeviation[c] = Math.sqrt(1 * standardDeviation[c] / matrix.length);
}

for (let c = 0; c < matrix[0].length; c++) {
    for (let r = 0; r < matrix.length; r++) {
        matrix[r][c] = (matrix[r][c] - mean[c]) / standardDeviation[c];
    }
}

const pca = new PCA(matrix);
const result = pca.start();
const adjustedData = pca.computeAdjustedData([result[0], result[1]]);

const plotly = Plotly('DarkSephiroth', 'B1y6jFXsprLx9sjLadsg');
const plotData: Plotly.PlotData[] = [{
    x: adjustedData[0],
    y: adjustedData[1],
    type: 'scatter',
    mode: 'markers',
    name: 'Iris'
}];

const layout = { title: 'Hover over the points to see the text' };
const graphOptions = { layout: layout, filename: 'hover-chart-basic', fileopt: 'overwrite' };

plotly.plot(plotData, graphOptions, (err: string, msg: string) => {
    if (err) {
        return console.log(err);
    }

    console.log(msg);
});






/*class Matrix {
    private matrix: number[][];
    private rows: number;
    private columns: number;

    constructor(rows: number = 0, columns: number = 0) {
        if (rows > 0) {
            this.matrix = new Array<Array<number>>(rows);
            if (columns > 0) {
                for (let row = 0; row < rows; row++) {
                    this.matrix[row] = new Array<number>(columns);
                }
            }
        } else {
            this.matrix = new Array();
        }

        this.rows = rows;
        this.columns = columns;
    }

    public getData(): number[][] {
        return this.matrix;
    }
}

class Vector {
    private vector: number[];
    private type: 'column' | 'row';
    private length: number;

    constructor(length: number = 0, type: 'column' | 'row' = 'column') {
        this.length = length;
        this.type = type;

        if (length > 0) {
            this.vector = new Array<number>(length);
        } else {
            this.vector = new Array<number>();
        }
    }

    public getData(): number[] {
        return this.vector;
    }
}

const data = [[40, 50, 60], [50, 70, 60], [80, 70, 90], [50, 60, 80]];
const pca = new PCA(data);
const vectors = pca.start();
console.log(vectors);
console.log(pca.computePercentageExplained([vectors[0], vectors[1]]));
const computed = pca.computeAdjustedData([vectors[0], vectors[1]]);
console.log(computed);

const plotly = Plotly('DarkSephiroth', 'B1y6jFXsprLx9sjLadsg');
const plotData: Plotly.PlotData[] = [{
    x: [40, 50, 80, 70, 50],
    y: [50, 70, 70, 60],
    z: [60, 60, 90, 80],
    type: 'scatter3d',
    mode: 'markers',
    name: 'correct'
}, {
    x: computed.formattedAdjustedData[0],
    y: computed.formattedAdjustedData[1],
    type: 'scatter',
    mode: 'markers',
    name: 'predicted'
}];

const layout = { title: 'Hover over the points to see the text' };
const graphOptions = { layout: layout, filename: 'hover-chart-basic', fileopt: 'overwrite' };

plotly.plot(plotData, graphOptions, (err: string, msg: string) => {
    if (err) {
        return console.log(err);
    }

    console.log(msg);
});

/**/

/*console.log(`Parsing genres`);
const artist_to_genre = JSONParser.toMap('artist_to_genre.json');
console.log(`Parsing lyrics`);
const lyrics = JSONParser.toArray('artist_lyrics.json');

const artists = [];
const genres = [];

const yGenreIndizes = [];
const yGenres = [];


for (const artist of artist_to_genre.keys()) {
    artists.push(artist);
    if (genres.indexOf(artist_to_genre.get(artist)) === -1) {
        genres.push(artist_to_genre.get(artist));
    }
}

console.log(`Starting TF-IDF`);
const tf_idf = new TFIDFVectorizer(lyrics);
const tfIdfResult = tf_idf.start();
console.log(`Getting matrix`);
const fitted_matrix = tf_idf.getVectorizedResult();
// tf_idf.printMostImportant(1);

/*console.log(`Starting PCA`);
const PCA = require('ml-pca');
const pca = new PCA(tfIdfResult);
console.log(pca.getExplainedVariance());
/**/
/*const pca = new PCA(fitted_matrix);
const vectors = pca.start();
console.log(vectors[0]);
console.log(vectors[1]);
console.log(vectors[2]);
console.log(pca.computePercentageExplained(vectors, [vectors[0], vectors[1]]));
/**/
// console.log(pca.analyseTopResult());

/*console.log(`Fitting with K-Means`);
const kMeans = new KMeans(fitted_matrix, 10);
const result = kMeans.start();
console.log(`${result.iterations} iterations needed`);
const predictedGenreIndizes = kMeans.predict(fitted_matrix);
const correctGenreIndizes = [];

for (const artist of artist_to_genre.keys()) {
    correctGenreIndizes.push(genres.indexOf(artist_to_genre.get(artist)));
}

for (let i = 0; i < predictedGenreIndizes.length; i++) {
    yGenres[predictedGenreIndizes[i]] = yGenreIndizes[i];
}

const plotly = Plotly('DarkSephiroth', 'B1y6jFXsprLx9sjLadsg');
const data: Plotly.PlotData[] = [{
    x: artists,
    y: correctGenreIndizes,
    type: 'scatter',
    mode: 'markers',
    name: 'correct',
    text: yGenres
}, {
    x: artists,
    y: predictedGenreIndizes,
    type: 'scatter',
    mode: 'markers',
    name: 'predicted',
    text: yGenres
}];

const layout = { title: 'Hover over the points to see the text' };
const graphOptions = { layout: layout, filename: 'hover-chart-basic', fileopt: 'overwrite' };

plotly.plot(data, graphOptions, (err: string, msg: string) => {
    if (err) {
        return console.log(err);
    }

    console.log(msg);
});

/**/

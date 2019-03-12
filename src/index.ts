import * as fs from 'fs';
import { TFIDF } from './tf_idf/TF_IDF';
import * as Plotly from 'plotly';
import * as TPlotly from 'plotly.js';
import { ExMath } from '@alkocats/ex-math';
import { KMeans } from './k-means/KMeans';
import { JSONParser } from './JSONParser';
import { Vector } from './type/Vector';
import { KMeansExporter } from './KMeansExporter';

export * from './k-means/KMeans';
export * from './Cluster';

/*const training_data_set: Vector[] = JSON.parse(fs.readFileSync('training_data_set.json').toString());
const kMeanstraining_data_set = new KMeans(training_data_set, 20);
const exportertraining_data_set = new KMeansExporter('training_data_set.m', kMeanstraining_data_set);
kMeanstraining_data_set.start();
exportertraining_data_set.export();

const data: Vector[] = JSON.parse(fs.readFileSync('data.json').toString());
const kMeansdata = new KMeans(data, 15);
const exporterdata = new KMeansExporter('data.m', kMeansdata);
kMeansdata.start();
exporterdata.export();

const data2: Vector[] = JSON.parse(fs.readFileSync('data2.json').toString());
const kMeansdata2 = new KMeans(data2, 4);
const exporterdata2 = new KMeansExporter('data2.m', kMeansdata2);
kMeansdata2.start();
exporterdata2.export();*/

/**/


/*const data = [
    'Das rote Auto hält an der roten Ampel.',
    'Das grüne Auto hält an der grünen Ampel.'
];

const tf_idf = new TFIDF(data);
const tfIdfResult = tf_idf.start();
console.log(`Getting matrix`);
const fitted_matrix = tf_idf.getVectorizedResult();
tf_idf.printMostImportant();
console.log(fitted_matrix);

/**/

console.log(`Parsing genres`);
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
const tf_idf = new TFIDF(lyrics);
const tfIdfResult = tf_idf.start();
console.log(`Getting matrix`);
const fitted_matrix = tf_idf.getVectorizedResult();
console.log(fitted_matrix[0]);

console.log(`Fitting with K-Means`);
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

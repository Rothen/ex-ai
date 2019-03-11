import { Point } from '@alkocats/ex-math';
import { KMeans } from './k-means/KMeans';
import { KMeansExporter } from './KMeansExporter';
import * as fs from 'fs';
import { RAKE } from './rake/RAKE';
import { TF } from './rake/TF';
import { TFIDF } from './rake/TF_IDF';
import { CountVectorizer } from './rake/CountVectorizer';
import { TFIDFTransformer } from './rake/TFIDFTransformer';

export * from './k-means/KMeans';
export * from './Cluster';

/*const testPoints: Point[] = JSON.parse(fs.readFileSync('./data2.json').toString());

const kMeans: KMeans = new KMeans(testPoints, 4);
const result = kMeans.start();
const exporter = new KMeansExporter('test.m', kMeans);
exporter.export();*/


/*// tslint:disable-next-line: max-line-length
const text = 'LDA stands for Latent Dirichlet Allocation. As already mentioned it is one of the more popular topic models which was initially proposed by Blei, Ng and Jordan in 2003. It is a generative model which, according to Wikipedia, allows sets of observations to be explained by unobserved groups that explain why some parts of the data are similar.';

const rake = new RAKE(fs.readFileSync('text.txt').toString());
// console.log(rake.start());

const tf = new TF(fs.readFileSync('text.txt').toString());
tf.start();
// console.log(rake.start());*/

const artist_data = JSON.parse(fs.readFileSync('artist_data.json').toString());
let texts = [];

for (const key in artist_data) {
    if (artist_data.hasOwnProperty(key)) {
        texts.push(artist_data[key]);
    }
}

/*const texts = [
    'This is the first document.',
    'This document is the second document.',
    'And this is the third one.',
    'Is this the first document?',
];*/

const tf_idf = new TFIDF(texts);
const result = tf_idf.start();

const highestes = [];


for (const textMap of result) {
    const highest = [];

    for (const key of textMap.keys()) {
        highest.push({
            term: key,
            weight: textMap.get(key)
        });

        let smallest = {
            term: '',
            weight: Infinity
        };

        if (highest.length > 10) {
            for (const existingTerm of highest) {
                if (existingTerm.weight < smallest.weight) {
                    smallest = existingTerm;
                }
            }
            let index = highest.indexOf(smallest);

            if (index >= 0) {
                highest.splice(index, 1);
            }
        }
    }

    highestes.push(highest);
}

console.log(highestes[0]);

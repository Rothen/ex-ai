import { Point } from '@alkocats/ex-math';
import { KMeans } from './k-means/KMeans';
import { KMeansExporter } from './KMeansExporter';
import * as fs from 'fs';
import { RAKE } from './rake/RAKE';

export * from './k-means/KMeans';
export * from './Cluster';

/*const testPoints: Point[] = JSON.parse(fs.readFileSync('./data2.json').toString());

const kMeans: KMeans = new KMeans(testPoints, 4);
const result = kMeans.start();
const exporter = new KMeansExporter('test.m', kMeans);
exporter.export();*/


// tslint:disable-next-line: max-line-length
const text = 'LDA stands for Latent Dirichlet Allocation. As already mentioned it is one of the more popular topic models which was initially proposed by Blei, Ng and Jordan in 2003. It is a generative model which, according to Wikipedia, allows sets of observations to be explained by unobserved groups that explain why some parts of the data are similar.';


const fileData = fs.readFileSync('stop_words_en.txt').toString().split('\n');
const stopwordsList = [] || fileData;

const rake = new RAKE(text, stopwordsList);
// console.log(rake.start());


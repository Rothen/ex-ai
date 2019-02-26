export * from './KMeans';
export * from './Cluster';
import * as fs from 'fs';
import { KMeans, DistanceCalculator, AverageCenterCalculator, EuclidianDistanceCalculator } from './KMeans';
import * as cmd from 'node-cmd';
import { Point, ExMath } from '@alkocats/ex-math';
import { ReadResult } from 'fs-extra';


let asdf = new EuclidianDistanceCalculator();

fs.readFile('./data.json', 'utf8', function (err, contents) {
    const data = JSON.parse(contents) as Point[];

    const newDat = [];

    for (const point of data) {
        if (point.x < 470000 && point.x > 0 && point.y < 700000 && point.y > 250000) {
            newDat.push(point);
        }
    }

    const kMeans = new KMeans(newDat, 4, [
        {x: 0, y: 600000},
        {x: 0, y: 300000},
        {x: 500000, y: 600000},
        {x: 40000, y: 600000}
    ]);

    const result = kMeans.start(100);

    console.log(`Iteration count: ${result.iterations}`);

    for (let i = 0; i < result.clusters.length; i++) {
        const cluster = result.clusters[i];
        const center = cluster.getCenter();
        const pointsCount = cluster.getPoints().length;

        console.log(`Cluster center ${i + 1}: (${ExMath.round(center.x, 2)}, ${ExMath.round(center.y, 2)}), points: ${pointsCount}`);
    }

    kMeans.exportMatlab('export.m');
});

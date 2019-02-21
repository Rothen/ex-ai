export * from './KMeans';
export * from './Point';
export * from './Cluster';

import { Point } from './Point';
import { KMeans } from './KMeans';

const points = [
    new Point(1, 1),
    new Point(1.5, 2),
    new Point(3, 4),
    new Point(5, 7),
    new Point(3.5, 5),
    new Point(4.5, 5),
    new Point(3.5, 4.5),
];

const kMeans = new KMeans(points, 2);
console.log(kMeans.start(20));

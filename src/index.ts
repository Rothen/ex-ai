import { Worker } from 'worker_threads';
import { Thread } from './Thread';

export * from './k-means/KMeans';
export * from './Cluster';

const thread = new Thread();
thread.start();

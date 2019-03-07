import { ThreadData } from './ThreadData';
import { Thread } from './Thread';

export function runThread() {
    const workerData: ThreadData = require('worker_threads').workerData;
    const parentPort = require('worker_threads').parentPort;

    // You can do any heavy stuff here, in a synchronous way
    // without blocking the "main thread"
    parentPort.postMessage({ hello: workerData });
}

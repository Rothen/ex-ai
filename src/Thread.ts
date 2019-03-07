import { Worker, threadId } from 'worker_threads';
import { runThread } from './thread_runner';
import { KMeans } from './k-means/KMeans';

export class Thread {
    public async start(): Promise<any> {
        try {
            const result = await this.runService();
            console.log(result);
        } catch (e) {
            console.error(e);
        }
    }

    private async runService() {
        return new Promise((resolve, reject) => {
            const fn = this.getWorkerFn();
            console.log(KMeans.toString());
            const worker = new Worker(fn, { eval: true, workerData: {thread: this.constructor.name, data: 'something' }});

            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        });
    }

    private getWorkerFn(): string {
        let fn = runThread.toString().replace('function runThread() {', '');
        fn = fn.substring(0, fn.length - 1);

        return fn;
    }

    // public abstract run(): void;
}

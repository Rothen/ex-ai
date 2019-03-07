import * as fs from 'fs';
import { KMeans } from './k-means/KMeans';

export class KMeansExporter {
    private filename: string;
    private kMeans: KMeans;

    constructor(filename: string, kMeans: KMeans) {
        this.filename = filename;
        this.kMeans = kMeans;
    }

    public export(): string {
        const clusters = this.kMeans.getClusters();
        let result = '';
        let legend = [];

        for (let i = 0; i < clusters.length; i++) {
            const cluster = clusters[i];

            let clusterStr = `c_x${i} = ${cluster.getCenter().x};\nc_y${i} = ${cluster.getCenter().y};\n`;
            let clusterPointsXStr = `x${i} = [`;
            let clusterPointsYStr = `y${i} = [`;

            for (const point of cluster.getPoints()) {
                clusterPointsXStr += `${point.x} `;
                clusterPointsYStr += `${point.y} `;
            }

            clusterStr += `${clusterPointsXStr}];\n`;
            clusterStr += `${clusterPointsYStr}];\n`;
            clusterStr += `figure(1);\nhold on\nplot(x${i}, y${i}, 'x');\n`;
            clusterStr += `plot(c_x${i}, c_y${i}, 'o');\n`;

            result += clusterStr;
            legend.push(`Cluster ${i}`);
            legend.push(`Center ${i}`);
        }

        result += `legend('${legend.join(`', '`)}');`;

        fs.writeFileSync(this.filename, result);

        return result;
    }
}

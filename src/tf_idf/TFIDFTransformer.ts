import { CountVectorizer } from './CountVectorizer';

export class TFIDFTransformer {
    private countVectorizer: CountVectorizer;
    private idf: Map<string, number>;
    private tf_idf: Map<string, number>[];

    constructor(countVectorizer: CountVectorizer) {
        this.countVectorizer = countVectorizer;
    }

    public start(): Map<string, number>[] {
        this.calculateIDF();
        this.calculateTFIDF();

        return this.tf_idf;
    }

    public getTfIdf(): Map<string, number>[] {
        return this.tf_idf;
    }

    private calculateTFIDF() {
        this.tf_idf = [];
        let sum = [];

        for (let i = 0; i < this.countVectorizer.getTermFrequenciesCount(); i++) {
            sum[i] = 0;
            const map = new Map<string, number>();
            const termFrequency = this.countVectorizer.getTermFrequency(i);

            for (const term of termFrequency.keys()) {
                map.set(term, termFrequency.get(term) * this.idf.get(term));
                sum[i] += Math.pow(map.get(term), 2);
            }
            sum[i] = Math.sqrt(sum[i]);

            for (const term of map.keys()) {
                map.set(term, map.get(term) / sum[i]);
            }
            this.tf_idf[i] = map;
        }
    }

    private calculateIDF() {
        this.idf = new Map<string, number>();
        const df = this.countVectorizer.getDocumentFrequency();

        for (const term of df.keys()) {
            this.idf.set(term, Math.log((this.countVectorizer.getTermFrequenciesCount() + 1) / (1 + df.get(term))) + 1);
        }
    }
}

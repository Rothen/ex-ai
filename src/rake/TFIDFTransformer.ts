import { CountVectorizer } from './CountVectorizer';
import { stringify } from 'querystring';

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

    private calculateTFIDF() {
        this.tf_idf = [];

        for (let i = 0; i < this.countVectorizer.getRowCount(); i++) {
            const map = new Map<string, number>();
            const tf = this.countVectorizer.getRow(i);

            for (const term of tf.keys()) {
                map.set(term, tf.get(term) * this.idf.get(term));
            }

            this.tf_idf[i] = map;
        }
    }

    private calculateIDF() {
        this.idf = new Map<string, number>(this.countVectorizer.getTerms());

        for (const term of this.idf.keys()) {
            this.idf.set(term, Math.log((this.countVectorizer.getRowCount() + 1) / (1 + this.idf.get(term))) + 1);
        }
    }
}

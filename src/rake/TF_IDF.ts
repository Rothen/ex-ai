import { Algorithm } from '../Algorithm';
import { TextProcessing } from './TextProcessing';
import { TF } from './TF';

interface TFIDFResult {

}

export class TFIDF extends Algorithm<TFIDFResult> {
    private texts: string[];
    private termFrequency = {};
    private tfPerText: TF[];
    private idf: {};
    private tf_idf: {}[];

    constructor(texts: string[]) {
        super();
        this.texts = texts;
    }

    public start(): TFIDFResult {
        this.splitup();
        this.calculateIDF();
        this.calculateTFIDF();

        return this.tf_idf;
    }

    private calculateTFIDF() {
        this.tf_idf = [];

        for (let i = 0; i < this.texts.length; i++) {
            this.tf_idf[i] = {};
            const tf = this.tfPerText[i];
            const frequency = tf.getTermFrequency();

            for (const term in frequency) {
                if (!frequency.hasOwnProperty(term)) {
                    continue;
                }

                this.tf_idf[i][term] = frequency[term] * this.idf[term];
            }
        }
    }

    private calculateIDF() {
        this.idf = {};

        for (const term in this.termFrequency) {
            if (!this.termFrequency.hasOwnProperty(term)) {
                continue;
            }

            this.idf[term] = Math.log(this.texts.length / this.termFrequency[term]);
        }
    }

    private splitup() {
        this.termFrequency = {};
        this.tfPerText = [];

        for (let i = 0; i < this.texts.length; i++) {
            const text = this.texts[i];
            const tf = new TF(text);

            this.tfPerText[i] = tf;
            tf.start();
            const termFrequency = tf.getTermFrequency();

            for (const term in termFrequency) {
                if (!termFrequency.hasOwnProperty(term)) {
                    continue;
                }

                if (!this.termFrequency.hasOwnProperty(term)) {
                    this.termFrequency[term] = 0;
                }

                this.termFrequency[term] ++;
            }
        }
    }
}

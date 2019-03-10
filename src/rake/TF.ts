import { Algorithm } from '../Algorithm';
import { TextProcessing } from './TextProcessing';

interface TFResult {

}

export class TF extends Algorithm<TFResult> {
    private text: string;
    private terms: string[];
    private termFrequeny: {};
    private termSplitRegex = new RegExp(/((\b[^\s]+\b)((?<=\.\w).)?)/g);

    constructor(text: string) {
        super();
        this.text = text;
        this.text = TextProcessing.sanitizeText(text);
        this.terms = TextProcessing.splitTextIntoTerms(this.text);
    }

    public start(): TFResult {
        this.calculateTermFrequency();
        this.normalizeFrequency();

        return this.termFrequeny;
    }

    public getTermFrequency(): {} {
        return this.termFrequeny;
    }

    private calculateTermFrequency() {
        this.termFrequeny = {};

        for (const term of this.terms) {
            if (!this.termFrequeny.hasOwnProperty(term)) {
                this.termFrequeny[term] = 0;
            }

            this.termFrequeny[term]++;
        }
    }

    private normalizeFrequency() {
        for (const term in this.termFrequeny) {
            if (this.termFrequeny.hasOwnProperty(term)) {
                this.termFrequeny[term] = this.termFrequeny[term] / this.terms.length;
            }
        }
    }
}

import { Algorithm } from '../Algorithm';
import { TextProcessing } from '../rake/TextProcessing';

interface TFResult {

}

export class TF extends Algorithm<TFResult> {
    private text: string;
    private normalize: boolean;
    private terms: string[];
    private termFrequeny: Map<string, number>;
    private termSplitRegex = new RegExp(/((\b[^\s]+\b)((?<=\.\w).)?)/g);

    constructor(text: string, normalize: boolean = true) {
        super();
        this.text = text;
        this.text = TextProcessing.sanitizeText(text);
        this.terms = TextProcessing.splitTextIntoTerms(this.text);
    }

    public start(): Map<string, number> {
        this.calculateTermFrequency();
        if (this.normalize) {
            this.normalizeFrequency();
        }

        return this.termFrequeny;
    }

    public getTermFrequency(): Map<string, number> {
        return this.termFrequeny;
    }

    private calculateTermFrequency() {
        this.termFrequeny = new Map<string, number>();

        for (const term of this.terms) {
            if (!this.termFrequeny.has(term)) {
                this.termFrequeny.set(term, 0);
            }


            this.termFrequeny.set(term, this.termFrequeny.get(term) + 1);
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

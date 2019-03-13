import { TextProcessing } from '../rake/TextProcessing';
import { StoplistEN } from '../rake/stoplist_en';

export class TF {
    private text: string;
    private normalize: boolean;
    private termCount: number;
    private uniqueTermCount: number;
    private terms: string[];
    private termFrequeny: Map<string, number>;
    private stoplist: string[];
    private regex: RegExp;

    constructor(text: string, stoplist: string[] = StoplistEN) {
        this.text = TextProcessing.sanitizeText(text);
        this.terms = TextProcessing.splitTextIntoTerms(this.text);
        this.stoplist = stoplist;
        this.buildRegExp();
    }

    private buildRegExp() {
        const stoplist = this.stoplist.map(value => `\\b(${value})\\b`);
        this.regex = new RegExp(stoplist.join('|'), 'gi');
    }

    public getTermCount(): number {
        return this.termCount;
    }

    public getUniqueTermCount(): number {
        return this.uniqueTermCount;
    }

    public getTermFrequency(): Map<string, number> {
        return this.termFrequeny;
    }

    public start(): Map<string, number> {
        this.calculateTermFrequency();

        return this.termFrequeny;
    }

    private calculateTermFrequency() {
        this.termCount = 0;
        this.uniqueTermCount = 0;
        this.termFrequeny = new Map<string, number>();

        for (const term of this.terms) {
            if (term.match(this.regex) !== null) {
                continue;
            }

            if (term.match(RegExp(/\b\w\w+\b/)) == null) {
                continue;
            }

            if (!this.termFrequeny.has(term)) {
                this.uniqueTermCount++;
                this.termFrequeny.set(term, 0);
            }

            this.termCount++;
            this.termFrequeny.set(term, this.termFrequeny.get(term) + 1);
        }
    }
}

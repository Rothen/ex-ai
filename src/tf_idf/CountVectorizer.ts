import { TF } from './TF';
import { TextProcessing } from '../rake/TextProcessing';
import { Matrix } from '../type/Matrix';
import { StoplistEN } from '../rake/stoplist_en';

export class CountVectorizer {
    private texts: string[];
    private terms: Map<string, number>;
    private documentFrequency: Map<string, number>;
    private termFrequencies: Map<string, number>[];
    private stoplist: string[];
    private regex: RegExp;
    private tfs: TF[];
    private maxDocumentFrequency: number;

    constructor(texts: string[], stoplist: string[] = StoplistEN, maxDocumentFrequency: number = 1) {
        this.texts = texts;
        this.stoplist = stoplist;
        this.maxDocumentFrequency = maxDocumentFrequency;
        this.buildRegExp();
    }

    private buildRegExp() {
        const stoplist = this.stoplist.map(value => `\\b(${value})\\b`);
        this.regex = new RegExp(stoplist.join('|'), 'gi');
    }

    public getTerms(): Map<string, number> {
        return this.terms;
    }

    public getDocumentFrequency(): Map<string, number> {
        return this.documentFrequency;
    }

    public getTermFrequenciesCount(): number {
        return this.termFrequencies.length;
    }

    public getTermFrequency(i: number): Map<string, number> {
        return this.termFrequencies[i];
    }

    public getTF(i: number): TF {
        return this.tfs[i];
    }

    public start(): Matrix {
        this.fit();
        const matrix = this.transform();
        return matrix;
    }

    public getFeatureNames(): string[] {
        const result: string[] = [];

        for (const term of this.terms.keys()) {
            result.push(term);
        }

        return result;
    }

    private transform(): Matrix {
        let result: Matrix = [];

        for (let i = 0; i < this.termFrequencies.length; i++) {
            const termFrequency = this.termFrequencies[i];
            result[i] = [];

            for (const value of termFrequency.values()) {
                result[i].push(value);
            }
        }

        return result;
    }

    private fit() {
        this.terms = new Map<string, number>();
        this.documentFrequency = new Map<string, number>();
        this.termFrequencies = [];
        this.tfs = [];

        for (let i = 0; i < this.texts.length; i++) {
            const terms = TextProcessing.splitTextIntoTerms(TextProcessing.sanitizeText(this.texts[i]));

            for (const term of terms) {
                if (term.match(this.regex) !== null) {
                    continue;
                }

                if (term.match(RegExp(/\b\w\w+\b/)) == null) {
                    continue;
                }

                if (!this.terms.has(term)) {
                    this.terms.set(term, 0);
                }

                this.terms.set(term, this.terms.get(term) + 1);
            }
        }

        for (let i = 0; i < this.texts.length; i++) {
            const text = this.texts[i];
            const map = new Map<string, number>(this.terms);

            for (const key of map.keys()) {
                map.set(key, 0);
            }

            const tf = new TF(text, this.stoplist);
            this.tfs.push(tf);
            const frequency = tf.start();

            for (const term of frequency.keys()) {
                map.set(term, frequency.get(term));
                if (!this.documentFrequency.has(term)) {
                    this.documentFrequency.set(term, 0);
                }
                this.documentFrequency.set(term, this.documentFrequency.get(term) + 1);
            }
            this.termFrequencies.push(map);
        }

        for (const term of this.documentFrequency.keys()) {
            if (this.documentFrequency.get(term) / this.getTermFrequenciesCount() > this.maxDocumentFrequency) {
                this.documentFrequency.delete(term);
                this.terms.delete(term);

                for (const termFrequency of  this.termFrequencies) {
                    termFrequency.delete(term);
                }
            }
        }
    }
}

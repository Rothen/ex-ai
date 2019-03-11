import { TF } from "./TF";
import { TextProcessing } from "./TextProcessing";
import { stringify } from "querystring";
import { ENGINE_METHOD_PKEY_ASN1_METHS } from "constants";

export class CountVectorizer {
    private texts: string[];
    private terms: Map<string, number>;
    private termFrequencies: Map<string, number>[];

    constructor(texts: string[]) {
        this.texts = texts;
        // this.options = options;
    }

    public getTerms(): Map<string, number> {
        return this.terms;
    }

    public getRowCount(): number {
        return this.termFrequencies.length;
    }

    public getRow(i: number): Map<string, number> {
        return this.termFrequencies[i];
    }

    public start(): number[][] {
        this.splitup();

        return this.transform();
    }

    public getFeatureNames(): string[] {
        const result: string[] = [];

        for (const term of this.terms.keys()) {
            result.push(term);
        }

        return result;
    }

    private transform(): number[][] {
        let result: number[][] = [];

        for (let i = 0; i < this.termFrequencies.length; i++) {
            const frequency = this.termFrequencies[i];
            result[i] = [];

            for (const value of frequency.values()) {
                result[i].push(value);
            }
        }

        return result;
    }

    private splitup() {
        this.terms = new Map<string, number>();
        this.termFrequencies = [];

        for (let i = 0; i < this.texts.length; i++) {
            const terms = TextProcessing.splitTextIntoTerms(TextProcessing.sanitizeText(this.texts[i]));

            for (const term of terms) {
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

            const tf = new TF(text);
            const frequency = tf.start();

            for (const term of frequency.keys()) {
                map.set(term, frequency.get(term));
            }

            this.termFrequencies.push(map);
        }
    }
}

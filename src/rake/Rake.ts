import { Algorithm } from '../Algorithm';
import { StoplistEN } from './stoplist_en';

interface RAKEResult {

}

export class RAKE extends Algorithm<RAKEResult> {
    private text: string;
    private terms: string[];
    private stoplist: string[];
    private regex: RegExp;
    private termSplitRegex = new RegExp(/((\b[^\s]+\b)((?<=\.\w).)?)/g);

    private phrases: string[][];
    private frequencyCache: {};
    private degreeCache: {};
    private termScoreCache: {};

    constructor(text: string, stoplist: string[] = StoplistEN) {
        super();
        this.text = text;
        this.terms = this.text.match(this.termSplitRegex);
        this.stoplist = stoplist;
        this.buildRegExp();
    }

    public start() {
        this.buildRegExp();
        this.generatePhrases();
        this.calculateTermScore();

        return this.calculatePhraseScore();
    }

    private calculatePhraseScore() {
        const result = [];

        for (const phrase of this.phrases) {
            let score = 0;

            for (const term of phrase) {
                score += this.termScoreCache[term];
            }

            result.push({
                phrase: phrase.join(' '),
                score: score
            });
        }

        result.sort((phraseA, phraseB) => {
            if (phraseA.score < phraseB.score) {
                return 1;
            } else if (phraseA.score > phraseB.score) {
                return -1;
            } else {
                return 0;
            }
        });

        return result;
    }

    private calculateTermScore() {
        this.termScoreCache = {};

        for (const term in this.degreeCache) {
            if (this.degreeCache.hasOwnProperty(term)) {
                const degree = this.degreeCache[term];
                const frequency = this.frequencyCache[term];

                this.termScoreCache[term] = degree / frequency;
            }
        }
    }

    private buildRegExp() {
        const stoplist = this.stoplist.map(value => `\\b(${value})\\b`);
        this.regex = new RegExp(stoplist.join('|'), 'gi');
    }

    private generatePhrases() {
        this.phrases = [];
        this.frequencyCache = {};
        this.degreeCache = {};
        let phrase = [];

        for (const term of this.terms) {
            if (term.match(this.regex) !== null) {
                if (phrase.length > 0) {
                    this.phrases.push(phrase);
                }

                for (const phraseTerm of phrase) {
                    if (!this.degreeCache.hasOwnProperty(phraseTerm)) {
                        this.degreeCache[phraseTerm] = 0;
                    }

                    this.degreeCache[phraseTerm] += phrase.length;
                }

                phrase = [];
            } else {
                if (!this.frequencyCache.hasOwnProperty(term)) {
                    this.frequencyCache[term] = 0;
                }

                this.frequencyCache[term]++;
                phrase.push(term);
            }
        }
    }
}

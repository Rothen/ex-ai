import { Algorithm } from '../Algorithm';

interface RAKEResult {

}

export class RAKE extends Algorithm<RAKEResult> {
    private text: string;
    private words: string[];
    private stopWords: string[];
    private regex: string;
    private wordSplitRegex = new RegExp(/((\b[^\s]+\b)((?<=\.\w).)?)/g);

    constructor(text: string, stopWords: string[]) {
        super();
        this.text = text;
        this.words = this.text.match(this.wordSplitRegex);
        console.log(this.text);
        console.log(this.words);
        this.stopWords = stopWords;
        this.regex = this.buildRegex();
    }

    public start() {
        const sentenceList = this.splitTextToSentences(this.text);
        const phrasesList = this.generatePhrases(sentenceList);
        const wordScores = this.calculateKeywordScores(phrasesList);
        const phraseScores = this.calculatePhraseScores(phrasesList, wordScores);
        const result = this.sortPhrases(phraseScores);

        return result;
    }

    private buildRegex(): string {
        return this.stopWords.join('|');
    }

    private removeStopWords(sentence: string): string[] {
        const regExp = this.regex;
        const r = regExp.substring(0, regExp.length - 1);
        const reg = new RegExp(`\\b(?:${r})\\b`, 'ig');
        const filteredSentence = sentence.replace(reg, '|').split('|');

        return filteredSentence;
    }

    private splitTextToSentences(text: string): string[] {
        const sentences = text.match(/[^.!?:\\]+/g);
        const filteredSentences = sentences.filter(s => s.replace(/  +/g, '') !== '');

        return filteredSentences;
    }

    private generatePhrases(sentenceList: string[]): string[] {
        const reg = /['!"“”’#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~']/g;
        const phrases = sentenceList.map(s => this.removeStopWords(s));
        const phraseList = phrases.map(phrase => phrase
            .filter(phr => (phr.replace(reg, '') !== ' ' && phr.replace(reg, '') !== ''))
            .map(phr => phr.trim())
        );
        const flattenedList = [].concat(...phraseList);

        return flattenedList;
    }

    private calculateKeywordScores(phraseList: string[]): {} {
        const wordFreq = {};
        const wordDegree = {};
        const wordScore = {};

        phraseList.forEach((phrase) => {
            const wordList = phrase.match(/[,.!?;:/‘’“”]|\b[0-9a-z']+\b/gi);

            if (wordList) {
                const wordListDegree = wordList.length;
                wordList.forEach((word) => {
                    if (wordFreq[word]) {
                        wordFreq[word] += 1;
                    } else {
                        wordFreq[word] = 1;
                    }

                    if (wordDegree[word]) {
                        wordDegree[word] += wordListDegree;
                    } else {
                        wordDegree[word] = wordListDegree;
                    }
                });
            }
        });

        Object.values(wordFreq).forEach((freq: string) => { wordDegree[freq] += wordFreq[freq]; });
        Object.keys(wordFreq).forEach((i) => { wordScore[i] = wordDegree[i] / (wordFreq[i] * 1.0); });
        return wordScore;
    }

    private calculatePhraseScores(phraseList: string[], wordScore: {}): {} {
        const phraseScores = {};
        phraseList.forEach((phrase) => {
            phraseScores[phrase] = 0;
            let candidateScore = 0;
            const wordList = phrase.match(/(\b[^\s]+\b)/g);
            wordList.forEach((word) => { candidateScore += wordScore[word]; });
            phraseScores[phrase] = candidateScore;
        });
        return phraseScores;
    }

    private sortPhrases(obj: any): any {
        return Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
    }
}

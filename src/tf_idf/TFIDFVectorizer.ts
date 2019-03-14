import { Algorithm } from '../Algorithm';
import { CountVectorizer } from './CountVectorizer';
import { TFIDFTransformer } from './TFIDFTransformer';
import { Matrix } from '../type/Matrix';

interface TFIDFResult {

}

enum DecodeError {
    Strict = 1,
    Ignore,
    Replace
}

enum StripAccents {
    ASCII = 1,
    Unicode
}

enum Analyzer {
    Word = 1,
    Char,
    CharWB
}

enum StopWords {
    EN = 1,
    DE
}

enum Norm {
    l1 = 1,
    l2
}

abstract class TFIDFOptions {
    static encoding = 'utf-8';
    static decodeError: DecodeError = DecodeError.Strict;
    static stripAccents: StripAccents = null;
    static lowercase = true;
    static preprocessor: Function = null;
    static tokenizer: Function = null;
    static analyzer: Analyzer | Function;
    static stopWords: StopWords | string[];
    static tokenPattern: string;
    static ngramRange: { min: number, max: number } = { min: -Infinity, max: Infinity };
    static maxDf = 1;
    static minDf = 1;
    static maxFeatures: number = null;
    static vocabulary = null;
    static binary = false;
    static dtype = null;
    static norm: Norm = null;
    static useIDF = true;
    static smoothIDF = true;
    static sublinearTF = false;
}

export class TFIDFVectorizer implements Algorithm<TFIDFResult> {
    private texts: string[];
    private options: TFIDFOptions;
    private vectorizer: CountVectorizer;
    private tfidftransfomer: TFIDFTransformer;

    constructor(texts: string[], options: TFIDFOptions = TFIDFOptions) {
        this.texts = texts;
        this.options = options;
        this.vectorizer = new CountVectorizer(this.texts);
        this.tfidftransfomer = new TFIDFTransformer(this.vectorizer);
    }

    public start(): Map<string, number>[] {
        this.vectorizer.start();
        return this.tfidftransfomer.start();
    }

    public getVectorizedResult(): Matrix {
        const result: Matrix = [];
        const tfIdf = this.tfidftransfomer.getTfIdf();

        for (let i = 0; i < tfIdf.length; i++) {
            const row = tfIdf[i];
            result[i] = [];

            for (const value of row.values()) {
                result[i].push(value);
            }
        }

        const toSplice = [];

        for (let j = 0; j < result[0].length; j++) {
            let isNull = true;

            for (let k = 0; k < result.length; k++) {
                if (result[k][j] !== 0) {
                    isNull = false;
                }
            }

            if (isNull) {
                toSplice.push(j);
            }
        }

        for (let h = toSplice.length - 1; h >= 0; h--) {
            for (let k = 0; k < result.length; k++) {
                result[k].splice(toSplice[h], 1);
            }
        }

        return result;
    }

    public printMostImportant(n: number = 10): { term: string, weight: number }[][] {
        const result = [];
        let idf = this.tfidftransfomer.getTfIdf();

        for (const res of idf) {
            let highest = [];

            for (const key of res.keys()) {
                highest.push({
                    term: key,
                    weight: res.get(key)
                });

                if (highest.length > n) {
                    let smallest = {
                        term: '',
                        weight: Infinity
                    };

                    for (let a = 0; a < highest.length; a++) {
                        let dic = highest[a];

                        if (dic.weight < smallest.weight) {
                            smallest = dic;
                        }
                    }

                    highest.splice(highest.indexOf(smallest), 1);
                }
            }
            result.push(highest);
        }

        return result;
    }
}

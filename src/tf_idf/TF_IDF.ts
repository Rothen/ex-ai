import { Algorithm } from '../Algorithm';
import { TF } from './TF';
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

class TFIDFOptions {
    public encoding = 'utf-8';
    public decodeError: DecodeError = DecodeError.Strict;
    public stripAccents: StripAccents = null;
    public lowercase = true;
    public preprocessor: Function = null;
    public tokenizer: Function = null;
    public analyzer: Analyzer | Function;
    public stopWords: StopWords | string[];
    public tokenPattern: string;
    public ngramRange: { min: number, max: number } = { min: -Infinity, max: Infinity };
    public maxDf = 1;
    public minDf = 1;
    public maxFeatures: number = null;
    public vocabulary = null;
    public binary = false;
    public dtype?;
    public norm: Norm = null;
    public useIDF = true;
    public smoothIDF = true;
    public sublinearTF = false;
}

export class TFIDF extends Algorithm<TFIDFResult> {
    private texts: string[];
    private options: TFIDFOptions;
    private vectorizer: CountVectorizer;
    private tfidftransfomer: TFIDFTransformer;

    constructor(texts: string[], options: TFIDFOptions = new TFIDFOptions()) {
        super();
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

    public printMostImportant() {
        let idf = this.tfidftransfomer.getTfIdf();

        for (const res of idf) {
            let highest = [];

            for (const key of res.keys()) {
                highest.push({
                    term: key,
                    weight: res.get(key)
                });

                if (highest.length > 10) {
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

            console.log(highest);
        }
    }
}

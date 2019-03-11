import { Algorithm } from '../Algorithm';
import { TF } from './TF';
import { CountVectorizer } from './CountVectorizer';
import { TFIDFTransformer } from './TFIDFTransformer';

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
}

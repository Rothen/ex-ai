import { expect } from 'chai';
import { TFIDF } from '../../src/tf_idf/TFIDF';

describe('TFIDF', () => {
    beforeEach(() => {
    });

    it('should be created', () => {
        const tf_idf = new TFIDF([]);
        expect(tf_idf).to.be.ok;
    });

    it('should calculate tf-idf correctly', () => {
        const corpus = [
            'dada dada dada dun',
            'dada dada',
            'dada dada dada',
            'dada dada dada dada',
            'dada dada dada dan dan',
            'dada dada dada dun dun',
        ];

        const tf_idf = new TFIDF(corpus);
        tf_idf.start();
        const fitted_matrix = tf_idf.getVectorizedResult();

        expect(fitted_matrix).to.deep.equal([
            [ 0.85151334721046, 0.5243329281310096, 0 ],
            [ 1, 0, 0 ],
            [ 1, 0, 0 ],
            [ 1, 0, 0 ],
            [ 0.5542289327998063, 0, 0.8323642772534078 ],
            [ 0.63035730725644, 0.7763051366495072, 0 ]
        ]);
    });
});

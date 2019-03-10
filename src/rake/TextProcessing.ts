export abstract class TextProcessing {
    private static termSplitRegex = new RegExp(/((\b[^\s]+\b)((?<=\.\w).)?)/g);
    private static sentenceSplitRegex = new RegExp(/[\.\!]+\s*|\n+\s*/);

    public static splitTextIntoTerms(text: string): string[] {
        return text.match(this.termSplitRegex);
    }

    public static splitTextIntoSentences(text: string): string[] {
        return text.match(this.sentenceSplitRegex);
    }

    public static sanitizeText(text: string): string {
        return text.replace(/\([^)]*\) *| *\[[^)]*\]/g, '').toLowerCase().replace('\\n', ' ');
    }
}

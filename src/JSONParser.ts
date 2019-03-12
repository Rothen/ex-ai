import * as fs from 'fs';

export abstract class JSONParser {
    public static toMap(file: string): Map<string, string> {
        const result = new Map<string, string>();
        let data = JSON.parse(fs.readFileSync(file).toString());

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                result.set(key, data[key]);
                delete data[key];
            }
        }

        data = null;

        return result;
    }

    public static toArray(file: string): string[] {
        const result: string[] = [];
        let data = JSON.parse(fs.readFileSync(file).toString());

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                result.push(data[key]);
                delete data[key];
            }
        }

        return result;
    }
}

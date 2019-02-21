export abstract class ExMath {
    public static average(averageData: number[]): number;
    public static average<T, K extends Extract<keyof T, string>>(averageData: T[], propertyOrProperties?: K): number | object;
    public static average<T, K extends Extract<keyof T, string>>(averageData: T[], propertyOrProperties?: K[]): number | object;
    // tslint:disable-next-line:max-line-length
    public static average<T, K extends Extract<keyof T, string>>(averageData: T[] | number[], propertyOrProperties?: K | K[]): number | object {
            if (typeof propertyOrProperties === 'string') {
            return this.averageWithProperty(averageData as T[], propertyOrProperties);
        } else if (typeof propertyOrProperties === 'object') {
            return this.averageWithMultyProperty(averageData as T[], propertyOrProperties);
        } else {
            return this.averageWithoutProperty(averageData as number[]);
        }
    }

    public static sigma(averageData: number[]): number;
    public static sigma<T, K extends Extract<keyof T, string>>(averageData: T[], propertyOrProperties?: K): number | object;
    public static sigma<T, K extends Extract<keyof T, string>>(averageData: T[], propertyOrProperties?: K[]): number | object;
    public static sigma<T, K extends Extract<keyof T, string>>(sigmaData: T[] | number[], propertyOrProperties?: K | K[]): number | object {
        if (typeof propertyOrProperties === 'string') {
            return this.sigmaWithProperty(sigmaData as T[], propertyOrProperties);
        } else if (typeof propertyOrProperties === 'object') {
            return this.sigmaWithMultyProperty(sigmaData as T[], propertyOrProperties);
        } else {
            return this.sigmaWithoutProperty(sigmaData as number[]);
        }
    }

    public static median(medianData: number[]): number;
    public static median<T, K extends Extract<keyof T, string>>(medianData: T[], propertyOrProperties?: K): number | object;
    public static median<T, K extends Extract<keyof T, string>>(medianData: T[], propertyOrProperties?: K[]): number | object;
    // tslint:disable-next-line:max-line-length
    public static median<T, K extends Extract<keyof T, string>>(medianData: T[] | number[], propertyOrProperties?: K | K[]): number | object {
        let propertyOrPropertiesOrQ: any = propertyOrProperties;
        if (!propertyOrPropertiesOrQ) {
            propertyOrPropertiesOrQ = 50;
        }
        return this.percentile(medianData as any, propertyOrPropertiesOrQ, 50);
    }

    public static quartile1(quartileData: number[]): number;
    public static quartile1<T, K extends Extract<keyof T, string>>(quartileData: T[], propertyOrProperties?: K): number | object;
    public static quartile1<T, K extends Extract<keyof T, string>>(quartileData: T[], propertyOrProperties?: K[]): number | object;
    // tslint:disable-next-line:max-line-length
    public static quartile1<T, K extends Extract<keyof T, string>>(quartileData: T[] | number[], propertyOrProperties?: K | K[]): number | object {
        let propertyOrPropertiesOrQ: any = propertyOrProperties;
        if (!propertyOrPropertiesOrQ) {
            propertyOrPropertiesOrQ = 25;
        }
        return this.percentile(quartileData as any, propertyOrPropertiesOrQ, 25);
    }

    public static quartile2(quartileData: number[]): number;
    public static quartile2<T, K extends Extract<keyof T, string>>(quartileData: T[], propertyOrProperties?: K): number | object;
    public static quartile2<T, K extends Extract<keyof T, string>>(quartileData: T[], propertyOrProperties?: K[]): number | object;
    // tslint:disable-next-line:max-line-length
    public static quartile2<T, K extends Extract<keyof T, string>>(quartileData: T[] | number[], propertyOrProperties?: K | K[]): number | object {
        return this.median(quartileData as any, propertyOrProperties as any);
    }

    public static quartile3(quartileData: number[]): number;
    public static quartile3<T, K extends Extract<keyof T, string>>(quartileData: T[], propertyOrProperties?: K): number | object;
    public static quartile3<T, K extends Extract<keyof T, string>>(quartileData: T[], propertyOrProperties?: K[]): number | object;
    // tslint:disable-next-line:max-line-length
    public static quartile3<T, K extends Extract<keyof T, string>>(quartileData: T[] | number[], propertyOrProperties?: K | K[]): number | object {
        let propertyOrPropertiesOrQ: any = propertyOrProperties;
        if (!propertyOrPropertiesOrQ) {
            propertyOrPropertiesOrQ = 75;
        }
        return this.percentile(quartileData as any, propertyOrPropertiesOrQ, 75);
    }

    public static percentile(percentileData: number[], propertyOrPropertiesOrQ: number): number;
    // tslint:disable-next-line:max-line-length
    public static percentile<T, K extends Extract<keyof T, string>>(percentileData: T[], propertyOrPropertiesOrQ?: K, q?: number): number | object;
    // tslint:disable-next-line:max-line-length
    public static percentile<T, K extends Extract<keyof T, string>>(percentileData: T[], propertyOrPropertiesOrQ?: K[], q?: number): number | object;
    // tslint:disable-next-line:max-line-length
    public static percentile<T, K extends Extract<keyof T, string>>(percentileData: T[] | number[], propertyOrPropertiesOrQ?: K | K[] | number, q?: number): number | object {
        if (typeof propertyOrPropertiesOrQ === 'string') {
            return this.percentileWithProperty(percentileData as T[], propertyOrPropertiesOrQ, q);
        } else if (typeof propertyOrPropertiesOrQ === 'object') {
            return this.percentileWithMultyProperty(percentileData as T[], propertyOrPropertiesOrQ, q);
        } else {
            return this.percentileWithoutProperty(percentileData as number[], propertyOrPropertiesOrQ);
        }
    }

    private static averageWithoutProperty(averageData: number[]): number {
        const n = averageData.length;
        let average = 0;

        if (n > 0) {
            const sigma = this.sigmaWithoutProperty(averageData);
            average = sigma / n;
        }

        return average;
    }

    private static averageWithProperty<T, K extends Extract<keyof T, string>>(averageData: T[], property: K): number {
        const n = averageData.length;
        let average = 0;

        if (n > 0) {
            const sigma = this.sigmaWithProperty(averageData, property);
            average = sigma / n;
        }

        return average;
    }

    private static averageWithMultyProperty<T, K extends Extract<keyof T, string>>(averageData: T[], properties: K[]): object {
        const n = averageData.length;
        let averageObj = {};

        for (const property of properties) {
            averageObj[property as string] = 0;
        }


        if (n > 0) {
            const sigma = this.sigmaWithMultyProperty(averageData, properties);
            for (const property of properties) {
                averageObj[property as string] = sigma[property as string] / n;
            }
        }

        return averageObj;
    }

    private static sigmaWithoutProperty(sigmaData: number[]): number {
        let sum = 0;

        for (const data of sigmaData) {
            sum += data;
        }

        return sum;
    }

    private static sigmaWithProperty<T, K extends Extract<keyof T, string>>(sigmaData: T[], property: K): number {
        let sum = 0;

        for (const data of sigmaData) {
            sum += data[property as string];
        }

        return sum;
    }

    private static sigmaWithMultyProperty<T, K extends Extract<keyof T, string>>(sigmaData: T[], properties: K[]): object {
        let sumObj = {};
        for (const property of properties) {
            sumObj[property as string] = 0;
        }

        for (const data of sigmaData) {
            for (const property of properties) {
                sumObj[property as string] += data[property];
            }
        }

        return sumObj;
    }

    private static percentileWithoutProperty(percentileData: number[], q: number): number {
        const n = percentileData.length;
        const index = (n * q / 100) - 1;
        let percentile = 0;

        if (index % 1 === 0) {
            percentile = (percentileData[index] + percentileData[index + 1]) / 2;
        } else {
            percentile = percentileData[Math.ceil(index)];
        }

        return percentile;
    }

    private static percentileWithProperty<T, K extends Extract<keyof T, string>>(percentileData: T[], property: K, q: number): number {
        const n = percentileData.length;
        const index = (n * q / 100) - 1;
        const propertyName: string = property;
        let percentile = 0;

        if (n > 0) {
            if (index % 1 === 0) {
                percentile = (percentileData[index][propertyName] + percentileData[index + 1][propertyName]) / 2;
            } else {
                percentile = percentileData[Math.ceil(index)][propertyName];
            }
        }

        return percentile;
    }

    // tslint:disable-next-line:max-line-length
    private static percentileWithMultyProperty<T, K extends Extract<keyof T, string>>(percentileData: T[], properties: K[], q: number): object {
        const n = percentileData.length;
        const index = (n * q / 100) - 1;
        let percentile = {};

        if (n > 0) {
            for (const property of properties) {
                const propertyName: string = property;
                percentile[propertyName] = 0;

                if (n > 0) {
                    if (index % 1 === 0) {
                        percentile[propertyName] = (percentileData[index][propertyName] + percentileData[index + 1][propertyName]) / 2;
                    } else {
                        percentile[propertyName] = percentileData[Math.ceil(index)][propertyName];
                    }
                }
            }
        }

        return percentile;
    }
}

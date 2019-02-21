export abstract class ExMath {
    public static average(averageData: any[], propertyOrProperties?: string | string[]): number | object {
        if (typeof propertyOrProperties === 'string') {
            return this.averageWithProperty(averageData, propertyOrProperties);
        } else if (typeof propertyOrProperties === 'object') {
            return this.averageWithMultyProperty(averageData, propertyOrProperties);
        } else {
            return this.averageWithoutProperty(averageData);
        }
    }

    public static sigma(sigmaData: any[], propertyOrProperties?: string | string[]): number | object {
        if (typeof propertyOrProperties === 'string') {
            return this.sigmaWithProperty(sigmaData, propertyOrProperties);
        } else if (typeof propertyOrProperties === 'object') {
            return this.sigmaWithMultyProperty(sigmaData, propertyOrProperties);
        } else {
            return this.sigmaWithoutProperty(sigmaData);
        }
    }

    private static averageWithoutProperty(averageData: number[]): number {
        const n = averageData.length;
        let average = 0;

        if (n === 0) {
            let sigma = this.sigmaWithoutProperty(averageData);
            average = sigma / n;
        }

        return average;
    }

    private static averageWithProperty(averageData: number[], property: string): number {
        const n = averageData.length;
        let average = 0;

        if (n > 0) {
            let sigma = this.sigmaWithProperty(averageData, property);
            average = sigma / n;
        }

        return average;
    }

    private static averageWithMultyProperty(averageData: any[], properties: string[]): object {
        const n = averageData.length;
        let averageObj = {};

        for (const property of properties) {
            averageObj[property] = 0;
        }


        if (n > 0) {
            let sigma = this.sigmaWithMultyProperty(averageData, properties);
            for (const property of properties) {
                averageObj[property] = sigma[property] / n;
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

    private static sigmaWithProperty(sigmaData: any[], property: string): number {
        let sum = 0;

        for (const data of sigmaData) {
            sum += data[property];
        }

        return sum;
    }

    private static sigmaWithMultyProperty(sigmaData: any[], properties: string[]): object {
        let sumObj = {};
        for (const property of properties) {
            sumObj[property] = 0;
        }

        for (const data of sigmaData) {
            for (const property of properties) {
                sumObj[property] += data[property];
            }
        }

        return sumObj;
    }
}

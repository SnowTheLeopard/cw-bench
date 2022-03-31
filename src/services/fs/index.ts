import * as fs from 'fs';

export function readFile<T>(path: string): T {
    try {
        const data = fs.readFileSync(path, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        throw new Error("Failed to read/parse provided file");
    }
}

export function writeFile(filename: string, data: string): void {
    fs.writeFileSync(filename, data);
}

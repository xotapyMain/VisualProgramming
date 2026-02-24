import { readFile, writeFile } from 'node:fs/promises';

export { readFile, writeFile } from 'node:fs/promises';
export function csvToJSON(input: string[], delimeter: string) : object[] {
    if(input.length === 0) return [];
    const Header = input[0].split(delimeter);
    const result: any[] = [];
    for(let i = 1; i < input.length; i++){
        const values = input[i].split(delimeter);
        if(values.length !== Header.length){
            throw new Error('Mismaatch in parametr count at row ${i}');
        }
        const obj: Record<string, any> = {};
        Header.forEach((key,index) => {
            const val = values[index];
            const parsedValue = (val !== '' && !isNaN(Number(val))) ? Number(val) : val;
            obj[key] = parsedValue;
        });
        result.push(obj);
     }
     return result;
}

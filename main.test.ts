import { vi, describe, it, expect, beforeEach, Mocked } from 'vitest';
const mockedReadFile = vi.mocked(fs.readFile);
mockedReadFile.mockResolvedValue(mockCSV);


jest.mock('node:fs/promises');

describe('CSV to JSON Converter', () =>{
    describe('csvToJSON (Task 3)', () => {
        const input = ["p1;p2;p3;p4", "1;A;b;C", "2;b;v;d"];
        const expected = [
            {p1: 1, p2: 'A', p3: 'b', p4: 'C'}
            {p1: 2, p2: 'B', p3: 'v', p4: 'd'}
        ];
        expected(csvToJSON(input, ';')).toEqual(expected);
    });
    it('should throw Error when columns count mismatch', () => {
        const input = ["p1;p2", "a;1;2"];
        expect(() => csvToJSON(input, ';')).toThrow('Mismatch in parametr count');
    });
    describe('formatCSVFileToJSONFile ( Task 4)', () =>{
        const mockCSV = "id;name\n1;Dima";
        const expectedJSON = JSON.stringify([{id: 1, name: "Dima"}], null, 2);
        (fs.readFile as jest.Mock).mockResolvedValue(mockCSV);
        (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
        await formatCSVFileTiJSONFile('input.csv','utf-8');
        expect(fs.readFile).toHaveBeenCalledWith('input.csv','utf-8');
        expectedJSON(fs.writeFile).toHaveBeenCalled('output.json',expectedJSON);
    });
});

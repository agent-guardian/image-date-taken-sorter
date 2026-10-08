import { getDirByDate } from '../lib/lib.js';

let m = new Map([
    [new Date("2025-12-01T00:00:00"), "a"],
    [new Date("2015-12-16T00:00:00"), "b"],
    [new Date("2013-05-02T00:00:00"), "c"]]);

describe("getDirByDate", () => {
    test("Not in map", () => {
        expect(getDirByDate(m, new Date("2024-11-08T00:00:00")))
        .toBeNull();
    });

    test("In map", () => {
        expect(getDirByDate(m, new Date("2015-12-16T00:00:00")))
        .toBe("b");
    });
});
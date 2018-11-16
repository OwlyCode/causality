import Parser from "./Parser";
import World from "./World";

test("Ranges", () => {
  expect(Parser.validateValue(0, "[0 to 3]")).toBe(true);
  expect(Parser.validateValue(4, "[0 to 3]")).toBe(false);
  expect(Parser.validateValue(-5, "[-10 to 10]")).toBe(true);
  expect(Parser.validateValue(-15, "[-10 to 10]")).toBe(false);
});

test("pick()", () => {
    expect(Parser.validateValue("A", "pick(1): A, B, C")).toBe(true);
    expect(Parser.validateValue(["A"], "pick(1): A, B, C")).toBe(true);
    expect(Parser.validateValue([], "pick(1): A, B, C")).toBe(false);
    expect(Parser.validateValue(["A", "B"], "pick(1): A, B, C")).toBe(false);

    expect(Parser.validateValue(["A", "B"], "pick(2): A, B, C")).toBe(true);
    expect(Parser.validateValue(["A"], "pick(2): A, B, C")).toBe(false);
    expect(Parser.validateValue(["A", "B", "C"], "pick(2): A, B, C")).toBe(false);
    expect(Parser.validateValue("A", "pick(2): A, B, C")).toBe(false);

    expect(Parser.validateValue(["A"], "pick([0 to 2]): A, B, C")).toBe(true);
    expect(Parser.validateValue(["A", "B"], "pick([0 to 2]): A, B, C")).toBe(true);
    expect(Parser.validateValue([], "pick([0 to 2]): A, B, C")).toBe(true);
    expect(Parser.validateValue("A", "pick([0 to 2]): A, B, C")).toBe(true);
    expect(Parser.validateValue(["A", "B", "C"], "pick([0 to 2]): A, B, C")).toBe(false);
});

test("pick_feature()", () => {
    expect(Parser.validateValue(["feature"], "pick_feature(1): A, B, C")).toBe(true);
    expect(Parser.validateValue([["feature"]], "pick_feature(1): A, B, C")).toBe(true);
    expect(Parser.validateValue([], "pick_feature(1): A, B, C")).toBe(false);
    expect(Parser.validateValue([["feature"], ["feature"]], "pick_feature(1): A, B, C")).toBe(false);
});

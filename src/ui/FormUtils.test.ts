import Feature from "../core/Feature";
import { featureToSelect, pickToSelect, selectToValue } from "./FormUtils";

test("pickToSelect", () => {
  expect(pickToSelect(["A"], true)).toEqual([{ label: "A", value: "A" }]);
  expect(pickToSelect(["A", "B"], true)).toEqual([{ label: "A", value: "A" }, { label: "B", value: "B" }]);
  expect(pickToSelect("A", true)).toEqual([{ label: "A", value: "A" }]);
  expect(pickToSelect(null, true)).toEqual([]);

  expect(() => pickToSelect(["A"], false)).toThrow("Unexpected array on non multiple select.");
  expect(pickToSelect("A", false)).toEqual({ label: "A", value: "A" });
  expect(pickToSelect(null, false)).toEqual({ label: "none", value: null });
});

test("featureToSelect", () => {
  const A = new Feature("A", ["A1", "A2"]);
  const B = new Feature("B", ["B1", "B2"]);

  expect(featureToSelect([A], true)).toEqual([{ label: "A", value: A }]);
  expect(featureToSelect([A, B], true)).toEqual([{ label: "A", value: A }, { label: "B", value: B }]);
  expect(featureToSelect(A, true)).toEqual([{ label: "A", value: A }]);
  expect(featureToSelect(null, true)).toEqual([]);

  expect(() => featureToSelect(["A"], false)).toThrow("Unexpected array on non multiple select.");
  expect(featureToSelect(A, false)).toEqual({ label: "A", value: A });
  expect(featureToSelect(null, false)).toEqual({ label: "none", value: null });
});

test("selectToValue", () => {
  expect(selectToValue({label: "A", value: "A"})).toEqual("A");
  expect(selectToValue({label: "none", value: null})).toEqual(null);
  expect(selectToValue([{label: "A", value: "A"}])).toEqual("A");
  expect(selectToValue([{label: "A", value: "A"}, {label: "B", value: "B"}])).toEqual(["A", "B"]);
  expect(selectToValue([])).toEqual(null);
  expect(selectToValue(null)).toEqual(null);
});

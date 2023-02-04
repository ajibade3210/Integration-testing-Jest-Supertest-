test("arithmetic", function () {
  expect(4 + 4).toBeGreaterThan(7);
  expect(4 + 4).toBeLessThan(9);
});

// only
test("references", function () {
  var arr = [1, 2, 3];
  expect(arr).toEqual([1, 2, 3]);
  expect(arr).not.toBe([1, 2, 3]); // since === doesn't do deep comparison!
  expect(arr).toContain(1);
});

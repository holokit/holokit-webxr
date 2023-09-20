import XRRay from '../../src/api/XRRay';

describe('API - XRRay', () => {
  test('defaults to <0,0,0> origin, <0,0,-1> direction', () => {
    const ray = new XRRay();
    expect(ray.origin.x).toBe(0);
    expect(ray.origin.y).toBe(0);
    expect(ray.origin.z).toBe(0);
    expect(ray.origin.w).toBe(1);
    expect(ray.direction.x).toBe(0);
    expect(ray.direction.y).toBe(0);
    expect(ray.direction.z).toBe(-1);
    expect(ray.direction.w).toBe(0);
    expect(ray.matrix.length).toBe(16);
  });

  test('throws if modifying any property', () => {
    const ray = new XRRay();
    expect(() => ray.origin = new DOMPointReadOnly(0, 0, 0, 1)).toThrow();
    expect(() => ray.direction = new DOMPointReadOnly(0, 0, -1, 0)).toThrow();
    expect(() => ray.matrix = new Float32Array()).toThrow();
  });

  it('throws if given non-expected types', () => {
    const args = [
      null,
      20,
      'hello',
      {}
    ];
    for (let arg of args) {
      assert.throws(() => new XRRay(arg, new DOMPointReadOnly(0, 0, -1, 0), new Float32Array(16)));
      assert.throws(() => new XRRay(new DOMPointReadOnly(0, 0, 0, 1), arg, new Float32Array(16)));
      assert.throws(() => new XRRay(new DOMPointReadOnly(0, 0, 0, 1), new DOMPointReadOnly(0, 0, -1, 0), arg));
    }
  });
});

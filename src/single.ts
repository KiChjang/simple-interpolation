/** Point Interface */
interface Point {
  x: number;
  y: number;
}

/** Params Interface */
interface Params {}

/** X Interface extends Params Interface */
interface X extends Params {
  y: number;
}

/** Y Interface extends Params Interface */
interface Y {
  x: number;
}

/**
 * Format matrix points to simple structure points
 * @param {string} params interpolation params
 * @param {string} points interpolation matrix
 * @return {array} formatted points
 */
function format(params: X | Y, points: Point[]): [number, number[][]] {
  if ("x" in params) {
    points.sort((a: Point, b: Point): number => a.x - b.x);
    return [params.x, points.map((i: Point): number[] => [i.x, i.y])];
  }

  if ("y" in params) {
    points.sort((a: Point, b: Point): number => a.y - b.y);
    return [params.y, points.map((i: Point): number[] => [i.y, i.x])];
  }

  throw new Error("Can't calculate single interpolation");
}

/**
 * Single interpolation store
 * @param {string} points interpolation matrix data
 * @return {void} interpolation execut method
 */
export function single(points: Point[]): (params: X | Y) => number {
  if (points.length <= 1) {
    throw new Error("Can't calculate single interpolation, please provide more points");
  }

  return (params: X | Y): number => {
    const [c, p] = format(params, points);
    const n = points.length - 1;

    if (c <= p[0][0]) {
      return p[0][1] + (c - p[0][0]) * (p[1][1] - p[0][1]) / (p[1][0] - p[0][0]);
    }

    if (c >= p[n][0]) {
      return p[n][1] + (c - p[n][0]) * (p[n][1] - p[n - 1][1]) / (p[n][0] - p[n - 1][0]);
    }

    for (let i = 0; i < n; i += 1) {
      if (c > p[i][0] && c <= p[i + 1][0]) {
        return p[i][1] + (c - p[i][0]) * (p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]);
      }
    }

    throw new Error("Can't calculate single interpolation");
  };
}

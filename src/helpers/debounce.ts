/* eslint-disable @typescript-eslint/no-explicit-any */
function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeout);
    // @ts-expect-error: Thời gian chờ được gán một giá trị từ setTimeout, mà TypeScript không thể suy ra chính xác ở đây.
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default debounce;

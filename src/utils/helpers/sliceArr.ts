export function sliceArr<T>(array: T[], size): [[T]] {
  const subarray = [];

  for (let i = 0; i < Math.ceil(array.length / size); i++) {
    subarray[i] = array.slice(i * size, i * size + size);
  }

  return <[[T]]>subarray;
}

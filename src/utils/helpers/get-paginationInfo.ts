type Value = {
  value: number;
  default: number;
};

export function getPaginationInfo(
  { value: offset, default: defaultOffset = 0 }: Value,
  { value: limit, default: defaultLimit = 10 }: Value
): { offset: number; limit: number } {
  const newOffset = !+offset || offset < 0 ? defaultOffset : +offset;
  const newLimit = !+limit || limit < 1 ? defaultLimit : +limit;

  return {
    offset: newOffset,
    limit: newLimit,
  };
}

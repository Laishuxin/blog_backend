export const deleteProperties = <T = Object>(
  obj: T,
  ...properties: (keyof T)[]
) => {
  for (const property of properties) {
    if (obj[property]) delete obj[property];
  }
};

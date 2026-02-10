const flatten = (data: unknown): Record<string, unknown> => {
  const result: Record<string, unknown> = {};

  const recurse = (cur: unknown, prop: string) => {
    if (Object(cur) !== cur) {
      result[prop] = cur as unknown;
    } else if (Array.isArray(cur)) {
      for (let i = 0, length = cur.length; i < length; i += 1) {
        recurse(cur[i], `${prop}[${i}]`);
      }
      if (cur.length === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      for (const key in cur as Record<string, unknown>) {
        isEmpty = false;
        recurse(
          (cur as Record<string, unknown>)[key],
          prop ? `${prop}.${key}` : key,
        );
      }
      if (isEmpty && prop) result[prop] = {};
    }
  };

  recurse(data, "");
  return result;
};

export default flatten;

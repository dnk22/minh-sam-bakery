/** Independent operations keep the loader active until every token is released. */
export function createLoadingOperations(onChange: (activeCount: number) => void) {
  const tokens = new Set<symbol>();

  function begin() {
    const token = Symbol("page-loading");
    tokens.add(token);
    onChange(tokens.size);
    return () => {
      if (tokens.delete(token)) onChange(tokens.size);
    };
  }

  async function run<T>(operation: () => Promise<T>): Promise<T> {
    const release = begin();
    try { return await operation(); }
    finally { release(); }
  }

  return { begin, run };
}

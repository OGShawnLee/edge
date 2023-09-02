type Result<Data, Error> = { failed: false, data: Data } | { failed: true, error: Error }

export async function use_await<Data, Error>(fn: () => Promise<Data>): Promise<Result<Data, Error>> {
  try {
    return { failed: false, data: await fn() }
  } catch (error) {
    return { failed: true, error: error as Error }
  }
}

export function use_catch<Data, Error>(fn: () => Data): Result<Data, Error> {
  try {
    return { failed: false, data: fn() }
  } catch (error) {
    return { failed: true, error: error as Error }
  }
}
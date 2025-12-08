
export const API_BASE = "http://localhost:3000";

export async function fetchJSON(url, opts = {}) {
  const res = await fetch(API_BASE + url, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    ...opts,
  });
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : {};
    if (!res.ok) {
      const err = new Error(data?.message || data?.errorMessage || "API error");
      err.status = res.status;
      err.payload = data;
      throw err;
    }
    return data;
  } catch (e) {
    if (e instanceof SyntaxError) {
         if (!res.ok) throw new Error("API error");
      return text;
    }
    throw e;
  }
}

export async function fetchAuthJSON(url, token, opts = {}) {
  return fetchJSON(url, {
    ...opts,
    headers: {
      ...(opts.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
}

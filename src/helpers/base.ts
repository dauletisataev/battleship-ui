export interface NonceManager {
  get: () => number;
  set: (nonce: number) => void;
}

export type JsonRpcResponse = {
  result?: any;
  error?: { code: number; message: string };
  id: number;
  jsonrpc: string;
};

export async function sendJsonRpc(
  url: string,
  req: { method: string; params: any[]; jsonrpc?: string; id?: number }
): Promise<JsonRpcResponse> {
  const request = {
    jsonrpc: "2.0",
    id: 1,
    ...req,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (response.ok) {
    const json = await response.json();

    return json;
  } else {
    throw new Error(
      `Unexpected response from JSON-RPC: ${JSON.stringify(response, null, 2)}`
    );
  }
}

export enum ErrorType {
  TEMPORARY = "temporary",
  PERMANENT = "permanent",
  RATE_LIMITED = "rate_limited",
  COOLDOWN = "cooldown"
}

export class EnrichmentError extends Error {
  type: ErrorType;
  originalError?: any;

  constructor(message: string, type: ErrorType, originalError?: any) {
    super(message);
    this.name = "EnrichmentError";
    this.type = type;
    this.originalError = originalError;
  }
}

export function classifyError(error: any): ErrorType {
  if (!error) return ErrorType.PERMANENT;

  if (error instanceof EnrichmentError) {
    return error.type;
  }

  const msg = (error.message || "").toLowerCase();

  // Check rate limit keywords or response status
  if (
    msg.includes("rate limit") ||
    msg.includes("429") ||
    error.status === 429 ||
    error.response?.status === 429
  ) {
    return ErrorType.RATE_LIMITED;
  }

  // Axios/Network error detection
  if (error.isAxiosError || error.config) {
    const status = error.response?.status;
    const code = error.code;

    if (status === 429) {
      return ErrorType.RATE_LIMITED;
    }

    if (status >= 500 && status < 600) {
      return ErrorType.TEMPORARY;
    }

    if (
      code === "ECONNABORTED" ||
      code === "ETIMEDOUT" ||
      code === "ENOTFOUND" ||
      code === "EAI_AGAIN" ||
      code === "ECONNRESET" ||
      code === "ECONNREFUSED"
    ) {
      return ErrorType.TEMPORARY;
    }

    if (status >= 400 && status < 500) {
      return ErrorType.PERMANENT;
    }
  }

  // General connection or DNS issues
  if (
    msg.includes("timeout") ||
    msg.includes("timed out") ||
    msg.includes("dns") ||
    msg.includes("enotfound") ||
    msg.includes("econnrefused") ||
    msg.includes("econnreset")
  ) {
    return ErrorType.TEMPORARY;
  }

  return ErrorType.PERMANENT;
}

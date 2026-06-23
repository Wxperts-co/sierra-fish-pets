const cooldowns: Record<string, Date> = {};

export function setProviderCooldown(provider: string, seconds: number) {
  const maxSeconds = Math.min(seconds, 300); // Max 5 minutes (300 seconds)
  const durationMs = maxSeconds * 1000;
  cooldowns[provider] = new Date(Date.now() + durationMs);
  console.warn(`[RateLimitManager] Provider "${provider}" API cooldown set for ${maxSeconds} seconds (until ${cooldowns[provider].toLocaleTimeString()})`);
}

export function isProviderUnderCooldown(provider: string): boolean {
  const until = cooldowns[provider];
  if (!until) return false;
  if (Date.now() > until.getTime()) {
    delete cooldowns[provider];
    return false;
  }
  return true;
}

export function getProviderCooldownRemainingSeconds(provider: string): number {
  const until = cooldowns[provider];
  if (!until) return 0;
  const remainingMs = until.getTime() - Date.now();
  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
}

export function getRetryAfterSeconds(error: any): number {
  const headers = error?.response?.headers || error?.originalError?.response?.headers;
  if (!headers) return 60; // Default to 60 seconds

  const retryAfter = headers["retry-after"];
  if (!retryAfter) return 60;

  // Try parsing as seconds
  const seconds = parseInt(retryAfter, 10);
  if (!isNaN(seconds) && seconds >= 0) {
    return seconds;
  }

  // Try parsing as HTTP-date
  const parsedDate = Date.parse(retryAfter);
  if (!isNaN(parsedDate)) {
    const diffMs = parsedDate - Date.now();
    if (diffMs > 0) {
      return Math.ceil(diffMs / 1000);
    }
  }

  return 60; // Fallback
}

export function clearAllCooldowns() {
  for (const key of Object.keys(cooldowns)) {
    delete cooldowns[key];
  }
  console.log("[RateLimitManager] Cleared all provider cooldowns.");
}

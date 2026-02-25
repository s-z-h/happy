import { log } from "@/utils/log";

/**
 * Check if an IP address falls within a CIDR range.
 * Supports IPv4 addresses and CIDR notation (e.g. "10.0.0.0/8").
 * If no prefix length is specified, treats as /32 (exact match).
 */
export function isIpInCidr(ip: string, cidr: string): boolean {
    const [cidrIp, prefixLenStr] = cidr.split('/');
    const prefixLen = prefixLenStr ? parseInt(prefixLenStr, 10) : 32;

    const ipNum = ipToNumber(ip);
    const cidrNum = ipToNumber(cidrIp);
    if (ipNum === null || cidrNum === null) {
        return false;
    }

    const mask = prefixLen === 0 ? 0 : (~0 << (32 - prefixLen)) >>> 0;
    return (ipNum & mask) === (cidrNum & mask);
}

function ipToNumber(ip: string): number | null {
    const parts = ip.split('.');
    if (parts.length !== 4) {
        return null;
    }
    let num = 0;
    for (const part of parts) {
        const n = parseInt(part, 10);
        if (isNaN(n) || n < 0 || n > 255) {
            return null;
        }
        num = (num << 8) | n;
    }
    return num >>> 0;
}

/**
 * Check if a client IP is allowed by the CLI_ALLOWED_IPS whitelist.
 * Returns true if:
 * - CLI_ALLOWED_IPS is not set (whitelist disabled)
 * - The IP matches any entry in the comma-separated whitelist
 */
export function isCliIpAllowed(ip: string): boolean {
    const allowedIps = process.env.CLI_ALLOWED_IPS;
    if (!allowedIps) {
        return true;
    }

    const entries = allowedIps.split(',').map(e => e.trim()).filter(Boolean);
    const allowed = entries.some(entry => isIpInCidr(ip, entry));
    if (!allowed) {
        log({ module: 'cli-ip-whitelist' }, `IP ${ip} not in CLI_ALLOWED_IPS`);
    }
    return allowed;
}

/**
 * Extract the client IP from a Fastify request.
 * Uses request.ip which respects Fastify's trustProxy configuration.
 * If behind a reverse proxy, configure trustProxy in Fastify instead of reading headers manually.
 */
export function getClientIp(request: { ip: string }): string {
    return request.ip;
}

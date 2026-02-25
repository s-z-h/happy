import { Fastify } from "../types";
import { log } from "@/utils/log";
import { isCliIpAllowed, getClientIp } from "@/utils/cliIpWhitelist";

export function enableCliIpWhitelist(app: Fastify) {
    app.decorate('cliIpCheck', async function (request: any, reply: any) {
        const ip = getClientIp(request);
        if (!isCliIpAllowed(ip)) {
            log({ module: 'cli-ip-whitelist' }, `Blocked CLI request from ${ip} to ${request.url}`);
            return reply.code(403).send({ error: 'IP not allowed' });
        }
    });
}

import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

console.log("DNS:", dns.getServers());

setInterval(async () => {
    try {
        const result = await dns.promises.resolveSrv(
            "_mongodb._tcp.notes-user-db.plfxt.mongodb.net"
        );

        console.log("SUCCESS", new Date().toISOString(), result.length);
    } catch (error) {
        console.error("FAILED", new Date().toISOString(), error);
    }
}, 2000);
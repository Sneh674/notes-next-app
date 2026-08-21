import { setServers, getServers } from "dns";

setServers(["8.8.8.8", "1.1.1.1"]);

console.log("DNS configured:", getServers());
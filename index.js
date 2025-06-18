function main() {

    const ip = "10.0.2.14/24";
    const [host, netmask] = ip.split('/');
    const host_bin = addr_to_bin(host);
    const netmask_bin = addr_to_bin(netmask);
    const rx_bin = subnet_addr(host_bin, netmask_bin);
    const rx = bin_to_addr(rx_bin);
    const bd_bin = broadcast_addr(host_bin, netmask_bin);
    const bd = bin_to_addr(bd_bin);

    console.log("ip : " + ip);
    console.log("hs : " + host + " -> " + host_bin);
    console.log("nm : " + netmask + " -> " + netmask_bin);
    console.log("rx : " + rx + " -> " + rx_bin);
    console.log("bd : " + bd + " -> " + bd_bin);
    console.log("number of hosts : " + hosts_count(netmask_bin));

}

main();

// converts dotted decimal notation or CIDR notation to its binary equivalent
// 92.255.0.254 -> 01011100111111110000000011111110
// 255.0.0.0 -> 11111111000000000000000000000000
// 24 -> 11111111111111111111111100000000
function addr_to_bin(addr) {
    if(addr.includes('.')) {
        return addr.split('.').map(e => Number(e).toString(2).padStart(8, '0')).join('');
    }
    return "1".repeat(Number(addr)).padEnd(32, '0');
}

// converts a binary address to its dotted decimal notation equivalent
// 11111111000000001111111100000000 -> 255.0.255.0
function bin_to_addr(bin) {
    const parts = [bin.slice(0,8), bin.slice(8,16), bin.slice(16,24), bin.slice(24,32)];
    return parts.map(e => parseInt(parseInt(e, 2), 10)).join('.');
}

// counts the number of hosts of a subnet 2^(32-s)-2*H(30-s)
function hosts_count(netmask) {
    let count = 0;
    for(let i=0; i<netmask.length; i++) {
        if(netmask[i]==0) count += 1;
    }
    return Math.pow(2, count) - 2 * heaviside(count-2);
}

// used to handle cases of subnet masks 31 and 32
function heaviside(x) {
    if(x < 0) return 0;
    if(x = 0) return 1/2;
    return 1;
}

// applies a bitwise "and" to the host address and the subnet mask to obtain the subnet address
function subnet_addr(host_addr, netmask) {
    return (parseInt(host_addr, 2) & parseInt(netmask, 2)).toString(2).padStart(32, '0');
}

// calculates the 1's complement of a binary number
function bin_complement(bin) {
    return (~parseInt(bin, 2)>>>0).toString(2).padStart(32, '0');
}

// applies a bitwise "or" to the host address and the one's complement of the subnet mask to obtain the broadcast address
function broadcast_addr(host_addr, netmask) {
    return (parseInt(host_addr, 2) | parseInt(bin_complement(netmask), 2)).toString(2).padStart(32, '0');
}
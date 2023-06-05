const address = require('./addresses.json');
const fs = require("fs");
const path = require("path");

let total = 0;

address.forEach(add => total += parseFloat(add['Value_IN(ETH)']));

console.log(total)



// const updated = address.map((address_obj, index) => ({
//     address: address_obj.From.toLowerCase(),
//     amountInEth: address_obj["Value_IN(ETH)"],
//     amountInTokens: address_obj["Value_IN(ETH)"]/(9.375*Math.pow(10,-8)),
//     claimed: false,
//     index: index+1
// }));

// fs.writeFileSync(path.join(__dirname, "updated.json"),JSON.stringify(updated), {encoding: "utf-8"});


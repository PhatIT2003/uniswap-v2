const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const address = "0xdc2436650c1Ab0767aB0eDc1267a219F54cf7147"
const TokenModule = buildModule("TokenModule", (m) => {
  const UniswapV2Factory = m.contract("UniswapV2Factory",[address]);

  return { UniswapV2Factory };
});

module.exports = TokenModule;
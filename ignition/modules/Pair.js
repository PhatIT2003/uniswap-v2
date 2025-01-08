const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const TokenModule = buildModule("TokenModule", (m) => {
  const Pair = m.contract("UniswapV2Pairs");

  return { Pair };
});

module.exports = TokenModule;
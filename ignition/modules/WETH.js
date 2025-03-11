const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("TokenModule", (m) => {
  const WETH = m.contract("WETH9");

  return { WETH };
});

module.exports = TokenModule;
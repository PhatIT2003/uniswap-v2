const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const factory = "0x7BB0D2D4554b7032faDa61c898600Dc73507704e";
const WETH = "0x8c2961B8fdcD7070bBac2Ba64F502f202a53aE03";
const TokenModule = buildModule("TokenModule", (m) => {
  const route = m.contract("UniswapV2Router02",[factory,WETH]);
  return { route };
});

module.exports = TokenModule
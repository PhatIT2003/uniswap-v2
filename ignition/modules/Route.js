const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const factory = "0x87Fa02BaF96F9945dC48b5367fADcC803227e0dE";
const WBNB = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
const TokenModule = buildModule("TokenModule", (m) => {
  const route = m.contract("UniswapV2Router02",[factory,WBNB]);
  return { route };
});

module.exports = TokenModule;
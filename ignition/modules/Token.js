const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const soluong = "1000000000000000000000000000"
const TokenModule = buildModule("TokenModule", (m) => {
  const token = m.contract("TokenERC20B",[soluong]);

  return { token };
});

module.exports = TokenModule;
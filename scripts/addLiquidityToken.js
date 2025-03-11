require('dotenv').config();
const { ethers } = require("ethers");
const RouteABI = require('./ABI/route02.json');
const PairABI = require('./ABI/Pair.json');
// Kiểm tra PRIVATE_KEY
if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY không được tìm thấy! Kiểm tra lại .env");
}

// Thiết lập provider và signer
const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/082f3c154c4d4ccdbd305e854d654836');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Địa chỉ hợp đồng và token
const contractRoute02 = "0x6B9151775cF26fb4B62F91151EA869be00e91875";
const contractPair="0x5CE6ad4DAb76731023E5902Fd29a07DAfaC8f726";
const AddressTokenA = "0x28483CD9050E59E804d0a3de4B7B8b6e54892455";
const AddressTokenB= "0xBD9FBcA05676857415f27077d9Ad5B83e1d776D4";
// Kiểm tra kết nối mạng
async function checkConnection() {
    try {
        const blockNumber = await provider.getBlockNumber();
        console.log("🔗 Kết nối RPC thành công! Block hiện tại:", blockNumber);
    } catch (error) {
        console.error("❌ Lỗi kết nối RPC:", error);
    }
}

// Kiểm tra số dư ví
async function checkBalance() {
    const balance = await provider.getBalance(wallet.address);
    console.log(`💰 Số dư ví: ${ethers.formatEther(balance)} ETH`);
}

async function addLiquidity() {
  const contractPairs = new ethers.Contract(contractPair, PairABI, wallet);
  const Reserves = await contractPairs.getReserves();
  console.log("📝 Reserves:", Reserves);

  const amountA = ethers.parseUnits("10", 18);
  // Tính toán chính xác số lượng token B dựa trên tỷ lệ hiện tại
  const amountB = (amountA * Reserves[1]) / Reserves[0];
  console.log("📝 Số lượng token A đã thêm vào:", amountA.toString());
  console.log("📝 Số lượng token B cần thêm vào:", amountB.toString());

  const contractRoute = new ethers.Contract(contractRoute02, RouteABI, wallet);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 60;
  console.log("📝 Thời hạn giao dịch:", deadline);
  
  const tx = await contractRoute.addLiquidity(
    AddressTokenA,
    AddressTokenB,
    amountA,
    amountB,
    amountA -ethers.parseUnits("1", 18),     // slippage minimumA
    amountB-ethers.parseUnits("1", 18),     // slippage minimumB
    wallet.address,
    deadline,
    { gasLimit: 300000 }
  );

  console.log("📝 Đã gửi giao dịch:", tx.hash);
}



checkConnection();
checkBalance();
addLiquidity();

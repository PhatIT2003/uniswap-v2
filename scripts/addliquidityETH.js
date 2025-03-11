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
const contractPair = "0x7B35416EB0994514AbC73aD6BfBaed5B8BEc4D13";
const tokenAddress = "0x28483CD9050E59E804d0a3de4B7B8b6e54892455"; // Địa chỉ token ERC-20

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
    const reserves = await contractPairs.getReserves();
    console.log("📝 Reserves:", reserves);

    const amountTokenA = ethers.parseUnits("1", 18); // Số lượng token ERC-20
    const amountETH = (amountTokenA * reserves[1]) / reserves[0]; // Tính toán số lượng ETH cần thêm
    console.log("📝 Số lượng token đã thêm:", ethers.formatUnits(amountTokenA, 18));
    console.log("📝 Số lượng ETH cần thêm:", ethers.formatUnits(amountETH, 18));

    const contractRoute = new ethers.Contract(contractRoute02, RouteABI, wallet);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60;
    console.log("📝 Thời hạn giao dịch:", deadline);

    // ✅ Gọi đúng hàm addLiquidityETH
    const tx = await contractRoute.addLiquidityETH(
        tokenAddress,     // 🛠 Địa chỉ token ERC-20
        amountTokenA,      // Số lượng token ERC-20
        tokenAddress,                // Min amount token (slippage)
        amountETH,                // Min amount ETH (slippage)
        wallet.address,   // Địa chỉ nhận LP token
        deadline,
        { value: amountETH, gasLimit: 300000 } // 🔥 Truyền ETH vào đây!
    );

    console.log("📜 Giao dịch gửi thành công! Hash:", tx.hash);
    await tx.wait();
    console.log("✅ Giao dịch hoàn tất!");
}

// Gọi các hàm kiểm tra và thực hiện thêm thanh khoản
checkConnection();
checkBalance();
addLiquidity();

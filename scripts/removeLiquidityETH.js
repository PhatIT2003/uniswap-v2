const { ethers } = require("ethers");
require("dotenv").config();
const RouteABI = require("./ABI/route02.json");
const PairABI = require("./ABI/Pair.json"); // Cần ABI của pair token

const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/082f3c154c4d4ccdbd305e854d654836");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Địa chỉ LP token pair (cặp thanh khoản)
const pairAddress = "0x7B35416EB0994514AbC73aD6BfBaed5B8BEc4D13";
// Địa chỉ router Uniswap V2
const routerAddress = "0x6B9151775cF26fb4B62F91151EA869be00e91875";
const addressTokenA=  "0x28483CD9050E59E804d0a3de4B7B8b6e54892455";
// Định nghĩa domain để ký Permit
const value = ethers.parseUnits("1", 18); // Số lượng LP token muốn remove
async function getPermitSignature() {
    const contract = new ethers.Contract(pairAddress, PairABI, provider);
    const nonce = await contract.nonces(wallet.address); // Lấy nonce từ contract LP token

    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 giờ từ hiện tại
   

    const domain = {
        name: "Uniswap V2",
        version: "1",
        chainId: 11155111, // Sepolia
        verifyingContract: pairAddress,
    };

    const types = {
        Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
        ],
    };

    const message = {
        owner: wallet.address,
        spender: routerAddress,
        value,
        nonce,
        deadline,
    };

    // Ký message
    const signature = await wallet.signTypedData(domain, types, message);
    const sig = ethers.Signature.from(signature);

    console.log("✅ Chữ ký tạo thành công:");
    console.log("r:", sig.r);
    console.log("s:", sig.s);
    console.log("v:", sig.v);

    return {
        r: sig.r,
        s: sig.s,
        v: sig.v,
        deadline,
    };
}

async function removeLiquidity(v, r, s, deadline) {
    console.log("📝 Thời hạn giao dịch:", deadline);

    const contractRoute = new ethers.Contract(routerAddress, RouteABI, wallet);

    const tx = await contractRoute.removeLiquidityETHWithPermit(
        addressTokenA, // Token A
        value,
        ethers.parseUnits("0.00001", 18), 
        ethers.parseUnits("0.0001", 18), 
        wallet.address, // Người nhận token
        deadline,
        false, // approveMax (nếu bạn muốn hủy toàn bộ LP, đặt thành true)
        v,
        r,
        s,
        { gasLimit: 300000 }
    );

    console.log("📜 Giao dịch gửi thành công! Hash:", tx.hash);
    await tx.wait();
    console.log("✅ Giao dịch hoàn tất!");
}

// Chạy lần lượt
getPermitSignature().then((sig) => {
    removeLiquidity(sig.v, sig.r, sig.s, sig.deadline);
});

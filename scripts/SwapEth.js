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
const contractPair="0x7B35416EB0994514AbC73aD6BfBaed5B8BEc4D13";

const AddressTokenA ="0x28483CD9050E59E804d0a3de4B7B8b6e54892455";
const AddressWETH ="0x8c2961B8fdcD7070bBac2Ba64F502f202a53aE03";
const AmountTokenA = ethers.parseUnits("100", 18);
const path = [AddressTokenA,AddressWETH];
const AddressTo = "0xdc2436650c1Ab0767aB0eDc1267a219F54cf7147";
async function SwapToken(){
    const contractPairs = new ethers.Contract(contractPair, PairABI, wallet);
    const Reserves = await contractPairs.getReserves();
    console.log("📝 Reserves:", Reserves);
    const contractRoute = new ethers.Contract(contractRoute02, RouteABI, wallet);
    const getAmountOut = await contractRoute.getAmountOut(
        AmountTokenA,
        Reserves[0],
        Reserves[1],
    );
    console.log("📝 Số lượng ETH nhận được:",getAmountOut.toString());
    const AmountWETH = getAmountOut;
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60;
    console.log("📝 Thời hạn giao dịch:", deadline);
    const tx = await contractRoute.swapExactTokensForETH(
        AmountTokenA ,
        AmountWETH,
        path,
        AddressTo,
        deadline,
        { gasLimit: 300000 }
    );
    console.log("📝 Giao dịch đã được gửi! TxHash:", tx.hash);
}
SwapToken();
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

const AddressTokenA ="0x28483CD9050E59E804d0a3de4B7B8b6e54892455";
const AddressTokenB ="0xBD9FBcA05676857415f27077d9Ad5B83e1d776D4";
const AmountTokenA = ethers.parseUnits("100", 18);
const path = [AddressTokenA,AddressTokenB];
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
    console.log("📝 Số lượng token B nhận được:",getAmountOut.toString());
    const AmountTokenB = getAmountOut - ethers.parseUnits("1", 6);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 60;
    console.log("📝 Thời hạn giao dịch:", deadline);
    const tx = await contractRoute.swapExactTokensForTokens(
        AmountTokenA ,
        AmountTokenB,
        path,
        AddressTo,
        deadline,
        { gasLimit: 300000 }
    );
    console.log("📝 Giao dịch đã được gửi! TxHash:", tx.hash);
}
SwapToken();
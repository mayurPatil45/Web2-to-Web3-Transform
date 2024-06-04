async function main() {
    const [deployer] = await ethers.getSigners();
    const token = await ethers.getContractFactory('token');
    const Token = await token.deploy();
    console.log("token address: ", Token.address)
}

main()
.then(()=> process.exit(0))
.catch((error)=>{
    console.log(error)
    process.exit(1)
})
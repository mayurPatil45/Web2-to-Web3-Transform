const{expect} = require('chai');

// describe("first contract", function(){
//     //this it block should be created for every function
//     it("depliyment should assign all tokens to owner", async function(){
//         const[owner]  = await ethers.getSigners();
//         // console.log("sigmers object: ", owner);
//         //create instance
//         const token = await ethers.getContractFactory("token");
//         const Token =   await token.deploy();  //deploy
//         const ownerbalance = await Token.balview(owner.address);
//         console.log(ownerbalance); //check balance it should be 100

//         expect(await Token.totalsupply()).to.equal(ownerbalance)//here we check id its 100 if true then it passed the test
//     })

//     it("Transfer", async function(){
//         const[owner, addr1, addr2]  = await ethers.getSigners();

//         //create instance
//         const token = await ethers.getContractFactory("token");
//         const Token =   await token.deploy();  //deploy
//         await Token.transfer(10,addr1.address);

//         // owner to addr1
//         expect(await Token.balview(addr1.address)).to.equal(10) 

//         // addr1 to addr2
//         await Token.connect(addr1).transfer(5,addr2.address);
//         expect(await Token.balview(addr1.address)).to.equal(5)
//         expect(await Token.balview(addr2.address)).to.equal(5)
//     })
// })

// here code was getting repeated 


// how hooks are used given by mocha plugin
describe("token contract", function(){
    let token;
    let Token;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function(){
        token = await ethers.getContractFactory('token');
        [owner, addr1, addr2] = await ethers.getSigners();
        Token = await token.deploy();
    })

    describe("deployment", function(){
        it("reach correct owner", async function(){
            expect(await Token.owner()).to.equal(owner.address)
        })
        it("owner gets totalsupply", async function (){
            const ownerbalance = await Token.balview(owner.address)
            expect(await Token.totalsupply()).to.equal(ownerbalance)
        })
        //all it blocks are treated differently this means that this it  block addr1 has 5 tokens in end but next it block wont have any becayse everything will be newly initialized
        it("transfer", async function(){
        // owner to addr1
        await Token.transfer(10,addr1.address);
        expect(await Token.balview(addr1.address)).to.equal(10) 

        // addr1 to addr2
        await Token.connect(addr1).transfer(5,addr2.address);
        expect(await Token.balview(addr1.address)).to.equal(5)
        expect(await Token.balview(addr2.address)).to.equal(5)
        })
        it("show not enough balance", async function(){
            const initialbalance = await Token.balview(owner.address);
            await expect(Token.connect(addr1).transfer(1,owner.address)).to.be.revertedWith("not enough amount");//this string must be same as the one use in require statement of smart contract
            expect(await Token.balview(owner.address)).to.equal(initialbalance);
        })
    })
})
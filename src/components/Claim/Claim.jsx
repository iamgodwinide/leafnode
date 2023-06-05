import { useEffect, useRef, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import newcontract from './Newcontract.json';
import { useAlert } from 'react-alert';
import { keccak256 } from 'ethers/lib/utils';
import { MerkleTree } from 'merkletreejs'
import { Spinner } from 'reactstrap';
import list from './updated.json';
import { Buffer } from 'buffer';
import Web3 from 'web3';
const web3 = new Web3();


const newcontractAddress = "0x3Cd2FA506382BDe39C0E621B69Ba3CF13909392b";
const url = "https://somethingback.store/api"


const Claim = ({ accounts }) => {
    const alert = useAlert();
    const [loading, setLoading] = useState(false);
    const [userWallet, setUserWallet] = useState({
        claimed: false,
        amountInTokens: 0
    });

    async function handleClaim() {
        if(userWallet.amountInTokens === 0){
            alert.error("No tokens to claim");
            return;
        }

        setLoading(true);

        let nodeIndex = null;
        
        const balances = list.map((bal, index) => {
            if(bal.address === accounts[0]) nodeIndex = index;
            return ({
                addr: bal.address,
                amount: web3.eth.abi.encodeParameter(
                "uint256",
                web3.utils.toWei(bal.amountInTokens.toString(), 'ether')
            )})
        })

        const leafNodes = balances.map((balance) =>
        
        keccak256(
            Buffer.concat([
            Buffer.from(balance.addr.replace("0x", ""), "hex"),
            Buffer.from(balance.amount.replace("0x", ""), "hex"),
        ])));

        const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

        const proof = merkleTree.getHexProof(leafNodes[nodeIndex]).map(item => item.replace(/\n/g, ""));

        console.log("Proof----", proof);
        console.log("Address----", balances[nodeIndex].address);
        console.log("Amount----", balances[nodeIndex].amount);

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                newcontractAddress,
                newcontract,
                signer
            );
            try {
                const response = await contract.claimTokens(
                    balances[nodeIndex].amount,
                    proof
                );
                // make API Call
                sendClaim();
                console.log(response);
            } catch (err) {
                alert.error(err?.reason);
                console.log("error: ", err)
                setLoading(false);
            };
        };
    };

    const sendClaim = () => {
        fetch(`${url}/claim/${accounts[0]}`)
        .then((value) => {
            return value.json();
        })
        .then(data => {
            if(data.success){
                setUserWallet(data.wallet);
                alert.success("You have successfully claimed your tokens");
                getWalletInfo();
            }else{
                alert.error(data.msg)
            }
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setTimeout(()=>{
                getWalletInfo();
            }, 3000)
            setLoading(false);
        })
    }
    

    const getWalletInfo = () => {
        fetch(`${url}/get_info/${accounts[0]}`)
        .then((value) => {
            return value.json();
        })
        .then(data => {
            if(data.success){
                setUserWallet(data.wallet);
            }
        })
        .catch(err => {
            console.log(err);
            setTimeout(()=>{
                getWalletInfo();
            }, 3000)
        })
    }


    useEffect(()=> {
        if(accounts[0]) getWalletInfo();
    }, [accounts])

    return (
        <>
        <div className='claim-wrap'>
            <p>{userWallet.amountInTokens.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
            <button
            onClick={
                userWallet.claimed 
                ? false
                : handleClaim
            }
            >
                {
                    loading
                    ? <Spinner
                        color="white"
                        >
                    </Spinner>
                    : userWallet.claimed
                    ?"CLAIMED"
                    :"CLAIM"
                }
            </button>
        </div>
        </>
    )
}

export default Claim;
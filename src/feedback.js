import React, {useState, useEffect} from 'react'
import { ethers } from 'ethers';
import abi from './abi.json';
import './feedback.css';

const FeedBack = () => {
    
    const contractAddress = '0xda63692d00dd37e022f295af283a174f36cd6ae0';
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connectButtonText, setconnectButtonText] = useState('Connect Wallet');
    const [errorMessage, setErrorMessage] = useState(null);
    const [currentContractVal, setcurrentContractVal] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [allfeeds, setAllFeeds] = useState([]);

    const accountChangeHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();
    }
    
    const connectWalletHandler = () =>{
        if(window.ethereum){
            window.ethereum.request({method: 'eth_requestAccounts'})
            .then(result =>{
                setDefaultAccount(result[0]);
                setconnectButtonText('Wallet Connected');
                updateEthers(); // <--- update the ethers here
            })
        }else{
            setErrorMessage('Please install MetaMask');
        }
    }
    

    const updateEthers = () => {
        let ourProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(ourProvider);
        let ourSigner = ourProvider.getSigner();
        setSigner(ourSigner);
        let ourContract = new ethers.Contract(contractAddress, abi, ourSigner);
        setContract(ourContract);
    }
    


    const getCurrentVal = async () => {
      connectWalletHandler();
        let val = await contract.getTotalFaves();
        console.log(val.toString());
        setcurrentContractVal(val.toString());
    }

    const setHandler = (event) => {
        
        event.preventDefault();
        contract.feed(event.target.setText.value);
        console.log();
    }

    const getFeedbacks = async () => {
        let feeds = await contract.getFeeds();
        console.log(feeds);
        

        let feedsCleaned = [];
        feeds.forEach(feed => {
          feedsCleaned.push({
            address: feed.feeder,
            message: feed.message,
            timestamp: new Date(feed.timestamp * 1000),
          });
        });
      setAllFeeds(feedsCleaned);
        console.log(feeds);
    }
  
getFeedbacks();
    const handleMessage = (e) => (e.target.value);
  useEffect(() => {
    // connectWalletHandler();
    getFeedbacks();
    getCurrentVal();
  }, [])

    return(

        <div className='mainContainer'>
            <br></br>
            {/* <button className='feedButton' onClick={connectWalletHandler}>{connectButtonText}</button>
            <h3>Address: {defaultAccount}</h3> */}
            
            <div className='wallet'>
              <button className="feedButton" onClick={connectWalletHandler}>
          {!defaultAccount ? (<span>Connect Wallet</span>) : (<span>{defaultAccount}</span>)}{""}
          </button>
            </div>
          

            <div className='sendFeed'>
               <form onSubmit={setHandler}>
                <input className='textInput' id="setText" placeholder='Write your feedback here' type="text" />
                <button className='feedButton' type={"submit"}>submit</button>
                </form>
                <button className='feedButton' onClick={getCurrentVal}>Total Feedbacks</button>
                <h2 className='count'>{currentContractVal}</h2>
            
            </div>
            


          
          {allfeeds.map((feed, index) => {
          return (
            <div key={index} className="key">
            {/*<div >Address: {feed[0]}, Message: {feed[1]}, Time: {feed.timestamp.toDateString()}</div>*/}
            <table>
        <tr>
          <th>Address</th>
          <th>{feed.address}</th>
        </tr>
        <tr>
          <th>Message</th>
          <th>{feed.message}</th>
        </tr>
        <tr>
          <th>Date</th>
          <th>{feed.timestamp.toLocaleString()}</th>
        </tr>
        
        
      </table>
            </div>
              );
          })}
          </div>
            
    
    )
}

export default FeedBack;
import React, { useEffect, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Claim from './components/Claim/Claim';


function App() {
  const [messages, setMessages] = useState([]);
  const notCover = useRef()
  const phone = useRef()

  const [accounts, setAccounts] = useState([]);

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const addMessage = () => {
    notCover.current.scrollTop = notCover.current.scrollHeight + 100;
    let _messages = [...messages];
    _messages.push(
        Math.floor(Math.random()*3)+1
    );
    setMessages(_messages);
    const sound = new Audio("/audio/tone2.mp3");
    sound.play();
    setTimeout(()=> {
        notCover.current.scrollTop = notCover.current.scrollHeight + 100;
    },50)
  };

  const connectAccount = async () => {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        setAccounts(accounts);
        const sound = new Audio("/audio/tone3.mp3");
        sound.play();
    }
  }


  const claim = () => {

  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString([], options);
  };


  useEffect(()=> {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if(window.innerWidth < 1024){
            // Add class to HTML body
        if (iOS) {
            phone.current.style.height = "87vh";
        } else {
            phone.current.style.height = "92vh";
        }
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='root'>
        <div className="phone" ref={phone}>
            <div className="top-not">
                <div>
                    {" "}<i className="fas fa-wifi"></i>
                </div>
                <div className='batterywrap'>
                    <p>100%</p>
                    <div className="battery">
                        <div></div>
                    </div>
                </div>
            </div>
            <div className="time-wrap">
                <h2>{formatTime(currentDateTime)}</h2>
                <p>{currentDateTime.toLocaleDateString([], { weekday: 'long' })},{" "}
                {currentDateTime.toLocaleDateString([], { month: 'long' })}{" "}
                {currentDateTime.toLocaleDateString([], { day: 'numeric' })}</p>
            </div>
            <div className="notifications" ref={notCover}>
              <TransitionGroup className="item-list">
                {
                    messages.map((item, index)=> (
                        <CSSTransition
                        key={index}
                        timeout={300}
                        classNames={{
                            enter: index === 0 ? 'item-enter-last' : 'item-enter',
                            enterActive: index === 0 ? 'item-enter-active-last' : 'item-enter-active',
                            exit: 'item-exit',
                            exitActive: 'item-exit-active'
                          }}
                      >
                        <img src={`/img/Untitled_Artwork-${item}.png`}/>
                      </CSSTransition>
                    ))
                }
              </TransitionGroup>
            </div>
            <div className="apps-wrap">
                {
                    accounts[0]
                    &&
                    <Claim accounts={accounts} setAccounts={setAccounts}/>
                }
                <div>
                    <a target='_blank' className='ylink' href="https://www.youtube.com/watch?app=desktop&v=qeMFqkcPYcg">
                        everyboooooodys, lookin for $something <i className="fas fa-link"></i>
                    </a>
                </div>
                <div className="apps">
                    <div className="item">
                        <a href="https://t.me/smthngcoin" target="_blank" rel="noopener noreferrer">
                        <img src="/img/telegram.png" alt="" srcset="" />
                        </a>
                    </div>
                    <div className="item">
                        <a target='_blank' href="https://twitter.com/smthngcoin" rel="noopener noreferrer">
                        <img src="/img/twitter.png" alt="" srcset="" />
                        </a>
                    </div>
                    <div className="item">
                        <img src="/img/dextools.png" alt="" srcset="" />
                    </div>
                    <div className="item">
                        <img 
                        onClick={addMessage}
                        src="/img/something.jpg" alt="" srcset="" />
                    </div>
                    <div className="item">
                        <img  
                        onClick={addMessage}
                        src="/img/message.png" alt="" srcset="" />
                        {
                            messages.length !== 0
                            &&
                            <div className="badge">
                                {messages.length}
                            </div>
                        }
                    </div>
                    <div className="item">
                        <img 
                        onClick={connectAccount}
                        src="/img/metamask.png" alt="" srcset="" />
                        {
                            accounts[0]
                            &&
                            <div className="badge">
                                <i className="fas fa-check"></i>
                            </div>
                        }
                    </div>
                </div>
                {/* <div className="dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div> */}
            </div>
        </div>
    </div>
  )
}

export default App
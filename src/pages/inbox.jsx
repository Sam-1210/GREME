import './inbox.css'
import backIco from '../resources/icons/back.jpg'
import profileIco from '../resources/icons/profile.jpg'
import moreIco from '../resources/icons/more.jpg'
import MicIco from '../resources/icons/mic.jpg'
import SendIco from '../resources/icons/send.jpg'
import cameraIco from '../resources/icons/camera.jpg'
import EmojiIco from '../resources/icons/emoji.jpg'
import LocationIco from '../resources/icons/location.jpg'
import PhraseIco from '../resources/icons/phrases.jpg'
import { useEffect, useState, useRef } from 'react'
import {useLocation} from 'react-router-dom'

function Inbox({ profileName='', profilePic='', distance=0, unit='m', isOnline=true, uid }) {
    const [numRows, setNumRows] = useState(1);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const inputBox = useRef(null);
    const location = useLocation();

    ({profileName, distance, unit, isOnline, uid} = location.state);

    useEffect(() => {
        const storedMessages = localStorage.getItem(profileName + uid);
        if (storedMessages !== null) {
            setMessages(JSON.parse(storedMessages));
        }

        return () => {
            if (messages.length > 0) {
                localStorage.setItem(profileName + uid, JSON.stringify(messages));
            }
        }
    }, [profileName, uid]);

    const sendMessage = (side) => {
        if (message.length > 0) {
            let date = new Date();
            let AmOrPm = date.getHours() >= 12 ? 'pm' : 'am';
            let senttime = date.getHours() + ':' + date.getMinutes() + AmOrPm;
            setMessages([...messages, { text: message, from: side, time: senttime}]);
            setMessage('');
        }
        if(inputBox !== null) inputBox.current.focus();
    }

    const goBack = () => {
        localStorage.setItem(profileName + uid, JSON.stringify(messages));
        window.history.back();
    }

    let messageElements = messages.map((message, index) => {
        return (
            <div className={'MessageBox ' + (message.from === 'this' ? 'MessageBoxThis' : 'MessageBoxOther')} key={index}>
                <div>
                    {message.from === 'other' && <div className="MessageTilde TildeLeft"></div>}
                    <div className={'MessageText ' + (message.from === 'this' ? 'MessageTextThis' : 'MessageTextOther')}>{message.text}</div>
                    {message.from === 'this' && <div className="MessageTilde TildeRight"></div>}
                </div>
                { index+1 < messages.length && 
                    ((message.from === 'this' && messages[index+1].from === 'this')
                    || (message.from === 'other' && messages[index+1].from === 'other'))
                     ? null
                    : <div className="MessageTime">
                        { index === messages.length - 1 && message.from === 'this' ? 'Delivered ' : null }
                        {message.time}
                    </div>
                }
            </div>
        );
    });

    return (
        <div className="InboxBody">
            <div className="InboxHeader">
                <div className="InboxHeaderLeft">
                    <img src={backIco} alt="back" onClick={goBack}/>
                </div>
                <div className="InboxHeaderCenter">
                    <div className='ProfilePicture'>
                        <img src={profileIco} alt="profile" />
                        {isOnline && <div className="OnlineDot"></div>}
                    </div>
                    <div className="ProfileDetails">
                        <div className="ProfileName">{profileName}</div>
                        <div className="ProfileDistance">{distance} {unit} away</div>
                    </div>
                </div>
                <div className="InboxHeaderRight">
                    <img src={moreIco} alt="more" />
                </div>
            </div>
            <div className="InboxContent">
                <div>{messageElements}</div>
            </div>
            <div className="InboxFooter">
                <div className="FooterTop">
                    <div>
                        <textarea type="text" 
                            placeholder="Say something..." 
                            value={message}
                            rows={numRows} 
                            onChange={(e) => {
                                (e.target.value.length > 30 || e.target.value.split('\n').length > 1) ? setNumRows(3) : setNumRows(1);
                                setMessage(e.target.value)
                            }
                            }
                            onBlur={() => setNumRows(1)}
                            ref={inputBox}
                            />
                        {message.length > 0 ? 
                            <img src={SendIco} alt="send" 
                                onClick={() => sendMessage('this')}/> : 
                            <img src={MicIco} alt="mic" />}
                    </div>
                </div>
                <div className="FooterBottom">
                    <div>
                        <img src={cameraIco} alt="camera" />
                    </div>
                    <div>
                        <img src={EmojiIco} alt="emoji" />
                    </div>
                    <div>
                        <img src={LocationIco} alt="location" 
                            onClick={() => sendMessage('other')}/>
                    </div>
                    <div>
                        <img src={PhraseIco} alt="phrase" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inbox;
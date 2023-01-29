import './App.css';
import { useEffect, useState } from 'react';
import Inbox from './pages/inbox';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom';

function* generateID() {
    let id = 0;
    while (true) {
        yield id++;
    }
}

function NewChatPopup() {
    const [profileName, setprofileName] = useState('');
    const [distance, setDistance] = useState(0);
    const [unit, setUnit] = useState('m');
    const [isOnline, setIsOnline] = useState(false);
    const navigate = useNavigate();

    const createChat = () => {
        let storedChatList = localStorage.getItem('chatList');
        if (storedChatList === null) {
            storedChatList = [];
        } else {
            storedChatList = JSON.parse(storedChatList);
        }
        let uid = generateID().next().value;
        storedChatList.push({ profileName, distance, unit, isOnline, uid });
        localStorage.setItem('chatList', JSON.stringify(storedChatList));

        navigate('/inbox', { state: { profileName, distance, unit, isOnline, uid } });
    }

    return (
        <div>
            <h1>New Chat</h1>
            <div>
                <label htmlFor='profileName'>Enter Name</label>
                <input type='text' id='profileName' onChange={(e) => setprofileName(e.target.value)} />
            </div>
            <div>
                <label htmlFor='distance'>Distance</label>
                <input type='number' id='distance' onChange={(e) => setDistance(e.target.value)} />
            </div>
            <div>
                <label htmlFor='unit'>Unit</label>
                <select id='unit' onChange={(e) => setUnit(e.target.value)}>
                    <option value='m'>Meter</option>
                    <option value='km'>Kilometer</option>
                </select>
            </div>
            <div>
                <label htmlFor='isOnline'>Online</label>
                <input type='checkbox' id='isOnline' onChange={(e) => setIsOnline(e.target.checked)} />
            </div>
            <div>
                <input type='button' value='Create Chat' onClick={createChat} />
            </div>
        </div>
    );
}

function Home() {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [chatList, setChatList] = useState([]);

    useEffect(() => {
        const storedChatList = localStorage.getItem('chatList');
        if (storedChatList !== null) {
            setChatList(JSON.parse(storedChatList));
        }
    }, []);

    let chatListUI = chatList.map((chat, index) => {
        return (
            <div>
            <Link to={`/inbox`} key={index}
                state={{ profileName: chat.profileName, distance: chat.distance, unit: chat.unit, isOnline: chat.isOnline, uid: chat.uid }}
            >
                <div key={index} className="ChatListItem">
                    <h3>{chat.profileName}</h3>
                    <p>{chat.distance} {chat.unit}</p>
                    <p>{chat.isOnline ? 'Online' : 'Offline'}</p>
                </div>
            </Link>
            <hr/>
            </div>
        );
    });

    return (
        <div id="Home">
            <h1>GREME</h1>
            <h2>Welcome India Pride Memer</h2>
            <div className="ChatList">
                <h3>Chats</h3>
                {chatListUI}
            </div>
            <input type="button" value="+ New Chat" onClick={() => setPopupOpen(true)} />
            {isPopupOpen && <NewChatPopup />}
        </div>
    );
}

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/inbox' element={<Inbox />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;

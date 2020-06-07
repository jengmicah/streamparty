import React from 'react';

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import JoinRoom from './components/Join/JoinRoom';
import Room from './components/Room/Room';
// import Browse from './components/Browse/Browse';

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './components/breakpoints.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faPaperPlane,
    faUsers,
    faTimes,
    faCircle,
    faPlus,
    faPlay,
    faAngleDoubleLeft,
    faAngleDoubleRight,
    faCaretLeft,
    faCaretRight,
    faCheckCircle,
    faComment,
    faStream,
    faCog,
    faSearch,
    faHistory,
    faCopy,
    faCheck
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faPaperPlane,
    faUsers,
    faTimes,
    faCircle,
    faPlus,
    faPlay,
    faAngleDoubleLeft,
    faAngleDoubleRight,
    faCaretLeft,
    faCaretRight,
    faCheckCircle,
    faComment,
    faStream,
    faCog,
    faSearch,
    faHistory,
    faCopy,
    faCheck
);

const App = () => (
    <div>
        < ReactNotification />
        <Router>
            <Route path="/" exact component={JoinRoom} />
            <Route path="/room" exact><Redirect to="/" /></Route>
            <Route path="/room/:roomName" component={Room} />
            {/* <Route path="/browse" component={Browse} /> */}
        </Router>
    </div>
);

export default App;
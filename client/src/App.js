import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import JoinRoom from './components/Join/JoinRoom';
import Room from './components/Room/Room';
import Browse from './components/Browse/Browse';

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
    faHistory
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
    faHistory
);

const App = () => (
    <Router>
        <Route path="/" exact component={JoinRoom} />
        <Route path="/room" component={Room} />
        {/* <Route path="/browse" component={Browse} /> */}
    </Router>
);

export default App;
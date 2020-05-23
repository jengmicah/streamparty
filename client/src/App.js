import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import JoinRoom from './components/Join/JoinRoom';
import Room from './components/Room/Room';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPaperPlane, faUsers, faTimes, faCircle, faPlus, faCaretRight, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'

library.add(faPaperPlane, faUsers, faTimes, faCircle, faPlus, faCaretRight, faAngleDoubleLeft, faAngleDoubleRight);

const App = () => (
    <Router>
        <Route path="/" exact component={JoinRoom} />
        <Route path="/room" component={Room} />
    </Router>
);

export default App;
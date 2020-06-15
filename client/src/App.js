import React from 'react';

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import JoinRoom from './components/Join/JoinRoom';
import Room from './components/Room/Room';
// import Browse from './components/Browse/Browse';

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './components/breakpoints.css';
import 'semantic-ui-css/semantic.min.css';

const App = () => (
    <div>
        <ReactNotification />
        <Router>
            <Switch>
                <Route path="/" exact component={JoinRoom} />
                <Route path="/room/:roomName" component={Room} />
                <Redirect to="/" />
                {/* <Route path="/browse" component={Browse} /> */}
            </Switch>
        </Router>
    </div>
);

export default App;
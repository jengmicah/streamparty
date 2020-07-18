import React from 'react';
// import Browse from './components/Browse/Browse';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './components/breakpoints.scss';
import JoinRoom from './components/Join/JoinRoom';
import Room from './components/Room/Room';

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
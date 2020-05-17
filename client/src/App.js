import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Join from './components/Join/Join';
import Watch from './components/Watch/Watch';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faPaperPlane, faUsers } from '@fortawesome/free-solid-svg-icons'

library.add(faPaperPlane, faUsers);

const App = () => (
    <Router>
        <Route path="/" exact component={Join} />
        <Route path="/watch" component={Watch} />
    </Router>
);

export default App;
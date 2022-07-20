import React from 'react';

import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';

import { BrowserRouter as Router, Route } from "react-router-dom" ; 

//Creating App.js Component:

const App = () => { //Arrow function of JS
  return (
    /*Router is a component*/
    <Router>
      <Route path="/" exact component={Join} /> {/*Root path , pass in the component that we want to render which is join*/}
      <Route path="/chat" component={Chat} /> {/*Not exact path cos we will pass properties*/}
    </Router>

    //When the user first comes to the page, he will be greeted with the join componenet, where he will pass his data 
    //in login form and through query strings, pass the data to "chat"
    //Once we have data, we render the Chat component
  );
}

export default App;

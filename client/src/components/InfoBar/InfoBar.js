import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

//In Chat.js, InforBar ke saath we sent room, which is picked up in {room}, so that we can dynamically show it as a header
const InfoBar = ({ room }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <h3>{room}</h3>
    </div>
    <div className="rightInnerContainer">
      {/*//Clicking on the closeIcon brings us back to home page, using the anchor tag and href = root route,
      //Works by doing a full page refresh, and hence cleaning the URL*/}
      <a href="/"><img src={closeIcon} alt="close icon" /></a>
    </div>
  </div>
);

export default InfoBar;
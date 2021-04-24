import React from 'react';
import Tilt from 'react-tilt'; 
import brain from './brain.png';
import './Logo.css';
 



function Logo() {
    return (
        <div className=" mar4 mt0">
            <Tilt className="Tilt br2 shadow-2" options={{ max : 85 }} style={{ height: 120, width: 120 }} >
                <div className="Tilt-inner pa3"> <img style={{paddingTop:'5px'}} src={brain} alt =''/></div>
            </Tilt>
          
        </div>
    )
}

export default Logo;

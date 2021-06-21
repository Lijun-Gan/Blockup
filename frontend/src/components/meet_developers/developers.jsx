import React from "react";

class Developers extends React.Component {
  render() {
    return (
      <div className="developers-container-outer">
          <h1 className="development-team">Development Team</h1>

        <div className="developers-container">


            <div className="individual-container">
                <h3>Adam Kamboj</h3>
                <img src="adam_kamboj.jpeg" alt="Adam Kamboj" className="developer-pic"/>

                <p>Blockup id: 60a27af5862e570de3ada7d0</p>
                <p>Email: Kamboj.Adam@gmail.com</p>
                <a className="developer-links" href="https://github.com/kloudysky">Github: https://github.com/kloudysky</a>
                <a className="developer-links" href="https://www.linkedin.com/in/kloudysky/">Linkedin: https://www.linkedin.com/in/kloudysky/</a>
   
            </div>


            <div className="individual-container">
                <h3>Edward Kim</h3>
                <img src="edward_kim.jpeg" alt="Edward Kim" className="developer-pic"/>
                <p>Blockup id: 60a27ba7862e570de3ada7d5</p>
                <p>Email: thedaebu@gmail.com</p>
                <a className="developer-links" href="https://github.com/thedaebu">Github: https://github.com/thedaebu</a>
                <a className="developer-links" href="https://www.linkedin.com/in/edkim163/">Linkedin: https://www.linkedin.com/in/edkim163/</a>
   
            </div>

            <div className="individual-container">

                <h3>Jaspreet Singh</h3>
                <img src="./jaspreet_singh.jpeg" alt="Jaspreet Singh" className="developer-pic"/>
                <p>Blockup id: 60a27d57862e570de3ada7da</p>
                <p>Email: jaspreetsingh7798</p>
                <a className="developer-links" href="https://github.com/jas-singh-code">Github: https://github.com/jas-singh-code</a>
                <a className="developer-links" href="https://www.linkedin.com/in/jaspreet-singh-software-engineer/">Linkedin: https://www.linkedin.com/in/jaspreet-singh-software-engineer/</a>
               
            </div>

            <div className="individual-container">

                <h3>Lijun Gan</h3>
                <img src="lijun_gan.png" alt="Lijun Gan" className="developer-pic"/>
                <p>Blockup id: 60633293e2e3a540721cb55d</p>
                <p>Email: gan.lijun.glj@gmail.com</p>
                <a className="developer-links" href="https://github.com/Lijun-Gan">Github: https://github.com/Lijun-Gan</a>
                <a className="developer-links" href="https://www.linkedin.com/in/lijun-gan/">Linkedin: https://www.linkedin.com/in/lijun-gan/</a>
               
            </div>


          </div>
      </div>
    );
  }
}

export default Developers;
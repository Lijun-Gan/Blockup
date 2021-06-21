import React from "react";
// import { Link } from "react-router-dom";
import ChatBoxContainer from "./messages/chat_box_container";
import SideRoomIndexContainer from "./rooms/side_room_index_container";

function WebApp() {
  return (
    <div className="webapp">
      <div className="webappbody">
        <SideRoomIndexContainer />
        <ChatBoxContainer />
      </div>
    </div>
  );
}

// class WebApp extends React.Component {
//   constructor(props) {
//     super(props);

//     this.twoFactorCheck = this.twoFactorCheck.bind(this);
//   };
  
//   twoFactorCheck() {
//     if (this.props.verified) {
//       return (
//         <div className="webapp">
//           <div className="webappbody">
//             <SideRoomIndexContainer />
//             <ChatBoxContainer />
//           </div>
//         </div>
//       );
//     } else {
//       return (
//         <div>
//           <Link to={"/twoFASetup"}>Please set up 2FA</Link>
//         </div>
//       )
//     }
//   };

//   render() {
//     return (
//       <div>
//         {this.twoFactorCheck()}
//       </div>
//     )
//   }
// }

export default WebApp;

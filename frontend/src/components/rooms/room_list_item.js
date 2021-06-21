import React from 'react';

class RoomListItem extends React.Component {
    constructor(props){
        super(props);

    }

    render() {
        const {name} = this.props
        return(
            <li className="room-item">
                <div className="room-name">
                    {name}
                </div>
            </li>
        )
    }
}

export default (RoomListItem);
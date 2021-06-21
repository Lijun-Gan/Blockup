import { connect } from 'react-redux';
import WebApp from './web_app';

const mapStateToProps = (state, ownProps) => {
    return ({
        verified: state.session.isVerified,
    })
};

export default connect(mapStateToProps, null)(WebApp);
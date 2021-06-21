// import React from "react";
// import { connect } from "react-redux";
// import { Route, Redirect, withRouter } from "react-router-dom";

// // Passed in from parent component or from mapStateToProps
// const Auth = ({ component: Component, path, loggedIn, verified, exact }) => (
//   <Route
//     path={path}
//     exact={exact}
//     render={(props) =>
//       loggedIn ? (
//         verified ? (
//           <Redirect to="/web" />
//         ) : (
//           <Redirect to="/twoFASetup" />
//         )
//       ) : (
//         // Redirect to the tweets page if the user is authenticated
//         <Component {...props} />
//       )
//     }
//   />
// );

// const Protected = ({ component: Component, loggedIn, verified, ...rest }) => (
//   <Route
//     {...rest}
//     render={(props) =>
//       loggedIn ? (
//         verified ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/twoFASetup" />
//         )
//       ) : (
//         // Redirect to the login page if the user is already authenticated
//         <Redirect to="/login" />
//       )
//     }
//   />
// );

// // Use the isAuthenitcated slice of state to determine whether a user is logged in

// const mapStateToProps = (state) => ({
//   loggedIn: state.session.isAuthenticated,
//   verified: state.session.isVerified,
// });

// export const AuthRoute = withRouter(connect(mapStateToProps)(Auth));

// export const ProtectedRoute = withRouter(connect(mapStateToProps)(Protected));

import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, withRouter } from "react-router-dom";

const Auth = ({ component: Component, path, loggedIn, exact }) => (
  <Route
    path={path}
    exact={exact}
    render={(props) =>
      !loggedIn ? <Component {...props} /> : <Redirect to="/web" />
    }
  />
);

const Protected = ({ component: Component, loggedIn, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      loggedIn ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

const TwoFA = ({ component: Component, loggedIn, verified, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      loggedIn ? (
        verified ? (
          <Component {...props} />
        ) : (
          <Redirect to="/twoFASetup" />
        )
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

const mapStateToProps = (state) => ({
  loggedIn: state.session.isAuthenticated,
  verified: state.session.isVerified,
});

export const AuthRoute = withRouter(connect(mapStateToProps)(Auth));

export const ProtectedRoute = withRouter(connect(mapStateToProps)(Protected));

export const TwoFAProtectedRoute = withRouter(connect(mapStateToProps)(TwoFA));

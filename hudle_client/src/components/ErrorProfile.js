import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";

const ErrorProfile = () => {

  useEffect(() => {

  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h4>Please create profile to see relevant jobs..</h4>
      </header>
    </div>
  );
};

export default ErrorProfile;

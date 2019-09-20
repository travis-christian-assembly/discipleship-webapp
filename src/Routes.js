import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/AppliedRoute";
import Course from "./containers/Course";
import Home from "./containers/Home";
import Login from "./containers/Login";
import NewCourse from "./containers/NewCourse";
import NotFound from "./containers/NotFound";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/courses/new" exact component={NewCourse} props={childProps} />
    <AppliedRoute path="/courses/:id" exact component={Course} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;

import { API } from "aws-amplify";
import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      courses: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const courses = await this.courses();
      this.setState({ courses });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  courses() {
    return API.get("courses", "/courses");
  }

  renderCoursesList(courses) {
    return [{}].concat(courses).map(
      (course, i) =>
        i !== 0
          ? <LinkContainer
              key={course.CourseId}
              to={`/courses/${course.CourseId}`}
            >
              <ListGroupItem header={course.Description.trim().split("\n")[0]}>
                {"最后更新于：" + new Date(course.LastTouchedAt).toLocaleString()}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/courses/new"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> 创建新课程
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Discipleship</h1>
        <p>A simple mentorship app</p>
      </div>
    );
  }

  renderCourses() {
    return (
      <div className="courses">
        <PageHeader>您的课程</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderCoursesList(this.state.courses)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderCourses() : this.renderLander()}
      </div>
    );
  }
}

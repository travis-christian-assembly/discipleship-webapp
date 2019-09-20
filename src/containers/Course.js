import { API } from "aws-amplify";
import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Course.css";

export default class Course extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: null,
      isDeleting: null,
      course: null,
      description: "",
      revision: null
    };
  }

  async componentDidMount() {
    try {
      const course = await this.getCourse();
      const { Description, Revision } = course;

      this.setState({
        course: course,
        description: Description,
        revision: Revision
      });
    } catch (e) {
      alert(e);
    }
  }

  getCourse() {
    return API.get("courses", `/courses/${this.props.match.params.id}`);
  }

  validateForm() {
    return this.state.description.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  saveCourse(course) {
    return API.put("courses", `/courses/${this.props.match.params.id}`, {
      body: course
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.saveCourse({
        description: this.state.description,
        revisionToUpdateFrom: this.state.revision
      });
      this.props.history.push("/");
    } catch (e) {
      if (409 == e.response.status) {
        alert("Someone else has updated this course already, please refresh and retry again.");
      } else {
        alert("Sorry, we have encountered some errors, please refresh and try again.");
      }

      this.setState({ isLoading: false });
    }
  }

  deleteCourse() {
    return API.del("courses", `/courses/${this.props.match.params.id}`);
  }

  handleDelete = async event => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    this.setState({ isDeleting: true });

    try {
      await this.deleteCourse();
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isDeleting: false });
    }
  }

  render() {
    return (
      <div className="Course">
        {this.state.course &&
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="description">
              <FormControl
                onChange={this.handleChange}
                value={this.state.description}
                componentClass="textarea"
              />
            </FormGroup>
            <LoaderButton
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
              isLoading={this.state.isLoading}
              text="Save"
              loadingText="Saving…"
            />
            <LoaderButton
              block
              bsStyle="danger"
              bsSize="large"
              isLoading={this.state.isDeleting}
              onClick={this.handleDelete}
              text="Delete"
              loadingText="Deleting…"
            />
          </form>}
      </div>
    );
  }
}

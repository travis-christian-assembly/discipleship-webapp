import { API } from "aws-amplify";
import React, { Component } from "react";
import { FormGroup, FormControl} from "react-bootstrap";
import uuid from "uuid";
import LoaderButton from "../components/LoaderButton";
import "./NewCourse.css";

export default class NewCourse extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      description: ""
    };
  }

  validateForm() {
    return this.state.description.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = event => {
    this.file = event.target.files[0];
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await this.createCourse({
        description: this.state.description
      });
      this.props.history.push("/");
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  }

  createCourse(course) {
    return API.put("courses", "/courses/"+uuid.v4(), {
      body: course
    });
  }

  render() {
    return (
      <div className="NewCourse">
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
            text="创建"
            loadingText="创建中.."
          />
        </form>
      </div>
    );
  }
}

import React, { memo, useEffect, useRef } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./signup.css";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userAuthentication } from "../../redux/authSlice";

const Signup = memo(() => {
  const passwordRef = useRef(null);
  const emailRef = useRef();
  const nameRef = useRef();

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  // console.log(passwordRef);
  const handleSubmit = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current.value;
    try {
      await dispatch(userAuthentication({ type: "SIGNUP", email, password }));
    } catch (error) {
      console.error("Authentication failed:", error.message);
      // Handle the error as needed (e.g., display an error message)
    }
  };

  return (
    <MDBContainer
      fluid
      className="d-flex align-items-center py-12 justify-content-center bg-image"
      style={{
        backgroundImage:
          "url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)",
      }}
    >
      <div className="mask gradient-custom-3"></div>
      <MDBCard className="m-5" style={{ maxWidth: "600px" }}>
        <MDBCardBody className="px-5">
          <h2 className="text-uppercase text-center mb-5">Create an account</h2>
          <MDBInput
            ref={nameRef}
            wrapperClass="mb-4"
            label="Your Name"
            size="lg"
            id="form1"
            type="text"
          />
          <MDBInput
            ref={emailRef}
            wrapperClass="mb-4"
            label="Your Email"
            size="lg"
            id="form2"
            type="email"
          />
          <MDBInput
            ref={passwordRef}
            wrapperClass="mb-4"
            label="Password"
            size="lg"
            id="form3"
            type="password"
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Repeat your password"
            size="lg"
            id="form4"
            type="password"
          />
          <div className="d-flex flex-row justify-content-center mb-4">
            <MDBCheckbox
              name="flexCheck"
              id="flexCheckDefault"
              label="I agree all statements in Terms of service"
            />
          </div>
          <MDBBtn
            className="mb-4 w-100 gradient-custom-4"
            size="lg"
            onClick={handleSubmit}
          >
            Sign Up
          </MDBBtn>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <NavLink to="/login" className="font-medium text-gray-900">
              Log In
            </NavLink>
          </Typography>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
});

export default Signup;

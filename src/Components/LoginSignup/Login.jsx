import React, { memo, useRef } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
} from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userAuthentication } from "../../redux/authSlice";

const Login = memo(() => {
  const email = useRef();
  const password = useRef();

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  return (
    <MDBContainer className="my-5 w-[60%]">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <MDBCardImage
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
              alt="login form"
              className="rounded-start w-100"
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex flex-row mt-2">
                <MDBIcon
                  fas
                  icon="cubes fa-3x me-3"
                  style={{ color: "#ff6219" }}
                />
                <span className="h1 fw-bold mb-0">Logo</span>
              </div>

              <h5
                className="fw-normal my-4 pb-3"
                style={{ letterSpacing: "1px" }}
              >
                Sign into your account
              </h5>

              <MDBInput
                ref={email}
                wrapperClass="mb-4"
                label="Email address"
                id="formControlLg1"
                type="email"
                size="lg"
              />
              <MDBInput
                ref={password}
                wrapperClass="mb-4"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
              />

              <MDBBtn
                onClick={() => {
                  dispatch(
                    userAuthentication({
                      type: "LOGIN",
                      email: email.current.value,
                      password: password.current.value,
                    }),
                  );
                }}
                className="mb-4 px-5"
                color="dark"
                size="lg"
              >
                Login
              </MDBBtn>
              <Link className="small text-muted text-center" to={""}>
                Forgot password?
              </Link>
              <p className="mb-5 pb-lg-2  text-center">
                Don't have an account?{" "}
                <Link to={"/signup"} style={{ color: "#393f81" }}>
                  Sign Up
                </Link>
              </p>

              <div className="d-flex flex-row justify-center">
                <a href="#!" className="small text-muted me-1">
                  Terms of use.
                </a>
                <a href="#!" className="small text-muted">
                  Privacy policy
                </a>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
});

export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--nb-var(--nb-white));
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: var(--nb-var(--nb-white));
    top: -200px;
    right: -200px;
    animation: float 6s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: var(--nb-var(--nb-white));
    bottom: -150px;
    left: -150px;
    animation: float 8s ease-in-out infinite reverse;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    50% {
      transform: translateY(-30px) rotate(10deg);
    }
  }
`;

const LoginWrapper = styled.div`
  display: flex;
  background: var(--nb-muted);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: var(--nb-shadow-md);
  overflow: hidden;
  width: 100%;
  max-width: 950px;
  border: 1px solid var(--nb-border);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageSection = styled.div`
  flex: 1;
  background: var(--nb-var(--nb-white));
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;

  @media (max-width: 768px) {
    padding: 20px;
    display: none;
  }
`;

const LoginImage = styled.div`
  width: 100%;
  height: 400px;
  background-image: url("https://www.reuters.com/resizer/v2/EU6AFEL2QFP7ZGPN3E6AWXE5LI.jpg?auth=8486956e1d4a506b94571daa93fc60a33e9ed951b6c61e218ad9f52cab631a2a&width=6324&quality=80");
  background-size: cover;
  background-position: center;
  border-radius: 15px;
  position: relative;
  border: 2px solid var(--nb-orange);
  box-shadow: var(--nb-shadow-md);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--nb-var(--nb-white));
    border-radius: 15px;
  }
`;

const LoginFormSection = styled.div`
  flex: 1;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const FormTitle = styled.h2`
  color: var(--nb-ink);
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
  font-size: 1.8rem;
  text-shadow: none;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  img {
    max-width: 150px;
    height: auto;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--nb-ink);
  font-size: 0.9rem;
  font-weight: 500;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--nb-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--nb-muted);
  color: var(--nb-ink);

  &::placeholder {
    color: var(--nb-ink);
  }

  &:focus {
    border-color: var(--nb-orange);
    box-shadow: var(--nb-shadow-md);
    outline: none;
    background: var(--nb-muted);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: var(--nb-var(--nb-white));
  color: var(--nb-blue);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: var(--nb-shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--nb-shadow-md);
    background: var(--nb-var(--nb-white));
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: var(--nb-muted);
    color: var(--nb-ink);
    cursor: not-allowed;
    transform: none;
    box-shadow: var(--nb-shadow-md);
  }
`;

const ErrorMessage = styled.p`
  color: var(--nb-orange);
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  background: var(--nb-muted);
  padding: 0.75rem;
  border-radius: 6px;
  border: 2px solid var(--nb-orange);
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: var(--nb-ink);
  font-size: 0.8rem;

  a {
    color: var(--nb-orange);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
      color: var(--nb-ink);
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:2500/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Dispatch custom event to notify App component
      window.dispatchEvent(new Event("userLogin"));

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else if (res.data.user.role === "retailer") {
        navigate("/retailer");
      } else {
        navigate("/staff");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginWrapper>
        <ImageSection>
          <LoginImage />
        </ImageSection>

        <LoginFormSection>
          <Logo>
            {/* Replace with your actual logo */}
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                background: "var(--nb-blue) 0%, var(--nb-blue) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "10px",
                
              }}
            >
              Business Distribution CRM
            </div>
          </Logo>

          <FormTitle>Welcome Back</FormTitle>

          <form onSubmit={handleLogin}>
            <InputGroup>
              <InputLabel>Email Address</InputLabel>
              <InputField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </InputGroup>

            <InputGroup>
              <InputLabel>Password</InputLabel>
              <InputField
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </InputGroup>

            <SubmitButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>{" "}
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </SubmitButton>

            {error && <ErrorMessage>{error}</ErrorMessage>}
          </form>

          <FooterText>
            Forgot your password? <a href="/forgot-password">Reset it here</a>
          </FooterText>
        </LoginFormSection>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default Login;

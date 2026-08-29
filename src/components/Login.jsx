import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: email,
          password: password
        }
      );

//        console.log("JWT RESPONSE:", response.data);
// localStorage.getItem("JWT Token");
//   localStorage.setItem("jwtToken", response.data);
const token =
  typeof response.data === "string"
    ? response.data
    : response.data.token;

console.log("JWT RESPONSE:", response.data);

if (!token) {
  throw new Error("JWT token not received from server");
}

localStorage.setItem("token", token);

console.log(
  "JWT SAVED:",
  localStorage.getItem("token")
);

onLogin(token);

 



    } catch (error) {

      setError("Invalid email or password");

    }
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-body p-4">

              <h2 className="text-center text-primary mb-4">
                🏠 Real Estate Lead Manager
              </h2>

              <h4 className="text-center mb-4">
                Admin Login
              </h4>

              <form onSubmit={handleLogin}>

                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                </div>

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Login
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
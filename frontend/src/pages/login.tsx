import React, { useState } from "react";
import { login } from "../api/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login(email, password);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("email", email);
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2> Login </h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;

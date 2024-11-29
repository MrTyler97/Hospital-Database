import React, { useState } from "react";
import { login } from "../api/api";
import style from "./login.module.css";

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
    <div className={style.container}>
      <h2 className={style.heading}> Login </h2>
      <form onSubmit={handleLogin}>
        <input
          className={style.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          className={style.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button className={style.button} type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

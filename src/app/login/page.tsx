"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      return router.push("/chat");
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);

      router.push("/chat");
    } else {
      console.error("Login failed");
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <form onSubmit={handleLogin} className="text-center">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="form-control form-control-lg mb-3"
          autoFocus
        />
        <button type="submit" className="btn btn-lg btn-primary form-control">Start Chat</button>
      </form>
    </div>
  );
}

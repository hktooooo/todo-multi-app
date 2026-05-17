import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            const response = await fetch("http://localhost/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            console.log(data);

            // ログイン失敗
            if (!response.ok) {
                alert(data.message);
                return;
            }

            // token保存
            localStorage.setItem("token", data.token);

            alert("ログイン成功");

            navigate("/tasks");

        } catch (error) {
            console.error(error);

            alert("通信エラー");
        }
    };

    return (
        <div className="container">
            <h1 className="title">ログイン</h1>

            <input
                className="input"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="input"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="button" onClick={login}>
                ログイン
            </button>

            <Link className="link" to="/register">
                新規登録はこちら
            </Link>
        </div>
    );
}

export default Login;
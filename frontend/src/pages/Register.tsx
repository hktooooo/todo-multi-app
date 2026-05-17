import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async () => {
        try {
            const response = await fetch("http://localhost/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            console.log(data);

            localStorage.setItem("token", data.token);

            alert("登録成功");
        } catch (error) {
            console.error(error);
            alert("登録失敗");
        }
    };

    return (
        <div className="container">
            <h1 className="title">ユーザー登録</h1>

            <input
                className="input"
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

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

            <button className="button" onClick={register}>
                登録
            </button>

            <Link to="/login">
                ログインはこちら
            </Link>
        </div>
    );
}

export default Register;
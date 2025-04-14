import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import axios from "../axiosConfig";
import { jwtDecode } from "jwt-decode"; // ro‘lni dekod qilish uchun
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTelegram } from "react-icons/bs";
import { HomeIcon } from "./Register";

function Login() {
  const [loginData, setLoginData] = React.useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  // form change
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginData.username === "" || loginData.password === "") {
      toast.error("Iltimos, barcha maydonlarni to'ldiring!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      // JWT endpoint: /api/token/
      const res = await axios.post("/accounts/token/", {
        username: loginData.username,
        password: loginData.password,
      });

      // Agar access bo‘lsa => localStorage
      if (res.data?.access) {
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh || "");
        toast.success("Logged in successfully!", {
          position: "top-center",
          autoClose: 2000,
        });

        // ro‘lni decode qilamiz
        const jwtDecoded = jwtDecode(res.data.access);
        const userRole = jwtDecoded.role; // 'admin','operator','courier','physical','legal' ...
        // user role ga qarab nav
        console.log(userRole);
        if (userRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (userRole === "operator") {
          navigate("/operator", { replace: true });
        } else if (userRole === "courier") {
          navigate("/courier", { replace: true });
        } else {
          // demak physical or legal
          navigate("/user/my-shipments", { replace: true });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Username yoki parol xato yoki user active emas!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <LoginWrapper>
      <HomeIcon onClick={() => navigate("/")} />
      <div className="left">
        <div className="login-content">
          <h1>Foydalanuvchini avtorizatsiya qilish</h1>
          <form onChange={handleChange} onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Foydalanuvchi nomi"
            />
            <input
              type="password"
              name="password"
              placeholder="Foydalanuvchi paroli"
            />
            <button type="submit">Kirish</button>
          </form>
          {/* If does not exist account */}
          <div className="register">
            <p>
              <span>Hisobingiz yo'qmi? </span>
              <Link to="/register">Ro'yxatdan o'ting</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="right">
        <div className="top">
          <img src="/tujjor_logo.png" alt="" />
        </div>
        <div className="bottom">
          <h2>
            <strong>Tujjor Express</strong> - Tezkor yetkazib berish xizmati
          </h2>
          <p>Hammasi biz bilan qulay va oson!</p>
          <div className="social-media">
            <Link to="#">
              <FaFacebook />
            </Link>
            <Link to="#">
              <BsInstagram />
            </Link>
            <Link to="#">
              <BsTelegram />
            </Link>
          </div>
        </div>
      </div>
    </LoginWrapper>
  );
}

export default Login;

const LoginWrapper = styled.div`
  /* Bu yerga login.scss o‘rniga styled-components kodlari */
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background-color: #f9f9f9;

  .left {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-content {
      width: 75%;
      padding: 3rem 2rem;
      margin: 0 auto;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      background-color: #fff;
      animation: fadeIn 0.5s ease-in-out;

      h1 {
        text-align: center;
        margin-bottom: 2rem;
        font-size: 1.5rem;
        color: #333;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          &:focus {
            border-color: #f59023;
            box-shadow: 0 0 5px rgba(245, 144, 35, 0.5);
            outline: none;
          }
        }
        button {
          padding: 10px;
          border: none;
          border-radius: 5px;
          background-color: #f59023;
          color: #ffffff;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          transition: background-color 0.3s ease;
          &:hover {
            background-color: #e07c1e;
          }
          &:focus {
            outline: 2px solid #f59023;
            outline-offset: 2px;
          }
        }
      }
    }
  }

  .right {
    background: linear-gradient(135deg, #f9f9f9, #ffffff);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    text-align: center;

    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 2rem;
      img {
        width: 65%;
        max-width: 80%;
        border-radius: 8px;
      }
    }
    .bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 2vh;
      h2 {
        margin-bottom: 1rem;
        font-size: 1.25rem;
        color: #333;
      }
      p {
        margin-bottom: 1.5rem;
        font-size: 0.875rem;
        color: #555;
      }
      .social-media {
        display: flex;
        justify-content: center;
        gap: 1rem;

        a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3rem;
          height: 3rem;
          background-color: #f59023;
          color: #fff;
          border-radius: 50%;
          transition: all 0.3s ease;
          svg {
            width: 1.5rem;
            height: 1.5rem;
          }
          &:hover {
            background-color: #fff;
            border: 1px solid #f59023;
            color: #f59023;
            svg {
              transform: scale(1.1);
            }
          }
        }
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    .left,
    .right {
      min-height: 50vh;
    }
  }
`;

import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Home } from "lucide-react";
import axios from "../axiosConfig";

export default function Register() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = React.useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password2: "",
  });

  const [step, setStep] = React.useState(1); // 1 - form, 2 - verify
  const [code, setCode] = React.useState("");
  const [timer, setTimer] = React.useState(300); // 5 daqiqa (300s)

  // timer bosish
  React.useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // forma o'zgarishi
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // royxatdan o'tish
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { username, email, phone_number, password, password2 } = loginData;

      if (!username || !email || !phone_number || !password || !password2) {
        toast.error("Iltimos, barcha maydonlarni to'ldiring!", {
          position: "top-center",
        });
        return;
      }

      if (password !== password2) {
        toast.error("Parollar mos kelmaydi!", { position: "top-center" });
        return;
      }

      await axios.post("/accounts/register/", loginData);
      toast.success("SMS kodi yuborildi!", { position: "top-center" });
      setStep(2);
      setTimer(300);
    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.password && Array.isArray(errorData.password)) {
        errorData.password.forEach((msg) => {
          toast.error(msg, { position: "top-center" });
        });
      } else {
        toast.error("Ro'yxatdan o'tishda xatolik!", { position: "top-center" });
      }
    }
  };

  // sms kod tekshirish
  const handleVerify = async () => {
    try {
      const res = await axios.post("/accounts/verify-phone/", {
        username: loginData.username, // username kerak!
        code: code,
      });

      toast.success(res.data.detail || "Muvaffaqiyatli tasdiqlandi!");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Kod noto'g'ri yoki muddati tugagan.";
      toast.error(errorMessage, { position: "top-center" });
    }
  };

  // qayta yuborish
  const handleResend = async () => {
    try {
      await axios.post("/api/accounts/resend-sms/", {
        phone_number: loginData.phone_number,
      });
      setTimer(300);
      toast.success("Kod qayta yuborildi.");
    } catch (err) {
      toast.error("Kod yuborishda xatolik.");
    }
  };

  return (
    <Container>
      <Left>
        <HomeIcon onClick={() => navigate("/")} />
        <div className="logo">
          <img src="/tujjor_logo.png" alt="Logo" />
        </div>
        <p>Siz allaqachon ro'yxatdan o'tganmisiz?</p>
        <button onClick={() => navigate("/login")}>Kirish</button>
      </Left>

      <Right>
        {step === 1 ? (
          <>
            <h1>Hisob yaratish</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Foydalanuvchi nomi"
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email manzili"
                onChange={handleChange}
              />
              <input
                type="text"
                name="phone_number"
                placeholder="Telefon raqami"
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Parol"
                onChange={handleChange}
              />
              <input
                type="password"
                name="password2"
                placeholder="Parolni tasdiqlang"
                onChange={handleChange}
              />
              <button type="submit">Ro'yxatdan o'tish</button>
            </form>
          </>
        ) : (
          <>
            <h1>Telefon raqamni tasdiqlang</h1>
            <p>{loginData.phone_number} raqamiga SMS kod yuborildi</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="SMS kodni kiriting"
            />
            <button onClick={handleVerify}>Tasdiqlash</button>
            {timer > 0 ? (
              <p>
                Qayta yuborish mumkin: {Math.floor(timer / 60)}:
                {(timer % 60).toString().padStart(2, "0")}
              </p>
            ) : (
              <button onClick={handleResend}>Kod qayta yuborilsin</button>
            )}
          </>
        )}
      </Right>
    </Container>
  );
}

// -------- Styling ---------

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
`;

const Left = styled.div`
  background: #433224;
  color: #fff;
  flex: 0.75;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 30vw;
    height: auto;
  }
  p {
    margin: 2rem 0;
    font-size: 1.2rem;
    text-align: center;
    max-width: 80%;
    line-height: 1.5;
    font-weight: 400;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  button {
    background-color: #f5f5f5;
    color: #433224;
    border: none;
    padding: 0.5rem 2rem;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1.2rem;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #e0e0e0;
    }
  }
`;

const Right = styled.div`
  flex: 1.25;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #433224;
  }
  p {
    margin: 0.5rem 0;
    font-size: 1rem;
    color: #444;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 80%;
    margin-bottom: 1rem;
    font-family: "Poppins", sans-serif;
    font-size: 1rem;
    font-weight: 500;
    color: #444;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  input {
    padding: 0.5rem;
    margin: 0.5rem 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;
    width: 100%;
    &:focus {
      border-color: #f59023;
      box-shadow: 0 0 5px rgba(245, 144, 35, 0.5);
      outline: none;
    }
  }
  button {
    padding: 0.5rem;
    border: none;
    border-radius: 5px;
    background-color: #f59023;
    color: #ffffff;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: background-color 0.3s ease;
    margin-top: 0.5rem;
    &:hover {
      background-color: #e07c1e;
    }
  }
`;

export const HomeIcon = styled(Home)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: #f59023;
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
  cursor: pointer;
  &:hover {
    color: #e07c1e;
  }
  transition: color 0.3s ease;
`;

import { Clock10Icon, ShieldCheck, Wallet, WalletCards } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default function Home() {
  return (
    <Container>
      <NavbarContainer>
        <span>TUJJOR EXPRESS</span>
      </NavbarContainer>
      <Content>
        <span>O'zbekiston bo'ylab tez, ishonchli yetkazmalar</span>
      </Content>
      <BottomItem>
        <div className="func-menu">
          <CtaButton to="/login">Boshlash</CtaButton>
          <CardBtn>
            <Clock10Icon />
            <div className="text">
              <span>24 soatda tezkor yetkazib berish</span>
            </div>
          </CardBtn>
          <CardBtn>
            <Wallet />
            <div className="text">
              <span>Hamyonbop narxlar</span>
            </div>
          </CardBtn>
          <CardBtn>
            <ShieldCheck />
            <div className="text">
              <span>Xavfsiz va o'z vaqtida yetkazib berish</span>
            </div>
          </CardBtn>
        </div>
      </BottomItem>
    </Container>
  );
}

const NavbarContainer = styled.div`
  flex: 0.25;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 2;
  span {
    color: #fff;
    font-family: "Poppins", sans-serif;
    font-size: 1.5rem;
    margin-left: 20px;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  font-family: "Poppins", sans-serif;
  background-image: url("back-hero.png");
  background-position: right center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.35);
    z-index: 1;
  }
`;

const Content = styled.div`
  flex: 2.5;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 2;
  span {
    color: #fff;
    font-family: "Poppins", sans-serif;
    max-width: 70%;
    margin: 0 auto;
    font-size: 2.25rem;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  p {
    color: #fff;
    font-size: 1.5rem;
    text-align: center;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    font-weight: 500;
  }
`;

const BottomItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  color: #fff;
  font-size: 1.5rem;
  z-index: 2;
  .func-menu {
    position: relative;
    background-color: #fff;
    width: 70%;
    height: 17.5vh;
    border-radius: 1vw;
    border: 0.2vw solid #f0a500;
    display: flex;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
  }
`;

const CardBtn = styled.div`
  flex: 1;
  color: #000;
  display: flex;
  align-items: center;
  svg {
    flex: 0.5;
    width: 7.5vh;
    height: 7.5vh;
    color: #f0a500;
  }
  .text {
    flex: 1;
    display: flex;
    margin-left: 10px;
    span {
      font-size: 1.5rem;
      font-weight: 500;
      color: #000;
    }
  }
`;

const CtaButton = styled(Link)`
  position: absolute;
  top: -3.5vh;
  left: 50%;
  transform: translateX(-50%);
  height: 7vh;
  width: 12vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  background: #f0a500;
  color: #fff;
  text-decoration: none;
  border-radius: 1vw;
  font-weight: 500;
  transition: background 0.3s ease;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  &:hover {
    background: #cf8600;
  }
`;

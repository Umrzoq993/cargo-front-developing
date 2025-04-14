import styled from "styled-components";
import { Link } from "react-router-dom";

export const Wrapper = styled.div`
  display: flex;
  height: 100vh;
`;

export const Sidebar = styled.div`
  background-color: ${({ theme }) => theme.sidebar};
  color: ${({ theme }) => theme.text};
  transition: width 0.3s ease;
  width: ${(props) => (props.$collapsed ? "60px" : "200px")};
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: 2rem;
  h3 {
    margin-left: 1rem;
    font-size: 1.1rem;
  }
`;

export const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: #f59023;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  gap: 1rem;
  color: ${(props) => (props.$active ? "#f59023" : "#fff")};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  .icon {
    min-width: 24px;
    display: flex;
    justify-content: center;
  }
  .label {
    display: ${(props) => (props.$collapsed ? "none" : "inline")};
    white-space: nowrap;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #f59023;
  }
`;

export const Content = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  padding: 2rem;
  overflow-y: auto;
`;

export const ProfileBox = styled.div`
  margin-top: auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$collapsed ? "0" : "0.75rem")};
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #f59023;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .username {
    font-size: 0.95rem;
    font-weight: 500;
    text-transform: capitalize;
  }
`;

export const Navbar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

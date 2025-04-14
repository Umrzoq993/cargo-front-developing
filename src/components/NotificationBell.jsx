import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import styled from "styled-components";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/shipments/");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "shipment_status_changed") {
        setCount((prev) => prev + 1);
      }
    };

    socket.onopen = () => console.log("🔗 WebSocket ulanishi o‘rnatildi.");
    socket.onerror = (e) => console.error("❌ WS xatolik:", e);
    socket.onclose = () => console.log("🔌 WS uzildi.");

    return () => socket.close();
  }, []);

  return (
    <Wrapper>
      <Bell />
      {count > 0 && <Badge>{count}</Badge>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  padding: 0.5rem;
`;

const Badge = styled.span`
  position: absolute;
  top: 0px;
  right: 0px;
  background: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.75rem;
`;

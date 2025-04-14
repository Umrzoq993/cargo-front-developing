import React from "react";
import styled from "styled-components";
import { Users, Truck, PackageSearch } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const stats = [
  { title: "Buyurtmalar", count: 1245, icon: <PackageSearch /> },
  { title: "Foydalanuvchilar", count: 830, icon: <Users /> },
  { title: "Faol kuryerlar", count: 54, icon: <Truck /> },
];

const monthlyData = [
  { name: "Yan", orders: 120 },
  { name: "Fev", orders: 200 },
  { name: "Mar", orders: 350 },
  { name: "Apr", orders: 500 },
  { name: "May", orders: 420 },
  { name: "Iyun", orders: 380 },
];

export default function Dashboard() {
  return (
    <Wrapper>
      <h2>Dashboard</h2>
      <StatGrid>
        {stats.map((item, i) => (
          <Card key={i}>
            <div className="icon">{item.icon}</div>
            <div className="info">
              <h4>{item.title}</h4>
              <p>{item.count}</p>
            </div>
          </Card>
        ))}
      </StatGrid>

      <ChartBox>
        <h3>Oylik buyurtmalar statistikasi</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="orders" fill="#f59023" />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 1rem;
  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.75rem;
    color: #433224;
  }
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  .icon {
    background: #f59023;
    color: #fff;
    padding: 0.75rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info {
    h4 {
      margin: 0;
      font-size: 1rem;
      color: #333;
    }
    p {
      margin: 0.25rem 0 0;
      font-weight: bold;
      font-size: 1.25rem;
    }
  }
`;

const ChartBox = styled.div`
  background: #fff;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  h3 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
    color: #333;
  }
`;

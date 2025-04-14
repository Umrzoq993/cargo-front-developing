import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";

export default function AddShipments({ onSuccess }) {
  const [form, setForm] = useState({
    receiver_name: "",
    receiver_phone: "",
    weight: "",
    origin_branch: "",
    destination_branch: "",
    pickup_type: "courier_pickup",
    delivery_type: "courier_delivery",
    payment_responsibility: "receiver",
  });

  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axios.get("/branches/branches/");
        setBranches(res.data.results);
      } catch (err) {
        toast.error("Ofislar ro‘yxatini olishda xatolik");
      }
    };
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  console.log(form);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/shipments/shipments/", form);
      toast.success("Yuk muvaffaqiyatli qo‘shildi");
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      toast.error("Yukni qo‘shishda xatolik");
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <FormGroup>
        <label>Qabul qiluvchi ismi</label>
        <input
          type="text"
          name="receiver_name"
          value={form.receiver_name}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <label>Telefon raqami</label>
        <input
          type="text"
          name="receiver_phone"
          value={form.receiver_phone}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <label>Og‘irlik (kg)</label>
        <input
          type="number"
          name="weight"
          value={form.weight}
          onChange={handleChange}
          step="0.1"
          required
        />
      </FormGroup>

      <FormGroup>
        <label>Jo‘natuvchi ofis</label>
        <select
          name="origin_branch"
          value={form.origin_branch}
          onChange={handleChange}
          required
        >
          <option value="">Tanlang</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </FormGroup>

      <FormGroup>
        <label>Yetkaziladigan ofis</label>
        <select
          name="destination_branch"
          value={form.destination_branch}
          onChange={handleChange}
          required
        >
          <option value="">Tanlang</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </FormGroup>

      <FormGroup>
        <label>Olish usuli</label>
        <select
          name="pickup_type"
          value={form.pickup_type}
          onChange={handleChange}
        >
          <option value="courier_pickup">Kuryer olib ketadi</option>
          <option value="office_dropoff">Ofisga olib boriladi</option>
        </select>
      </FormGroup>

      <FormGroup>
        <label>Yetkazish usuli</label>
        <select
          name="delivery_type"
          value={form.delivery_type}
          onChange={handleChange}
        >
          <option value="courier_delivery">Kuryer yetkazadi</option>
          <option value="office_pickup">Ofisdan olinadi</option>
        </select>
      </FormGroup>

      <FormGroup>
        <label>To‘lov mas’uliyati</label>
        <select
          name="payment_responsibility"
          value={form.payment_responsibility}
          onChange={handleChange}
        >
          <option value="sender">Yuboruvchi</option>
          <option value="receiver">Qabul qiluvchi</option>
        </select>
      </FormGroup>

      <SubmitButton type="submit">✅ Yaratish</SubmitButton>
    </FormWrapper>
  );
}

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.card || "#fff"};
  color: ${({ theme }) => theme.text || "#000"};
  border-radius: 8px;
  width: 95%;
  max-height: 60vh;
  overflow-y: auto;

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 0.25rem;
    font-weight: 500;
  }

  input,
  select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    background-color: #f9f9f9;
  }
`;

const SubmitButton = styled.button`
  padding: 0.6rem 1.2rem;
  background: #f59023;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #d8771c;
  }
`;

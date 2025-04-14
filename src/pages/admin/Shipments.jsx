// Shipments.jsx (yuk holati tarixini alohida modal bilan ko‘rsatish qo‘shildi)

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "../../axiosConfig";
import { toast } from "react-toastify";
import NotificationBell from "../../components/NotificationBell";
import { Clock, Edit, View } from "lucide-react";
import { ReactDialogBox } from "react-js-dialog-box";
import "react-js-dialog-box/dist/index.css";
import AddShipments from "./AddShipments";

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [historyLogs, setHistoryLogs] = useState([]);
  const [shipmentHistory, setShipmentHistory] = useState([]);
  const [addShipmentModal, setAddShipmentModal] = useState(false);

  const fetchShipments = async (url = "/shipments/shipments/") => {
    try {
      const res = await axios.get(url);
      setShipments(res.data.results);
      setFiltered(res.data.results);
      setPagination({
        count: res.data.count,
        next: res.data.next,
        previous: res.data.previous,
      });
      setLoading(false);
    } catch (err) {
      console.error("Xatolik:", err);
    }
  };

  // shipmentId orqali yuk tarixini olish
  const fetchShipmentHistory = async (shipmentId) => {
    try {
      const res = await axios.get(
        `/shipments/shipment-history/?shipment=${shipmentId}`
      );
      return res.data.results;
    } catch (err) {
      toast.error("Yuk tarixi olinmadi");
      return [];
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    if (selectedShipment) {
      fetchShipmentHistory(selectedShipment.id).then(setShipmentHistory);
    }
  }, [selectedShipment]);

  useEffect(() => {
    const q = query.toLowerCase();
    const result = shipments.filter((s) => {
      const matchSearch =
        s.tracking_code.toLowerCase().includes(q) ||
        s.receiver_name.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
    setFiltered(result);
  }, [query, statusFilter, shipments]);

  const getStatusColor = (status) => {
    switch (status) {
      case "client_created":
        return "#6c757d";
      case "approved":
        return "#0d6efd";
      case "in_transit":
        return "#17a2b8";
      case "arrived":
        return "#ffc107";
      case "delivered":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  const openStatusModal = (shipment) => {
    setSelectedShipment(shipment);
    setNewStatus(shipment.status);
    setModalType("status");
  };

  const openDetailModal = (shipment) => {
    setSelectedShipment(shipment);
    setModalType("detail");
  };

  const openHistoryModal = async (shipment) => {
    setSelectedShipment(shipment);
    setModalType("history");
    try {
      const res = await axios.get(
        `/shipments/shipment-history/?shipment=${shipment.id}`
      );
      setHistoryLogs(res.data?.results || []);
    } catch (err) {
      toast.error("Tarixni olishda xatolik");
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `/shipments/shipments/${selectedShipment.id}/change_status/`,
        {
          status: newStatus,
        }
      );

      const updated = shipments.map((s) =>
        s.id === selectedShipment.id ? { ...s, status: newStatus } : s
      );
      setShipments(updated);
      toast.success("Holat muvaffaqiyatli yangilandi!");
      setSelectedShipment(null);
      setModalType(null);
    } catch (err) {
      toast.error("Statusni o‘zgartirishda xatolik");
    }
  };

  return (
    <Wrapper>
      <Header>
        <div className="title">
          <h2>Buyurtmalar</h2>
        </div>
        <div className="functions">
          <input
            type="text"
            placeholder="Qidiruv: tracking yoki qabul qiluvchi"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Barchasi</option>
            <option value="client_created">Yangi</option>
            <option value="approved">Tasdiqlangan</option>
            <option value="in_transit">Yo‘lda</option>
            <option value="arrived">Yetib keldi</option>
            <option value="delivered">Topshirildi</option>
          </select>
          <button onClick={() => setAddShipmentModal(true)}>Qo'shish</button>
        </div>
      </Header>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking</th>
              <th>Jo‘natuvchi</th>
              <th>Qabul qiluvchi</th>
              <th>Yuk og‘irligi</th>
              <th>Holat</th>
              <th>Yaratilgan</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.tracking_code}</td>
                <td>{item.sender_name}</td>
                <td>
                  {item.receiver_name} <br /> {item.receiver_phone}
                </td>
                <td>{item.weight} kg</td>
                <td>
                  <Badge color={getStatusColor(item.status)}>
                    {item.status.replaceAll("_", " ")}
                  </Badge>
                </td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="actions">
                  <Edit onClick={() => openStatusModal(item)} />
                  <View onClick={() => openDetailModal(item)} />
                  <Clock onClick={() => openHistoryModal(item)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {addShipmentModal && (
        <ReactDialogBox
          headerText="📦 Yangi yuk qo‘shish"
          headerTextColor="white"
          headerBackgroundColor="#f59023"
          modalWidth="60%"
          bodyBackgroundColor="white"
          closeBox={() => setAddShipmentModal(false)}
          onSubmit={() => {}}
        >
          <AddShipments
            onSuccess={(newShipment) => {
              setShipments([newShipment, ...shipments]);
              setAddShipmentModal(false);
            }}
          />
        </ReactDialogBox>
      )}

      {modalType === "history" && selectedShipment && (
        <ModalOverlay>
          <ModalContent>
            <h3>Yuk holati tarixi</h3>
            <ul>
              {historyLogs.map((h, i) => (
                <li key={i}>
                  {h.log_text} ({new Date(h.created_at).toLocaleString()})
                </li>
              ))}
            </ul>
            <div className="modal-buttons">
              <button
                onClick={() => {
                  setSelectedShipment(null);
                  setModalType(null);
                }}
              >
                Yopish
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {modalType === "status" && selectedShipment && (
        <ModalOverlay>
          <ModalContent>
            <h3>Statusni o‘zgartirish</h3>
            <form onSubmit={handleStatusUpdate}>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="client_created">Yangi</option>
                <option value="approved">Tasdiqlangan</option>
                <option value="in_transit">Yo‘lda</option>
                <option value="arrived">Yetib keldi</option>
                <option value="delivered">Topshirildi</option>
              </select>
              <div className="modal-buttons">
                <button type="submit">Yangilash</button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShipment(null);
                    setModalType(null);
                  }}
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {modalType === "detail" && selectedShipment && (
        <ModalOverlay>
          <ModalContent>
            <h3>Buyurtma tafsilotlari</h3>
            <dl>
              <dt>Tracking Code:</dt>
              <dd>{selectedShipment.tracking_code}</dd>
              <dt>Yuboruvchi:</dt>
              <dd>{selectedShipment.sender_name}</dd>
              <dt>Qabul qiluvchi:</dt>
              <dd>
                {selectedShipment.receiver_name} —{" "}
                {selectedShipment.receiver_phone}
              </dd>
              <dt>Ofislar:</dt>
              <dd>
                {selectedShipment.origin_branch_name} ➜{" "}
                {selectedShipment.destination_branch_name}
              </dd>
              <dt>Holat:</dt>
              <dd>{selectedShipment.status.replaceAll("_", " ")}</dd>
              <dt>Narx:</dt>
              <dd>{selectedShipment.price || "Hisoblanmagan"} so‘m</dd>
            </dl>
            <div style={{ marginTop: "1.5rem" }}>
              <h4>📜 Yuk tarixi</h4>
              <ul>
                {shipmentHistory.map((log, idx) => (
                  <li key={idx}>
                    {log.log_text} —{" "}
                    <small>{new Date(log.created_at).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-buttons">
              <button
                onClick={() => {
                  setSelectedShipment(null);
                  setModalType(null);
                }}
              >
                Yopish
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}

// Styled-components remain unchanged

const Wrapper = styled.div`
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
  .title {
    h2 {
      font-size: 2rem;
      color: #f59023;
    }
  }
  .functions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    input {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      width: 300px;
      font-size: 1rem;
    }
    select {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      background-color: #f59023;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  background: ${({ theme }) => theme.card};
  border-collapse: collapse;
  color: ${({ theme }) => theme.text};
  border-radius: 10px;
  overflow: hidden;

  th,
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #ddd;
    text-align: left;
    &.actions {
      display: flex;
      gap: 0.5rem;
      cursor: pointer;
      svg {
        color: #f59023;
        &:hover {
          color: #d8771c;
        }
      }
    }
  }

  th {
    background: ${({ theme }) => theme.accent};
    color: white;
  }

  tr:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  button {
    padding: 0.4rem 1rem;
    border: none;
    background: #f59023;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`;

const Badge = styled.span`
  background-color: ${({ color }) => color};
  color: white;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  text-transform: capitalize;
  font-weight: 500;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.text};

  h3 {
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }

  input,
  select {
    width: 100%;
    padding: 0.5rem;
    margin: 0.75rem 0;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1rem;
      background: #f59023;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      &:hover {
        background: #d8771c;
      }
    }
  }
`;

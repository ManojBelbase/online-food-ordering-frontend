"use client";
import { useState } from "react";
import OrderNotificationListener from "@/components/OrderNotificationListener";

export default function TestOrderStatusPage() {
  const [inputId, setInputId] = useState(""); // start empty
  const [listeningUserId, setListeningUserId] = useState<string | null>(null);
  const [orderUpdates, setOrderUpdates] = useState<Array<{orderId: string, status: string}>>([]);

  const startListening = () => {
    const trimmed = (inputId ?? "").trim();
    if (!trimmed) {
      alert("Please paste the exact userId from Firebase (no extra text).");
      return;
    }
    setListeningUserId(trimmed);
    console.log("[TEST PAGE] start listening for userId:", trimmed);
  };

  const stopListening = () => {
    setListeningUserId(null);
    console.log("[TEST PAGE] stopped listening");
  };

  const handleStatusChange = (orderId: string, status: string) => {
    setOrderUpdates(prev => [...prev, { orderId, status }]);
    console.log("[TEST PAGE] status change", orderId, status);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Order Notifications</h1>

      <div style={{ marginBottom: 12 }}>
        <label>
          Paste userId (exact):{" "}
          <input
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="e.g. 6872836e8779d1414637a377"
            style={{ width: 420 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button onClick={startListening} style={{ marginRight: 8 }}>Start Listening</button>
        <button onClick={stopListening}>Stop</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        Active userId: <strong>{listeningUserId ?? "(not listening)"}</strong>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Recent updates</h3>
        <div>
          {orderUpdates.slice(-10).reverse().map((u, i) => (
            <div key={i}>
              <strong>#{u.orderId.slice(-6)}:</strong> {u.status}
            </div>
          ))}
        </div>
      </div>

      {listeningUserId && (
        <OrderNotificationListener
          userId={listeningUserId}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

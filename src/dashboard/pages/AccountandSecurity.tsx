import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import homeLogo from "../../assets/ustp thingS/Home.png";
import Username from "../components/Username"; // adjust the path if needed
import PhoneNumber from "../components/PhoneNumber"; // adjust the path if needed
import { getDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

type AccountandSecurityProps = {
  onSettingsClick: () => void;
  onMyProfileClick: () => void;
};

export default function AccountandSecurity({ onSettingsClick, onMyProfileClick }: AccountandSecurityProps) {
  const navigate = useNavigate();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [username, setUsername] = useState(""); // or fetch from Firestore if you want it to persist
  const [loadingUsername, setLoadingUsername] = useState(true);
  const [showPhoneNumberModal, setShowPhoneNumberModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(""); // or fetch from Firestore if you want it to persist
  const [loadingPhoneNumber, setLoadingPhoneNumber] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      if (!auth.currentUser) return;
      setLoadingUsername(true);
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setUsername(userDoc.data().username || "");
      }
      setLoadingUsername(false);
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      if (!auth.currentUser) return;
      setLoadingPhoneNumber(true);
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        setPhoneNumber(userDoc.data().phoneNumber || "");
      }
      setLoadingPhoneNumber(false);
    };
    fetchPhoneNumber();
  }, []);

  const handleSaveUsername = async (newUsername: string) => {
    if (!auth.currentUser) return;
    await setDoc(doc(db, "users", auth.currentUser.uid), { username: newUsername }, { merge: true });
    setUsername(newUsername);
    setShowUsernameModal(false);
  };

  const handleSavePhoneNumber = async (newPhoneNumber: string) => {
    if (!auth.currentUser) return;
    await setDoc(doc(db, "users", auth.currentUser.uid), { phoneNumber: newPhoneNumber }, { merge: true });
    setPhoneNumber(newPhoneNumber);
    setShowPhoneNumberModal(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Header */}
      <div
        style={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
          height: 72,
          paddingLeft: 55,
          paddingRight: 24,
          gap: 18,
          borderBottom: "1px solid #ccc",
          boxShadow: "0 2px 4px 0 rgba(0,0,0,0.04)",
        }}
      >
        <img
          src={homeLogo}
          alt="Home Icon"
          className="h-7 w-auto"
          style={{ cursor: "pointer" }}
          onClick={() => navigate('/dashboard')}
        />
        <div style={{
          width: 2,
          height: 36,
          background: "#F48C8C",
          marginLeft: 18,
          marginRight: 18,
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="text-3xl font-bold"
            style={{ color: "#F88379", opacity: 0.63, cursor: "pointer" }}
            onClick={onSettingsClick}
          >
            Settings
          </span>
          <span
            className="text-3xl font-bold"
            style={{ color: "#F88379", opacity: 0.63 }}
          >
            &gt;
          </span>
          <span className="text-3xl font-bold" style={{ color: "#F88379" }}>
            Account & Security
          </span>
        </div>
      </div>
      {/* Main content */}
      <div style={{ paddingTop: 32, paddingLeft: 24, paddingRight: 24 }}>
        {/* Account Section */}
        <div
          style={{
            color: "#7A8A8D",
            fontWeight: 700,
            marginBottom: 8,
            fontSize: 18,
            fontFamily: "inherit",
          }}
        >
          Account
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            onClick={onMyProfileClick}
          >
            My Profile <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            onClick={() => setShowUsernameModal(true)}
          >
            Username
            <span style={{ color: "#888", fontSize: 15 }}>
              {loadingUsername ? "Loading..." : username ? username : "Set now"} <span style={{ marginLeft: 8, color: "#888" }}>&gt;</span>
            </span>
          </div>
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            onClick={() => setShowPhoneNumberModal(true)}
          >
            Phone
            <span style={{ color: "#888", fontSize: 15 }}>
              {loadingPhoneNumber ? "Loading..." : phoneNumber ? phoneNumber : "Set now"} <span style={{ marginLeft: 8, color: "#888" }}>&gt;</span>
            </span>
          </div>
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
            Email <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
        <div
          style={{
            background: "#FFF3F3",
            borderRadius: 6,
            marginBottom: 8,
            padding: 0,
          }}
        >
          <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 17, cursor: "pointer", fontFamily: "inherit" }}>
            Change Password <span style={{ color: "#888" }}>&gt;</span>
          </div>
        </div>
      </div>
      {/* No visible back button */}
      {showUsernameModal && (
        <Username
          onClose={() => setShowUsernameModal(false)}
          onSave={handleSaveUsername}
          initialUsername={username}
        />
      )}
      {showPhoneNumberModal && (
        <PhoneNumber
          onClose={() => setShowPhoneNumberModal(false)}
          onSave={handleSavePhoneNumber}
          initialPhoneNumber={phoneNumber}
        />
      )}
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import homeLogo from "../../assets/ustp thingS/Home.png";
import profilePic from "../../assets/ustp thingS/Person.png"; // Using Person.png instead of sample-profile.png
// import editIcon from "../../assets/ustp thingS/Edit.png"; // If you want a small edit icon
import Name from "../components/Name"; // adjust the path if needed

type MyProfileProps = {
  onSettingsClick: () => void;
  setView: (view: string) => void;
};

export default function MyProfile({ onSettingsClick, setView }: MyProfileProps) {
  const navigate = useNavigate();
  const [showNameModal, setShowNameModal] = useState(false);
  const [name, setName] = useState(""); // or your actual user name

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
          <span className="text-3xl font-bold" style={{ color: "#F88379", opacity: 0.63 }}>
            &gt;
          </span>
          <span
            className="text-3xl font-bold"
            style={{ color: "#F88379", opacity: 0.63, cursor: "pointer" }}
            onClick={() => setView("account")}
          >
            Account & Security
          </span>
          <span className="text-3xl font-bold" style={{ color: "#F88379" }}>
            &gt; <span style={{ fontWeight: 700 }}>My Profile</span>
          </span>
        </div>
      </div>
      {/* Main content */}
      <div style={{ paddingTop: 32, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ textAlign: "center", fontWeight: 600, color: "#444", marginBottom: 16 }}>
          Edit Profile
        </div>
        <div
          style={{
            background: "#FFE9E9",
            borderRadius: 8,
            marginBottom: 24,
            padding: "32px 0 24px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <img
              src={profilePic}
              alt="Profile"
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #fff",
                boxShadow: "0 2px 8px #0001",
              }}
            />
            {/* Uncomment if you want a small edit icon */}
            {/* <img
              src={editIcon}
              alt="Edit"
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#F88379",
                border: "2px solid #fff",
                padding: 2,
              }}
            /> */}
          </div>
        </div>
        {/* Profile fields */}
        <div style={{ background: "#FFF3F3", borderRadius: 6, marginBottom: 8 }}>
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              fontFamily: "inherit",
              borderBottom: "1px solid #f5cccc",
              cursor: "pointer",
            }}
            onClick={() => setShowNameModal(true)}
          >
            Name
            <span style={{ color: "#888", fontSize: 15 }}>
              Set now <span style={{ marginLeft: 8, color: "#888" }}>&gt;</span>
            </span>
          </div>
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 17,
              fontFamily: "inherit",
            }}
          >
            Gender
            <span style={{ color: "#888", fontSize: 15 }}>
              Set now <span style={{ marginLeft: 8, color: "#888" }}>&gt;</span>
            </span>
          </div>
        </div>
      </div>
      {showNameModal && (
        <Name
          onClose={() => setShowNameModal(false)}
          onSave={newName => {
            setName(newName);
            setShowNameModal(false);
          }}
          initialName={name}
        />
      )}
    </div>
  );
}

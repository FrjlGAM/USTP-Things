import React, { useState } from "react";
import Settings from "./Settings";
import AccountandSecurity from "./AccountandSecurity";
import PrivacySettings from "./PrivacySettings";
import BlockedUsers from "./BlockedUsers";
import MyProfile from "./MyProfile";

export default function SettingsContainer() {
  const [view, setView] = useState("settings");

  return (
    <>
      {view === "settings" && (
        <Settings
          onAccountSecurityClick={() => setView("account")}
          onPrivacySettingsClick={() => setView("privacy")}
          onBlockedUsersClick={() => setView("blocked")}
        />
      )}
      {view === "account" && (
        <AccountandSecurity
          onSettingsClick={() => setView("settings")}
          onMyProfileClick={() => setView("profile")}
        />
      )}
      {view === "privacy" && (
        <PrivacySettings onSettingsClick={() => setView("settings")} />
      )}
      {view === "blocked" && (
        <BlockedUsers onSettingsClick={() => setView("settings")} />
      )}
      {view === "profile" && (
        <MyProfile 
          onSettingsClick={() => setView("settings")} 
          setView={setView}
        />
      )}
    </>
  );
}

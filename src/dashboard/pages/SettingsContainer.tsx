import React, { useState } from "react";
import Settings from "./Settings";
import AccountandSecurity from "./AccountandSecurity";
import PrivacySettings from "./PrivacySettings";

export default function SettingsContainer() {
  const [view, setView] = useState("settings");

  return (
    <>
      {view === "settings" && (
        <Settings
          onAccountSecurityClick={() => setView("account")}
          onPrivacySettingsClick={() => setView("privacy")}
        />
      )}
      {view === "account" && (
        <AccountandSecurity onSettingsClick={() => setView("settings")} />
      )}
      {view === "privacy" && (
        <PrivacySettings onSettingsClick={() => setView("settings")} />
      )}
    </>
  );
}

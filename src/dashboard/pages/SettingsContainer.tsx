import React, { useState } from "react";
import Settings from "./Settings";
import AccountandSecurity from "./AccountandSecurity";
import PrivacySettings from "./PrivacySettings";
import BlockedUsers from "./BlockedUsers";
import MyProfile from "./MyProfile";
import CommunityRules from "./CommunityRules";

export default function SettingsContainer() {
  const [view, setView] = useState("settings");

  return (
    <>
      {view === "settings" && (
        <Settings
          onAccountSecurityClick={() => setView("account")}
          onPrivacySettingsClick={() => setView("privacy")}
          onBlockedUsersClick={() => setView("blocked")}
          onCommunityRulesClick={() => setView("communityRules")}
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
      {view === "communityRules" && (
        <CommunityRules onSettingsClick={() => setView("settings")} />
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSideBars from "../components/DashSideBars";
import DashProfile from "../components/DashProfile";
import CloseAccount from "../components/CloseAccount";
import AccountSecurity from "../components/AccountSecurity";
import DashPosts from "../components/DashPost";
import DashUsers from "../components/DashUser";
import DashboardComp from "../components/DashBoardComp";
function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("profile");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSideBars tab={tab} />
      </div>
      {tab === "post" && <DashPosts />}
      {tab === "profile" && <DashProfile />}
      {tab === "close-account" && <CloseAccount />}
      {tab === "account-security" && <AccountSecurity />}
      {tab === "users" && <DashUsers />}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
}

export default Dashboard;

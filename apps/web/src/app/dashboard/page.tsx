import { getSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  const session = await getSession();
  return <div>Dashboard</div>;
};

export default Dashboard;

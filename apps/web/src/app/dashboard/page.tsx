import { getSession } from "@/lib/sessions";
import { redirect } from "next/navigation";
import React from "react";

const Dashboard = async () => {
  // const session = await getSession();
  // if (!session || !session.user) {
  //   redirect("/signin");
  // }
  return <div>Dashboard</div>;
};

export default Dashboard;

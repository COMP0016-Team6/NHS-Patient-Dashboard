import React, { useEffect, useState } from "react";
import Linechart from "./LineChart";

const Dashboard = ({ logout }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    let cancelled = false;

    const getProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard/", {
          method: "POST",
          headers: { jwt_token: localStorage.token }
        });
        const parseData = await res.json();
        if (!cancelled) {
          setName(parseData.user_name);
          setEmail(parseData.user_email);
        }
      } catch (err) {
        console.error(err.message);
      }
    };
    getProfile();
    return () => cancelled = true; 
  }, []);

  return (
    <div>
      <h1 className="mt-5">My Dashboard</h1>
      {/*<Linechart />*/}
      <button onClick= {logout} className="btn btn-primary mt-5">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
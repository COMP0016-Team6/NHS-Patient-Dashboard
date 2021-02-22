import React, { useEffect, useState } from "react";
import Linechart from "./LineChart";

const Dashboard = ({ logout }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user_id, setUserId] = useState(0);

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
          setUserId(parseData.user_id);
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
      <h1 className="mt-5">My Dashboard {user_id}</h1>
      {user_id === 0? null : <Linechart patient_id={user_id} />}
      <button onClick={logout} className="btn btn-primary mt-5">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
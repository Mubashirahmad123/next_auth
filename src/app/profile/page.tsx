"use client";

import React from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProfilePage() {
  const [data, setData] = useState("nothing");

  const getUserDetails = async () => {
    try {
      const res = await axios.post("/api/users/me");
    //   console.log("hello")
      console.log(res.data.data._id); 
    //   console.log("hii")
      setData(res.data.data._id);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const logout = async () => {
    const router = useRouter();

    try {
      await axios.get("/api/users/logout");
      toast.success("logout successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <hr />
      <p>Profile page</p>

      <h2>
        {data == "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={logout}
      >
        Logout
      </button>

      <button
        className="bg-green-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={getUserDetails}
      >
        Get Details
      </button>
    </div>
  );
}

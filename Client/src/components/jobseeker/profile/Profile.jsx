import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const userState = useSelector((store) => store.user);
  console.log("kajfl", userState);
  return (
    <div>
      <h2>My Profile</h2>
      {/* Profile management content will go here */}
    </div>
  );
};

export default Profile;

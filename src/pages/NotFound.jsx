import React from "react";
import { useAuth } from "../authentication/context/authContext";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

function NotFound() {
  const { token } = useAuth();
  const navigate=useNavigate()
  return (
    <div style={{width:"100%",height:"100vh", display:"flex", justifyContent : "center" , alignItems:"center"}}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={ <Button type="primary" onClick={()=>navigate("/")}>Go To Login</Button>}
      />
    </div>
  );
}

export default NotFound;

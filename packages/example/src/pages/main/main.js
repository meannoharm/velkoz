/* eslint-disable */
import { useEffect } from "react";
import { Button } from "antd";
import Velkoz from "velkoz";
import "./main.css";


export default function Main() {
  useEffect(() => {
    new Velkoz({
      url: "",
    });
  }, []);

  const triggerJsError = () => {
    notDefinedFunction();
  };

  const triggerUnhandledRejection = () => {
    Promise.reject();
  };

  return (
    <div className="main-container">
      <div className="option-container">
        <Button onClick={triggerJsError}>触发JS错误</Button>
        <Button onClick={triggerUnhandledRejection}>触发Promise错误</Button>
      </div>
      <div className="list-container">123</div>
    </div>
  );
}

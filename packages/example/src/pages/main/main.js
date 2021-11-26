import { Button } from "antd";
import Velkoz from "@velkoz/core";
import "./main.css";

export default function Main() {
  return (
    <div className="main-container">
      <div className="option-container">
        <Button>触发JS错误</Button>
        <Button>触发Promise错误</Button>
      </div>
      <div className="list-container">123</div>
    </div>
  );
}

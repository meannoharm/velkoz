/* eslint-disable */
import { useEffect } from "react";
import { Button, Table } from "antd";
import Velkoz from "velkoz";
import "./main.css";

export default function Main() {
  useEffect(() => {
    new Velkoz({
      url: "",
    });
  }, []);

  const triggerJsError = () => {
    // @ts-ignore
    notDefinedFunction();
  };

  const triggerUnhandledRejection = () => {
    Promise.reject();
  };

  const sendXhrNormal = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("get", "/normal");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.responseText);
      }
    };
  };

  const onClickXhrError = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("get", "/exception");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.responseText);
      }
    };
  };

  const onClickNativeFetch = () => {
    fetch("/normal/post", {
      method: "POST",
      body: JSON.stringify({ test: "测试请求体" }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.text().then((res) => console.log("res", res));
    });
  };

  const onClickNativeErrorFetch = () => {
    fetch("/exception/post", {
      method: "POST",
      body: JSON.stringify({ test: "测试请求体" }),
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(
      (res) => {
        res.text().then((res) => console.log("res", res));
      },
      (err) => {
        console.log("err", err);
      }
    );
  };

  const columns = [
    {
      title: "level",
      key: "level",
      dataIndex: "level",
    },
    {
      title: "userAgent",
      key: "userAgent",
      dataIndex: "userAgent",
    },
    {
      title: "payload",
      key: "payload",
      dataIndex: "payload",
    },
  ];

  return (
    <div className="main-container">
      <div className="option-container">
        <Button onClick={triggerJsError}>触发JS错误</Button>
        <Button onClick={triggerUnhandledRejection}>触发Promise错误</Button>
        <Button onClick={sendXhrNormal}>xhr正常请求</Button>
        <Button onClick={onClickXhrError}>xhr异常请求</Button>
        <Button onClick={onClickNativeFetch}>Fetch正常请求</Button>
        <Button onClick={onClickNativeErrorFetch}>Fetch异常请求</Button>
      </div>
      <div className="list-container">
        <Table dataSource={[]} columns={columns} />
      </div>
    </div>
  );
}

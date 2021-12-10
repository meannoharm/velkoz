/* eslint-disable */
import { useState, useEffect } from "react";
import { Button, Table, Tag, Tooltip } from "antd";
import Velkoz from "velkoz";
import ReactJson from "react-json-view";
import dayjs from "dayjs";
import "./main.css";
import type { ColumnsType } from "antd/lib/table";
import type { Action } from "@velkoz/shared-utils";

const MOCK_NORMAL_URL = "https://run.mocky.io/v3/2eec3b9c-d393-4902-9e0d-72b48b4748c9";
const MOCK_EXCEPTION_URL = "https://run.mocky.io/v3/c58b5ab6-ff55-4a45-96bc-ede851ce2de3";

const TagMap = {
  INFO: <Tag color="processing">Info</Tag>,
  ERROR: <Tag color="error">Error</Tag>,
};

export default function Main() {
  const [actionList, setActionList] = useState<Action[]>([]);

  useEffect(() => {
    const velkoz = new Velkoz({
      url: "",
      level: [],
    });
    velkoz.on("afterCapture", (action) => {
      console.log(action);
      setActionList(velkoz.getActionList());
    });
    return () => {
      velkoz.off("afterCapture")
    }
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
    xhr.open("get", MOCK_NORMAL_URL);
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
    xhr.open("get", MOCK_EXCEPTION_URL);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.responseText);
      }
    };
  };

  const onClickNativeFetch = () => {
    fetch(MOCK_NORMAL_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.text().then((res) => console.log("res", res));
    });
  };

  const onClickNativeErrorFetch = () => {
    fetch(MOCK_EXCEPTION_URL, {
      method: "POST",
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

  const columns: ColumnsType<Action> = [
    {
      title: "level",
      key: "level",
      dataIndex: "level",
      width: 96,
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: "payload",
      key: "payload",
      dataIndex: "payload",
      width: 560,
      render: (text) => (
        <ReactJson src={text} name={false} collapsed enableClipboard={false} displayDataTypes={false} displayObjectSize={false} />
      ),
    },
    {
      title: "time",
      key: "time",
      dataIndex: "time",
      render: (text) => dayjs(text).format("YYYY-MM-DD hh:mm:ss"),
    },
    {
      title: "type",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "userAgent",
      key: "userAgent",
      dataIndex: "userAgent",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
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
        <Table rowKey={item => item.id} size="small" dataSource={actionList} columns={columns} pagination={false} scroll={{y: '700px'}} />
      </div>
    </div>
  );
}

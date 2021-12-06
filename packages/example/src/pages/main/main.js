/* eslint-disable */
import { useEffect } from "react";
import { Button, Table } from "antd";
import Velkoz from "velkoz";
import {KEY} from '@velkoz/shared-utils';
import "./main.css";


export default function Main() {

  useEffect(() => {
    new Velkoz({
      url: "",
    });
  }, []);

  const triggerJsError = () => {
    console.log(123);
    notDefinedFunction();
  };

  const triggerUnhandledRejection = () => {
    Promise.reject();
  };

  const columns = [
    {
      title: 'level',
      key: 'level',
      dataIndex: 'level'
    },
    {
      title: 'userAgent',
      key: 'userAgent',
      dataIndex: 'userAgent'
    },
    {
      title: 'payload',
      key: 'payload',
      dataIndex: 'payload'
    },
  ]

  return (
    <div className="main-container">
      <div className="option-container">
        <Button onClick={triggerJsError}>触发JS错误</Button>
        <Button onClick={triggerUnhandledRejection}>触发Promise错误</Button>
      </div>
      <div className="list-container">
        {/* <Table dataSource={actionList} columns={columns} /> */}
      </div>
    </div>
  );
}

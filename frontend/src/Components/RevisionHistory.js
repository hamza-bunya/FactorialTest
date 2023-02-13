import { Modal, Timeline } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";

const RevisionHistory = ({ open, onClose, id }) => {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    axios
      .get(`http://localhost:5001/audit/GetRevisionHistory/${id}`)
      .then((res) => {
        console.log(res.data);
        sanitizeData(res.data);
      });
  }, []);

  const sanitizeData = (data) => {
    var his = data.map((item) => {
      return {
        label: moment(item.dateTime).format("DD-MMM-yyyy hh:mm"),
        children: (
          <RevisionItem newValues={item.newValues} oldValues={item.oldValues} />
        ),
      };
    });
    setHistory(his);
  };

  return (
    <Modal
      title="Revision History"
      destroyOnClose
      open={open}
      closable={false}
      width={800}
      onCancel={onClose}
      onOk={onClose}
    >
      <Timeline items={history} mode="left" />
    </Modal>
  );
};

const RevisionItem = ({ newValues, oldValues }) => {
  let oldVals = JSON.parse(oldValues);
  let newVals = JSON.parse(newValues);
  let values = [];

  Object.keys(newVals).forEach(function (key, index) {
    let child = `${key} : `;
    if (oldVals) {
      child += oldVals[key];
    }
    child += " ==> ";
    child += newVals[key];
    values.push(child);
  });

  console.log("Values are: ", values);

  return (
    <div>
      {values.map((item) => {
        return (
          <div>
            <span>{item}</span>
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default RevisionHistory;

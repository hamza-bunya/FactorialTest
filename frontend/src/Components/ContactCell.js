import React, {useState} from "react";
import {Avatar, Checkbox, Dropdown, Menu} from "antd";
import {StarOutlined, EllipsisOutlined, StarFilled} from "@ant-design/icons";
import EditForm from "./EditForm";
import RevisionHistory from "./RevisionHistory";

const ContactCell = ({contact, addFavourite, selectContact, selectedContacts, deleteContact, submitEdit}) => {

    const {firstName, lastName, email, phone, starred} = contact;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const menuItems = [
      {
        label: "Edit",
        key: "1",
        onClick: () => {setShowEditModal(true)},
      },
      {
        label: "Delete",
        key: "2",
        onClick: () => {deleteContact(contact.id)},
      },
      {
        label: "Show History",
        key: "3",
        onClick: () => {setShowHistory(true)},
      },
    ];

    return(
        <div className="gx-contact-item">
            <div className="gx-module-list-icon">
            <Checkbox className="gx-icon-btn"
                        checked={selectedContacts.indexOf(contact.id) > -1 ? true : false}
                        onChange={(event) => {
                            selectContact(contact.id, event.target.checked)
                        }}/>
                <div className="gx-d-none gx-d-sm-flex" onClick={() => {
                    addFavourite(contact)
                }}>
                    {starred ? <StarFilled className="gx-icon-btn icon" /> : <StarOutlined className="gx-icon-btn icon" />}
                </div>
            </div>

        <div className="gx-module-list-info gx-contact-list-info">
          <div className="gx-module-contact-content">
            <p className="gx-mb-1">
              <span className="gx-text-truncate gx-contact-name"> {firstName} {lastName} </span>
            </p>

            <div className="gx-text-muted">
            <span className="gx-email gx-d-inline-block gx-mr-2">
                {email},
            </span>
              <span className="gx-phone gx-d-inline-block">{phone}</span>
            </div>
          </div>

          <div className="gx-module-contact-right">
            <Dropdown menu={{items: menuItems}} placement="bottomRight" trigger={['click']}>
                <EllipsisOutlined className="gx-icon-btn icon" />
            </Dropdown>
          </div>
        </div>
        {showEditModal && <EditForm showModal={showEditModal} submitContact={submitEdit} contact={contact} onCancel={()=>{setShowEditModal(false)}} />}
        {showHistory && <RevisionHistory open={showHistory} onClose={()=>{setShowHistory(false)}} id={contact.id} />}
      </div>
    )
}

export default ContactCell;
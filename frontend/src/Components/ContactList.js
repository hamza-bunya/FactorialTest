import React, {useState} from "react";
import ContactCell from "./ContactCell";


const ContactList = ({contactList, addFavourite, selectContact, selectedContacts, deleteContact, submitEdit}) => {

    return(
        <div className="gx-contact-main-content">
            {contactList.map((contact, index) =>
                <ContactCell key={index} contact={contact} selectContact={selectContact} submitEdit={submitEdit} deleteContact={deleteContact} selectedContacts={selectedContacts} addFavourite={addFavourite} />
            )}
        </div>
    )
}

export default ContactList;
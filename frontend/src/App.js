import axios from "./utils/api";
import { useEffect, useState } from "react";
import { Button, Checkbox, Drawer, message } from "antd";
import {PlusOutlined, UnorderedListOutlined, StarFilled, ContainerOutlined, DeleteOutlined} from '@ant-design/icons';
import Header from "./Components/Header";
import ContactList from "./Components/ContactList";
import AddForm from "./Components/AddForm";
import EditForm from "./Components/EditForm";

const App = () => {

  // Page States
  // ---------------------------------------------------------------------- //
  
  // List of all unfiltered contacts received from the server
  const [allContacts, setAllContacts] = useState([]);
  // List of filtered contacts to be displayed on the page
  const [contactList, setContactList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedSection, setSelectedSection] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  // ---------------------------------------------------------------------- //

  // Fetch all contacts
  useEffect(()=>{
    axios.get('/contacts').then(res => {
      if(res.data) {
        setAllContacts(res.data);
        setContactList(res.data);
      }
    });
  }, []);

  // We need to refilter contacts if the contact section, search query or the contact list is changed
  useEffect(() => {
    filterContacts();
  },[selectedSection, searchQuery, allContacts]);

  // Contact section menu items for the left nav
  const filterOptions = [
    {
      id: 1,
      name: "All contacts",
      icon: <UnorderedListOutlined className="gx-mr-2" />,
    },
    {
      id: 2,
      name: "Starred contacts",
      icon: <StarFilled className="gx-mr-2" />,
    },
  ];

  // Change the selected contact section
  const selectSection = (option) => {
    if (option.id === selectedSection) {
      return;
    }
    switch (option.id) {
      case 1 : {
        setSelectedSection(1);
        setSelectedContacts([]);
        break;
      }
      case 2 : {
        setSelectedSection(2);
        setSelectedContacts([]);
        break;
      }
      default:
        break;
    }
  }

  // Render the left side nav
  const ContactSideBar = () => {
    return (
      <div className="gx-module-side">
        <div className="gx-module-side-header">
          <div className="gx-module-logo">
            <ContainerOutlined className="gx-mr-4" />
            <span>
              Contacts
            </span>
          </div>
        </div>
        <div className="gx-module-side-content">
          <div className="gx-module-add-task">
            <Button className="gx-btn-block ant-btn" type="primary" aria-label="add" onClick={()=> {setShowAddModal(!showAddModal)}}>
              <PlusOutlined className="gx-mr-2" />
              <span>Add New Contact</span>
            </Button>
          </div>
          <div className="gx-module-side-nav">
            <ul className="gx-module-nav">
              {filterOptions.map(option => <li key={option.id} className="gx-nav-item">
                  <span
                    className={`gx-link ${option.id === selectedSection ? 'active': ''}`}
                    onClick= {()=>selectSection(option)}>
                    {option.icon}
                    <span>{option.name}</span>
                  </span>
                </li>
              )}

            </ul>
          </div>
      </div>
      </div>
    );
  };

  // Event handler for search input
  const handleSearchChange = (evt) => {
    setSearchQuery(evt.target.value);
  }

  const filterContacts = () => {
    if (searchQuery === '') {
      if (selectedSection === 1) {
        setContactList(allContacts);
      }
      else if (selectedSection === 2) {
        setContactList(allContacts.filter((contact) => contact.starred));
      }
    }
    else {
      var filteredContacts = allContacts.filter((contact) => {
        var contactName = contact?.firstName + " " + contact?.lastName + " " + contact?.email;
        return contactName.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
      });
      if (selectedSection === 1) {
        setContactList(filteredContacts);
      }
      else if (selectedSection === 2) {
        setContactList(filteredContacts.filter((contact) => contact.starred));
      }
    }
  }

  const addFavourite = (data) => {
    axios.patch(`/contacts/starcontact/${data.id}`).then(res => {
      if(res.status === 200) {
        message.success(res?.data?.starred ? "Contact added to favourites" : "Contact removed from favourites");
        // Get new list
        setContactList(contactList.map((contact) => contact.id === data.id ? {
          ...contact,
          starred: !data.starred
        } : contact
        ));
        setAllContacts(allContacts.map((contact) => contact.id === data.id ? {
          ...contact,
          starred: !data.starred
        } : contact
        ));
      }
    })
  }

  // Add or remove contact from the selected contacts list
  const selectContact = (id, isSelected) => {
    if(isSelected) {
      setSelectedContacts([...selectedContacts, id]);
    }
    else {
      setSelectedContacts(selectedContacts.filter(x => x !== id));
    }
  }

  const toggleSelectAll = (isSelected) => {
    if (isSelected) {
      let ids = contactList.map((contact) => {
        return contact.id;
      });
      setSelectedContacts(ids);
    }
    else {
      setSelectedContacts([]);
    }
  }

  const deleteSelectedContacts = () => {
    let query = [];
    selectedContacts.forEach((id) => {
      query.push(`ids=${id}`);
    });
   axios.delete(`/contacts/deletemultiple?${query.join('&')}`).then(res => {
    if(res.status === 200) {
      message.success("Selected contacts deleted!");
      setAllContacts(res.data);
      setSelectedContacts([]);
    }
   })
  }

  const deleteContact = (id) => {
    axios.delete(`/contacts/DeleteContact/${id}`).then(res => {
      if (res.status === 200) {
        message.success("Contact deleted!");
        setAllContacts(allContacts.filter((contact) => contact.id !== id));
        setContactList(contactList.filter((contact) => contact.id !== id));
      }
    })
  }

  // Handle add new contact submission
  const submitContact = (values) => {
    axios.post('/contacts', values).then(res => {
      if(res.status === 200) {
        message.success("New contact added!");
        setAllContacts([...allContacts, res?.data]);
        setContactList([...contactList, res?.data]);
      }
      else if(res.status === 409) {
        message.warning("Email already exists");
      }
    });
  }

  // Handle edit contact submission
  const submitEdit = (values) => {
    axios.put(`/contacts/editcontact/${values.id}`, values).then(res => {
      if(res.status === 200) {
        message.success("Contact updated!");
        setAllContacts(allContacts.map((contact) => {
          if(contact.id === res?.data?.id) {
            return res.data;
          }
          return contact;
        }));
        setContactList(contactList.map((contact) => {
          if(contact.id === res?.data?.id) {
            return res.data;
          }
          return contact;
        }));
      }
    });
  }


  return(
    <div style={{margin: 40, height: "100%"}}>
      <div className="gx-main-content">
        <div className="gx-app-module">
          <div className="">
            <Drawer
              placement="left"
              closable={false}
              open={false}>
              {ContactSideBar()}
            </Drawer>
          </div>
          <div className="gx-module-sidenav gx-d-none gx-d-lg-flex">
            {ContactSideBar()}
          </div>


          <div className="gx-module-box">
            <div className="gx-module-box-header">
              <span className="gx-drawer-btn gx-d-flex gx-d-lg-none">
                  <i className="icon icon-menu gx-icon-btn" aria-label="Menu"
                     />
              </span>

              <Header placeholder="Search contact" onChange={handleSearchChange} value={searchQuery} notification={false} apps={false} />
            </div>

            <div className="gx-module-box-content">

              <div className="gx-module-box-topbar">
                <Checkbox color="primary" className="gx-icon-btn" indeterminate={selectedContacts.length > 0 && selectedContacts.length < contactList.length}
                          onChange={(event)=> {toggleSelectAll(event.target.checked)}} checked={selectedContacts.length > 0 && selectedContacts.length === contactList.length ? true : false}/>
                {selectedContacts.length > 0 && <DeleteOutlined className="gx-icon-btn" onClick={deleteSelectedContacts} /> }
              </div>
              
              {contactList.length === 0 ?
                  <div className="gx-h-100 gx-d-flex gx-align-items-center gx-justify-content-center">
                    No data
                  </div>
                  : <ContactList contactList={contactList} submitEdit={submitEdit} selectContact={selectContact} deleteContact={deleteContact} selectedContacts={selectedContacts} addFavourite={addFavourite} />
              }
            </div>
          </div>
        </div>
      </div>
      <AddForm showModal={showAddModal} submitContact={submitContact} onCancel={()=> setShowAddModal(false)} />
    </div>
  );
};

export default App;

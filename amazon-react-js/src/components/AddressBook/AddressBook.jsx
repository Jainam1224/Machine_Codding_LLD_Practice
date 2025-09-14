import { useState, useCallback, useMemo } from "react";
import "./AddressBook.css";

const AddressBook = () => {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (validateForm()) {
        const newContact = {
          id: Date.now(),
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        };
        setContacts((prev) => [...prev, newContact]);
        setFormData({ name: "", email: "", phone: "", address: "" });
        setErrors({});
      }
    },
    [formData, validateForm]
  );

  const handleDelete = useCallback((id) => {
    setContacts((prev) => prev.filter((contact) => contact.id !== id));
  }, []);

  const filteredContacts = useMemo(
    () =>
      contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.phone.includes(searchTerm)
      ),
    [contacts, searchTerm]
  );

  return (
    <div className="address-book-container">
      <h2>Address Book</h2>

      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`form-input ${errors.name ? "error" : ""}`}
            placeholder="Enter full name"
          />
          {errors.name && (
            <div id="name-error" className="error-message">
              {errors.name}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-input ${errors.email ? "error" : ""}`}
            placeholder="Enter email"
          />
          {errors.email && (
            <div id="email-error" className="error-message">
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`form-input ${errors.phone ? "error" : ""}`}
            placeholder="Enter phone"
          />
          {errors.phone && (
            <div id="phone-error" className="error-message">
              {errors.phone}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={`form-textarea ${errors.address ? "error" : ""}`}
            placeholder="Enter address"
            rows="3"
          />
          {errors.address && (
            <div id="address-error" className="error-message">
              {errors.address}
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">
          Add Contact
        </button>
      </form>

      <div className="search-section">
        <input
          id="search"
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="contact-count">
          {filteredContacts.length} contact
          {filteredContacts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filteredContacts.length === 0 ? (
        <div className="no-contacts">
          {searchTerm
            ? "No contacts found matching your search"
            : "No contacts yet. Add one above!"}
        </div>
      ) : (
        <div className="table-container">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.address}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddressBook;

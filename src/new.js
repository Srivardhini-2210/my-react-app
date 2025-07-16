import React, { useState } from "react";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Registration successful!");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label><br />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        /><br /><br />

        <label>Username:</label><br />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        /><br /><br />

        <label>Phone:</label><br />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        /><br /><br />

        <label>Email:</label><br />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        /><br /><br />

        <label>Password:</label><br />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;

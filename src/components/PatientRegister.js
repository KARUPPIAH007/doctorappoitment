import React, { useState } from 'react';
import './patientregister.css';
import axios from 'axios';

const apiUrl = 'https://localhost:7146/api/Patient'; 

const PatientRegister = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null); // For image upload
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (file && fileTypes.includes(file.type)) {
      setPhoto(file);
      setErrors(prevErrors => ({
        ...prevErrors,
        photo: ''
      }));
    } else {
      setPhoto(null);
      setErrors(prevErrors => ({
        ...prevErrors,
        photo: 'Please upload a valid image (jpg, jpeg, png).'
      }));
    }
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setGender(value);
    validateField('gender', value);
  };

  const validateField = (fieldName, value) => {
    let fieldError = '';

    switch(fieldName) {
      case 'name':
        fieldError = value ? '' : 'Name is required.';
        break;
      case 'mobile':
        fieldError = /^[0-9]{10}$/.test(value) ? '' : 'Mobile number must be 10 digits.';
        break;
      case 'email':
        fieldError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address.';
        break;
      case 'address':
        fieldError = value ? '' : 'Address is required.';
        break;
      case 'gender':
        fieldError = value ? '' : 'Gender is required.';
        break;
      case 'password':
        fieldError = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(value)
          ? '' : 'Password must be at least 8 characters long, with a mix of letters, numbers, and special characters.';
        break;
      case 'photo':
        fieldError = value ? '' : 'Photo is required.';
        break;
      default:
        break;
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: fieldError
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    validateField('name', name);
    validateField('mobile', mobile);
    validateField('email', email);
    validateField('address', address);
    validateField('gender', gender);
    validateField('password', password);
    validateField('photo', photo);

    // Check if there are any validation errors
    if (Object.values(errors).some(error => error)) {
      return;
    }

    // Creating form data to handle image upload
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Contact', mobile);
    formData.append('Email', email);
    formData.append('Address', address);
    formData.append('Gender', gender);
    formData.append('Password', password);
    formData.append('Image', photo);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccess('Registration successful!');
        setErrors({});
        // Reset form
        setName('');
        setMobile('');
        setEmail('');
        setAddress('');
        setGender('');
        setPassword('');
        setPhoto(null);
      }
    } catch (err) {
      console.error('Error registering patient:', err);
      setErrors({ global: 'Registration failed. Please try again.' });
      setSuccess('');
    }
  };

  return (
    <div className="background">
      <div className="card card-container">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Patient Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => validateField('name', name)}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile</label>
              <input
                type="text"
                id="mobile"
                className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                onBlur={() => validateField('mobile', mobile)}
              />
              {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateField('email', email)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => validateField('address', address)}
              />
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                id="gender"
                className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                value={gender}
                onChange={handleSelectChange}
                onBlur={() => validateField('gender', gender)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                
              </select>
              {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validateField('password', password)}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="photo">Photo</label>
              <input
                type="file"
                id="photo"
                className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
                onChange={handleFileChange}
                onBlur={() => validateField('photo', photo)}
              />
              {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-3">
              Register
            </button>
            {errors.global && <div className="text-danger text-center mt-2">{errors.global}</div>}
            {success && <div className="text-success text-center mt-2">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default PatientRegister;

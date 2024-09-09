import React, { useState } from 'react';
import axios from 'axios';
import './doctorregister.css';

const apiUrl = 'https://localhost:7146/api/Doctor'; // Update with your actual API URL

const DoctorRegistration = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [specification, setSpecification] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [availableDate, setAvailableDate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const validateField = (fieldName, value) => {
    let error = '';
    switch (fieldName) {
      case 'name':
        error = value ? '' : 'Name is required.';
        break;
      case 'mobile':
        error = /^[0-9]{10}$/.test(value) ? '' : 'Mobile number must be 10 digits.';
        break;
      case 'specification':
        error = value ? '' : 'Specialization is required.';
        break;
      case 'email':
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address.';
        break;
      case 'organization':
        error = value ? '' : 'Organization is required.';
        break;
      case 'gender':
        error = value ? '' : 'Gender is required.';
        break;
      case 'password':
        error = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
          ? '' : 'Password must be at least 8 characters long, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.';
        break;
      case 'availableDate':
        error = value && value >= today ? '' : 'Valid available date is required.';
        break;
      case 'photo':
        error = value ? '' : 'Photo is required.';
        break;
      default:
        break;
    }
    setErrors(prevErrors => ({
      ...prevErrors,
      [fieldName]: error
    }));
  };

  const validateForm = () => {
    const validations = {
      name: validateField('name', name),
      mobile: validateField('mobile', mobile),
      specification: validateField('specification', specification),
      email: validateField('email', email),
      organization: validateField('organization', organization),
      gender: validateField('gender', gender),
      password: validateField('password', password),
      availableDate: validateField('availableDate', availableDate),
      photo: validateField('photo', photo),
    };
    setErrors(validations);
    return Object.values(validations).every(error => error === '');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setPhoto(file);
      validateField('photo', file);
    } else {
      setPhoto(null);
      validateField('photo', '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('Name', name);
    formData.append('Contact', mobile);
    formData.append('Specialization', specification);
    formData.append('Email', email);
    formData.append('Organization', organization);
    formData.append('Gender', gender);
    formData.append('Password', password);
    formData.append('AvailableFrom', availableDate);
    if (photo) formData.append('Image', photo);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setSuccess('Registration successful!');
        setErrors({});
        // Reset form
        setName('');
        setMobile('');
        setSpecification('');
        setEmail('');
        setOrganization('');
        setGender('');
        setPassword('');
        setAvailableDate('');
        setPhoto(null);
      }
    } catch (err) {
      console.error('Error registering doctor:', err);
      setErrors({ global: 'Registration failed. Please try again.' });
      setSuccess('');
    }
  };

  return (
    <div className="background">
      <div className="card card-container">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Doctor Registration</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateField('name', e.target.value);
                }}
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
                onChange={(e) => {
                  setMobile(e.target.value);
                  validateField('mobile', e.target.value);
                }}
                onBlur={() => validateField('mobile', mobile)}
              />
              {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="specification">Specialization</label>
              <input
                type="text"
                id="specification"
                className={`form-control ${errors.specification ? 'is-invalid' : ''}`}
                placeholder="Enter specialization"
                value={specification}
                onChange={(e) => {
                  setSpecification(e.target.value);
                  validateField('specification', e.target.value);
                }}
                onBlur={() => validateField('specification', specification)}
              />
              {errors.specification && <div className="invalid-feedback">{errors.specification}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateField('email', e.target.value);
                }}
                onBlur={() => validateField('email', email)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="organization">Organization</label>
              <input
                type="text"
                id="organization"
                className={`form-control ${errors.organization ? 'is-invalid' : ''}`}
                placeholder="Enter organization"
                value={organization}
                onChange={(e) => {
                  setOrganization(e.target.value);
                  validateField('organization', e.target.value);
                }}
                onBlur={() => validateField('organization', organization)}
              />
              {errors.organization && <div className="invalid-feedback">{errors.organization}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value);
                  validateField('gender', e.target.value);
                }}
                onBlur={() => validateField('gender', gender)}
              >
                <option value="" disabled>Select gender</option>
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  validateField('password', e.target.value);
                }}
                onBlur={() => validateField('password', password)}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="availableDate">Available Start Date</label>
              <input
                type="date"
                id="availableDate"
                className={`form-control ${errors.availableDate ? 'is-invalid' : ''}`}
                value={availableDate}
                min={today}
                onChange={(e) => {
                  setAvailableDate(e.target.value);
                  validateField('availableDate', e.target.value);
                }}
                onBlur={() => validateField('availableDate', availableDate)}
              />
              {errors.availableDate && <div className="invalid-feedback">{errors.availableDate}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="photo">Upload Photo</label>
              <input
                type="file"
                id="photo"
                className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
                accept=".jpg, .jpeg, .png"
                onChange={handlePhotoChange}
                onBlur={() => validateField('photo', photo)}
              />
              {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-3">Register</button>

            {errors.global && <div className="text-danger text-center mt-2">{errors.global}</div>}
            {success && <div className="text-success text-center mt-2">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegistration;


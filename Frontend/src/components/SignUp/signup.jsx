import React, { useState } from 'react';
import "./signup.css";
import SignUpImage from "../../assets/register.jpg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const serverURL = "http://localhost:5000";

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('User');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile) => /^[6-9][0-9]{9}$/.test(mobile);
  const validateName = (name) => {
   
    if (name.trim() !== name) {
      return false; // Reject if there are spaces at the beginning or end
    }
    return /^[A-Za-z]{3,30}(?: [A-Za-z]+)*$/.test(name); 
  };
  
  const handleFullNameChange = (e) => {
    let value = e.target.value;
  
   
    value = value.replace(/^[\s]+/, '').replace(/\s{2,}/g, ' ');
  
    setFullName(value);
  
    
    if (value.trim() !== e.target.value) {
      setValidationErrors((prev) => ({
        ...prev,
        fullName: 'Name cannot have spaces at the start and end.',
      }));
    } else if (!validateName(value)) {
      setValidationErrors((prev) => ({
        ...prev,
        fullName: 'First 3 letters should not contain spaces, and name should be 3-30 characters long.',
      }));
    } else {
      setValidationErrors((prev) => {
        const { fullName, ...rest } = prev;
        return rest;
      });
    }
  };
  
  
  

  const assessPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)) {
      if (/^(?=.*[A-Za-z]{4,})(?=.*\d{2,}).{6,}$/.test(password)) {
        if (/^(?=.*[A-Za-z]{4,})(?=.*\d{2,})(?=.*[!@#$%^&]).{6,}$/.test(password)) {
          return "Very Strong";
        }
        return "Strong";
      }
      return "Moderate";
    }
    return "Weak";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value.trim();  // Trim spaces from password input
    
  
    if (newPassword.includes(' ')) {
      setValidationErrors((prev) => ({
        ...prev,
        password: 'Password should not contain spaces.',
      }));
    } else {
      setValidationErrors((prev) => {
        const { password, ...rest } = prev; // Remove previous password error
        return rest;
      });
    }

    setPassword(newPassword);
    setPasswordStrength(assessPasswordStrength(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    // Check for spaces in password before submitting
    if (password.includes(' ')) {
      errors.password = 'Password should not contain spaces.';
    }

    if (!validateName(fullName)) errors.fullName = 'First 3 letters should be alphabets and Full name should not exceed 30 characters.';
    if (!validateEmail(email)) errors.email = 'Invalid email format.';
    if (!validateMobile(mobile)) errors.mobile = 'Mobile number must be exactly 10 digits starting from 6-9.';
    if (passwordStrength === "Weak") errors.password = 'Password is too weak.';
    if (password !== repeatedPassword) errors.repeatedPassword = 'Passwords do not match.';

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return; // If there are errors, don't submit the form

    try {
      const response = await fetch(`${serverURL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, mobile, role }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful! Redirecting to sign-in...');
        setFullName('');
        setEmail('');
        setPassword('');
        setRepeatedPassword('');
        setMobile('');
        setRole('User');
        setPasswordStrength('');
        setTimeout(() => window.location.href = '/sign-in', 2000);
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          email: data.error || 'Something went wrong.',
        }));
      }
    } catch (error) {
      console.error('Error:', error);
      setValidationErrors((prev) => ({
        ...prev,
        email: 'An error occurred, please try again later.',
      }));
    }
  };

  const handleSignInClick = () => {
    window.location.href = '/sign-in';
  };

  return (
    <div className="signup-content">
      <div className="signup-form">
        <h2 className="form-title">Sign up</h2>
        <form onSubmit={handleSubmit} className="register-form" id="register-form">
        <div className="form-group">
  <input
    type="text"
    name="fullName"
    placeholder="Your Name"
    value={fullName}
    onChange={handleFullNameChange}
    className="border p-2 rounded w-full"
  />
  {validationErrors.fullName && <p className="error-text">{validationErrors.fullName}</p>}
</div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => {
                const value = e.target.value.trim();  // Trim spaces from email input
                setEmail(value);
                if (validateEmail(value)) {
                  setValidationErrors((prev) => {
                    const { email, ...rest } = prev;
                    return rest;
                  });
                } else {
                  setValidationErrors((prev) => ({
                    ...prev,
                    email: '*Invalid email format.',
                  }));
                }
              }}
              className="border p-2 rounded w-full"
            />
            {validationErrors.email && <p className="error-text">{validationErrors.email}</p>}
          </div>
          <div className="form-group">
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              value={mobile}
              onChange={(e) => {
                const value = e.target.value.trim();  // Trim spaces from mobile input
                setMobile(value);
                if (validateMobile(value)) {
                  setValidationErrors((prev) => {
                    const { mobile, ...rest } = prev;
                    return rest;
                  });
                } else {
                  setValidationErrors((prev) => ({
                    ...prev,
                    mobile: '*Mobile number must be exactly 10 digits starting from 6-9.',
                  }));
                }
              }}
              className="border p-2 rounded w-full"
            />
            {validationErrors.mobile && <p className="error-text">{validationErrors.mobile}</p>}
          </div>

          {/* Password field */}
          <div className="form-group password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="border p-2 rounded w-full"
            />
            <span
              className="eye-icon1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
              {passwordStrength && `Password Strength: ${passwordStrength}`}
            </p>
            {validationErrors.password && <p className="error-text">{validationErrors.password}</p>}
          </div>

          {/* Confirm Password field */}
          <div className="form-group password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="re_pass"
              placeholder="Repeat your password"
              value={repeatedPassword}
              onChange={(e) => setRepeatedPassword(e.target.value.trim())}  // Trim spaces from confirm password input
              className="border p-2 rounded w-full"
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {validationErrors.repeatedPassword && <p className="error-text">{validationErrors.repeatedPassword}</p>}
          </div>

          <div className="form-group form-button">
            <input type="submit" name="signup" className="form-submit" value="Sign up" />
          </div>
        </form>
        <p className="signup-text">Already have an account? <span onClick={handleSignInClick} className="sign-up-link">Sign in</span></p>
      </div>
      <div className="signup-image">
        <img src={SignUpImage} alt="signup" className="signup-img" />
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignUp;

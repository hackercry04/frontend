import React, { useState, useRef } from 'react';
import SERVERURL from '../Serverurl';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
function ForgotPassword() {
  const [isOtpSent, setIsOtpSent] = useState(false); // State to show OTP and password fields
  const [email, setEmail] = useState(''); // State for storing email
  const [otp, setOtp] = useState(['', '', '', '']); // State for OTP input
  const inputRefs = useRef([]); // Refs to manage OTP input focus
  const [responseMessage, setResponseMessage] = useState(''); // Message for errors or success
  const [password, setPassword] = useState(''); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password

  // Function to handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make API request to send OTP to the user's email
      const response = await axios.post(`https://${SERVERURL}/user/password/emailvalidate/`, {
        email,
      });

      if (response.status === 200) {
        setIsOtpSent(true); // Show OTP and password fields
        toast.success('OTP sent to your email.');
        setOtp(['', '', '', '']);
        setPassword('');
        setConfirmPassword(''); // Notify user
      } else {
        toast.error(response.data); // Display error message
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response.data)
        toast.error(error.response.data);
      } else if (error.request) {
        toast.error('No response received. Please try again.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  // Function to handle OTP input change
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/\d/.test(value) || value === '') { // Only accept numbers
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if there's a next and input is not empty
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Function to handle OTP and password submission
  const passwordRegex = /^[^\s]{6,}$/;
  const handleOtpAndPasswordSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setResponseMessage('Passwords do not match.');
      return;
    }
    if (!passwordRegex.test(password)) {
      setResponseMessage('Passwords must be minimum 6 characters.special characters not allowed');
      return;
    }
    try {
      // Make API request to verify OTP and change password
      const response = await axios.post(`https://${SERVERURL}/user/changepassword/`, {
        email,
        otp: otp.join(''), // Combine OTP digits into a single string
        password,
      });

      if (response.status === 200) {
        toast.success('Password successfully changed.');
        setIsOtpSent(false); // Reset form to initial state
        setEmail('');
        setOtp(['', '', '', '']);
        setPassword('');
        setConfirmPassword('');
        window.location='/user/login?msg=password changed successfully'
      } else {
        toast.error(response.data.message || 'Failed to verify OTP and change password.');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data);
      } else if (error.request) {
        toast.error('No response received. Please try again.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <>
    <ToastContainer/>
    <div>
      {/* Email Form */}
      <section hidden={isOtpSent} className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Reset Password
            </h2>
            <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  />
              </div>
              <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                Send OTP
              </button>
              <button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={()=>window.location='/user/login'}>
                Go Back
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* OTP and Password Form */}
      <section hidden={!isOtpSent} className="bg-gray-50 dark:bg-gray-900">
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
          <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
            <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="font-semibold text-3xl">
                  <p>Email Verification & Password Reset</p>
                </div>
                <div className="flex flex-row text-sm font-medium text-gray-400">
                  <p>We have sent a code to your email {email}</p>
                </div>
                {responseMessage && <div className="text-sm font-medium text-red-500">{responseMessage}</div>}
              </div>

              <form onSubmit={handleOtpAndPasswordSubmit}>
                <div className="flex flex-col space-y-16">
                  {/* OTP Input Fields */}
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                    {otp.map((value, index) => (
                      <div key={index} className="w-16 h-16">
                        <input
                          ref={(el) => (inputRefs.current[index] = el)}
                          className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                          type="text"
                          value={value}
                          onChange={(e) => handleOtpChange(e, index)}
                          maxLength="1"
                          />
                      </div>
                    ))}
                  </div>

                  {/* Password Input Fields */}
                  <div className="flex flex-col space-y-4">
                    <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="••••••••"
                        required
                        />
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                      <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="••••••••"
                        required
                        />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-5">
                    <button type="submit" className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm">
                      Confirm OTP and Change Password
                    </button>

                    <p className="flex flex-row items-center justify-center text-center text-sm font-medium text-gray-500">
                      Didn't receive code? 
                      <button type="button" className="ml-1" onClick={handleEmailSubmit}>
                        Resend
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
                        </>
  );
}

export default ForgotPassword;

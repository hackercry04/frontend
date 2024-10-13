import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // or use fetch or another method to make requests
import SERVERURL from '../Serverurl';
import { useNavigate } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
function ConfirmEmail() {
  const countdownDuration = 300; // 5 minutes = 300 seconds
  const navigate=useNavigate()
  const inputRefs = useRef([]); // Ref to manage focus of input fields
  const [timeLeft, setTimeLeft] = useState(() => {
    const startingTime = localStorage.getItem('starting-time')
      ? new Date(localStorage.getItem('starting-time'))
      : new Date();
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startingTime) / 1000); // in seconds
    const remainingTime = countdownDuration - elapsedTime;
    return remainingTime > 0 ? remainingTime : 0;
  });

  const [otp, setOtp] = useState(['', '', '', '']); // State to hold OTP values
  const [responseMessage, setResponseMessage] = useState(''); // State to display response message

  useEffect(() => {
    if (timeLeft <= 0) return;

    // Save the start time in localStorage if not already set
    if (!localStorage.getItem('starting-time')) {
      localStorage.setItem('starting-time', new Date());
    }

    // Update the timer every second
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Handle input change and focus movement
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Update OTP state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input if there's a value
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join(''); // Join OTP array into a string
  
    axios.post(`https://${SERVERURL}/user/confirm-email/`, { otp: otpCode, email: localStorage.getItem('email') })
      .then(response => {
        console.log('OTP confirmed', response.data);
        setResponseMessage('OTP confirmed successfully!');
        toast.success('email verified succesfully ')
        navigate('/user/login/?msg=email verified successfully')
        // Handle success (e.g., redirect to another page or show a success message)
      })
      .catch(error => {
        console.error( error.response.data);
        setResponseMessage(error.response.data);
        // Handle error (e.g., show an error message to the user)
      });
  };

  // Handle resend OTP
  const handleResendOtp = () => {
    axios.post(`https://${SERVERURL}/user/resend-otp/`, { email: localStorage.getItem('email') })
      .then(response => {
        console.log('OTP resent', response.data);
        setResponseMessage('')
        toast.success('New OTP sent to your email.');
        setTimeLeft(countdownDuration); // Reset timer
        localStorage.setItem('starting-time', new Date());
      })
      .catch(error => {
        console.error('Error resending OTP', error);
        setResponseMessage('Error resending OTP.');
      });
  };

  // Helper function to format the countdown timer
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <ToastContainer/>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
        <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
          <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>We have sent a code to your email {localStorage.getItem('email')}</p>
              </div>
              <div className="text-red-500 text-sm font-medium">
                <p>Time left: {formatTime(timeLeft)}</p>
              </div>
              {responseMessage && <div className="text-sm font-medium text-red-500">{responseMessage}</div>}
            </div>

            <div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-16">
                  <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                    {otp.map((value, index) => (
                      <div key={index} className="w-16 h-16">
                        <input
                          ref={(el) => (inputRefs.current[index] = el)}
                          className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                          type="text"
                          value={value}
                          onChange={(e) => handleChange(e, index)}
                          maxLength="1" // Limit input to a single character
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-5">
                    <div>
                      <button
                        className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                        type="submit"
                      >
                        Verify Account
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                      <p>Didn't receive the code?</p>{' '}
                      <a
                        className="flex flex-row items-center text-blue-600"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleResendOtp();
                        }}
                      >
                        Resend
                      </a>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmEmail;

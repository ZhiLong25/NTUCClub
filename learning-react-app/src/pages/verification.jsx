import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../firebase.config";
import { RecaptchaVerifier , signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

import http from "../http";
const Verification = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  useEffect(() => {
    if (user) {
      loginSuccess();
    }
  }, [user]);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    const item = localStorage.getItem("userData");
    if (item) {
      const data = JSON.parse(item);
      const phone = data.phone
      // phone =
      const phoneInp = phoneNumber.replace(/^\d{2}/, "");
      console.log("data:",data ,"phone:" ,phone,"input:", ph);
      if (!ph.includes(phone) ) {
        toast.error("Please enter the same phone number you did just now");
      } else {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }
    }
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp) 
      .then((res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Wrong OTP");
        setLoading(false);
      });
  }

  function loginSuccess() {
    const item = localStorage.getItem("userData");
    if (item) {
      const data = JSON.parse(item);
      http
        .post("/user/verification", data)
        .then((res) => {
          console.log(res.data);
          toast.success("Registration Successful")
          setTimeout(() => {
            window.location.href = 'http://localhost:3000/login'; // Replace with the URL you want to redirect to
          }, 3000)
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
    }
  }

  return (
    <section className="flex items-center justify-center mt-10"
    style={{
      background:
        "linear-gradient(45deg, rgba(255, 99, 71, 0.4) 0%, rgba(255, 99, 71, 0.7) 100%)",
    }}>
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <h2 className="text-center text-white font-medium text-2xl">
            👍Register Success
          </h2>
          
        ) : (
          <div className="w-80 flex flex-col gap-4 rounded-lg p-4">
            <h1 className="text-center leading-normal text-white font-medium text-3xl mb-6">
              Welcome to <br /> UPLAY
            </h1>
            {showOTP ? (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsFillShieldLockFill size={30} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-xl text-white text-center"
                  style={{color:"white"}}
                >
                  Enter your OTP
                </label>
                <OtpInput
                  value={otp}
                  style={{color:"black"}}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container "
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
                <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                  <BsTelephoneFill size={30} />
                </div>
                <label
                  htmlFor=""
                  className="font-bold text-xl text-white text-center"
                >
                  Re-enter your phone number to verify
                </label>
                <PhoneInput country={"in"} value={ph} onChange={setPh} />
                <button
                  onClick={onSignup}
                  className="bg-emerald-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Verification;

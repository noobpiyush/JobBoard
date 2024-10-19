import React, { useState } from "react";
import { User, Phone, Building2, Mail, Lock } from "lucide-react";
import { InputField } from "../components/Input";
import { SignupBody, VeVerificationBody } from "../zodSchemas";
import { Link, useNavigate } from "react-router-dom";

export const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    companyName: "",
    companyEmail: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState<any>({});
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [otp, setOTP] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submisin startes");
    console.log("Form data:", formData);
    const result = SignupBody.safeParse(formData);
    console.log("Validation result:", result);
    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      try {
        const response = await fetch(
          `https://job-board-api-d0e1.onrender.com/api/v1/user/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        console.log("req sent to ");

        if (response.status === 201) {
          console.log("Signup successful. OTP sent.");
          setFormSubmitted(true);
          return;
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Something went wrong");
          return;
        }
      } catch (error) {
        console.error("Error during submission:", error);
        alert("An error occurred. Please try again.");
        return;
      }
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOTP(value);
    console.log(value);

    console.log(setOTP);

    if (value.length !== 4) {
      setOtpError("OTP must be 4 digits");
    } else {
      setOtpError("");
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const verificationData = {
      companyEmail: formData.companyEmail,
      otp: otp,
    };

    const result = VeVerificationBody.safeParse(verificationData);
    if (!result.success) {
      setOtpError("Invalid OTP");
    } else {
      setOtpError("");
      try {
        const response = await fetch(`https://job-board-api-d0e1.onrender.com/api/v1/user/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verificationData),
        });

        if (response.status === 200) {
          console.log("OTP verified successfully.");
          // Redirect to login page or dashboard
          // You might want to use React Router for navigation
          alert("Account verified successfully");
          navigate("/dashboard");
        } else {
          const errorData = await response.json();
          setOtpError(errorData.message || "Invalid OTP");
        }
      } catch (error) {
        console.error("Error during OTP verification:", error);
        setOtpError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto md:mt-5 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
      {formSubmitted === false ? (
        <form onSubmit={handleSubmit} noValidate>
          {/* ... (rest of the signup form remains the same) ... */}
          <div className="space-y-4">
            <InputField
              name="name"
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              Icon={User}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}

            <InputField
              name="phoneNumber"
              type="tel"
              placeholder="phoneNumber no."
              value={formData.phoneNumber}
              onChange={handleChange}
              Icon={Phone}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
            )}

            <InputField
              name="companyName"
              type="text"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              Icon={Building2}
            />
            {errors.companyName && (
              <p className="text-red-500 text-xs">{errors.companyName}</p>
            )}

            <InputField
              name="companyEmail"
              type="email"
              placeholder="Company Email"
              value={formData.companyEmail}
              onChange={handleChange}
              Icon={Mail}
            />
            {errors.companyEmail && (
              <p className="text-red-500 text-xs">{errors.companyEmail}</p>
            )}

            <InputField
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              Icon={Lock}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          <p className="text-xs text-gray-600 mt-4 mb-4">
            By clicking on proceed you will accept our{" "}
            <a href="#" className="text-blue-500">
              Terms & Conditions
            </a>
          </p>
          <p className="text-xs text-gray-600 mt-4 mb-4 gap-3">
            <Link to="/signin"> Signup</Link>
          </p>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Proceed
          </button>
        </form>
      ) : (
        <form onSubmit={handleOTPSubmit}>
          <div className="space-y-4">
            <InputField
              name="otp"
              type="text"
              placeholder="Enter 4-digit OTP"
              value={otp}
              onChange={handleOTPChange}
              Icon={Lock}
            />
            {otpError && <p className="text-red-500 text-xs">{otpError}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 mt-4"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
};

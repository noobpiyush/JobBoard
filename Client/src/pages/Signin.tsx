import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { InputField } from "../components/Input";
import { SigninBody } from "../zodSchemas";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Signin = () => {
  const [formData, setFormData] = useState({
    companyEmail: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submission started");
    console.log("Form data:", formData);
    const result = SigninBody.safeParse(formData);
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
          `https://job-board-api-d0e1.onrender.com/api/v1/user/signin`, // Change to signin endpoint
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        console.log("Request sent to signin");

        if (response.ok) {
          const data = await response.json();
          console.log("Signin successful:", data);
          // Store the JWT token in localStorage
          localStorage.setItem("token", data.token);
          alert("Signin successful!");
          navigate("/dashboard");
          // Optionally, redirect the user to another page
          // e.g., window.location.href = "/dashboard";
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

  return (
    <div className="max-w-md mx-auto md:mt-5 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-2">Sign In</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
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

        <p className="text-xs text-gray-600 mt-4 mb-4 gap-3">
          <Link  to="/"> Signin</Link>
        </p>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Proceed
        </button>
      </form>
    </div>
  );
};

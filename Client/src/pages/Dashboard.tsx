import React, { useState } from "react";
import { z } from "zod";

// Zod schema for form validation (matching your backend)
const JobPostingBody = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
  experienceLevel: z.enum(["Entry", "Mid-level", "Senior", "Executive"]),
  candidates: z.array(z.string().email("Invalid email address")).optional(),
  endDate: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid date format",
  }),
  company: z.string().min(1, "Company name is required"), // Added validation
});

type FormData = z.infer<typeof JobPostingBody>;

const JobForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    jobDescription: "",
    experienceLevel: "Entry",
    candidates: [],
    endDate: "",
    company: "", // Changed to lowercase
  });

  const [candidateEmail, setCandidateEmail] = useState<string>("");
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCandidateAdd = () => {
    if (candidateEmail) {
      setFormData((prevData) => ({
        ...prevData,
        candidates: [...(prevData.candidates || []), candidateEmail],
      }));
      setCandidateEmail(""); // Clear the input after adding
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = JobPostingBody.safeParse(formData);

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.errors.forEach((error) => {
        fieldErrors[error.path[0]] = error.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
      console.log("Form data submitted: ", formData);

      try {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        console.log("Token retrieved:", token);

        if (!token) {
          alert("Please login");
          return;
        }

        const response = await fetch("https://job-board-api-d0e1.onrender.com/api/v1/job/post", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include", // This might not be necessary since you're using Authorization header
        });

        if (response.status === 201) {
          console.log("Job posted successfully.");
          alert("Job posted successfully!");
          // Optionally, you can reset the form or navigate to another page
          setFormData({
            jobTitle: "",
            jobDescription: "",
            experienceLevel: "Entry",
            candidates: [],
            endDate: "",
            company: "",
          });
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Failed to post the job.");
        }
      } catch (error) {
        console.error("Error during job posting:", error);
        alert("An error occurred while posting the job. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 shadow-md rounded-lg">
      <form onSubmit={handleSubmit}>
        {/* Job Title */}
        <div className="mb-4">
          <label htmlFor="jobTitle" className="block text-gray-700 font-bold">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Enter Job Title"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          />
          {errors.jobTitle && (
            <p className="text-red-500 text-sm">{errors.jobTitle}</p>
          )}
        </div>

        {/* Company Name */}
        <div className="mb-4">
          <label htmlFor="company" className="block text-gray-700 font-bold">
            Company Name
          </label>
          <input
            type="text"
            id="company" // Changed id to match the name
            name="company" // Changed to lowercase to match formData
            value={formData.company} // Changed to lowercase
            onChange={handleChange}
            placeholder="Enter Company Name"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          />
          {errors.company && ( // Changed to lowercase
            <p className="text-red-500 text-sm">{errors.company}</p>
          )}
        </div>

        {/* Job Description */}
        <div className="mb-4">
          <label
            htmlFor="jobDescription"
            className="block text-gray-700 font-bold"
          >
            Job Description
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            placeholder="Enter Job Description"
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            rows={4}
          />
          {errors.jobDescription && (
            <p className="text-red-500 text-sm">{errors.jobDescription}</p>
          )}
        </div>

        {/* Experience Level */}
        <div className="mb-4">
          <label
            htmlFor="experienceLevel"
            className="block text-gray-700 font-bold"
          >
            Experience Level
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={formData.experienceLevel}
            onChange={handleChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          >
            <option value="Entry">Entry</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
            <option value="Executive">Executive</option>
          </select>
          {errors.experienceLevel && (
            <p className="text-red-500 text-sm">{errors.experienceLevel}</p>
          )}
        </div>

        {/* Add Candidate */}
        <div className="mb-4">
          <label htmlFor="candidates" className="block text-gray-700 font-bold">
            Add Candidate
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              id="candidateEmail"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              placeholder="Add candidate email"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={handleCandidateAdd}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Add
            </button>
          </div>
          {formData.candidates?.length != null && formData.candidates?.length > 0 && (
            <ul className="mt-2">
              {formData.candidates.map((email, idx) => (
                <li key={idx} className="text-sm text-gray-700">
                  {email}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* End Date */}
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-gray-700 font-bold">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full mt-2 p-2 border border-gray-300 rounded"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default JobForm;

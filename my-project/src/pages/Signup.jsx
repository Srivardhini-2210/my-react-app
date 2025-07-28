import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";  // Fixed: Added setDoc and doc
import { db } from "../firebase";

import {
  FaEye,
  FaEyeSlash,
  FaLaptopCode,
  FaBullhorn,
  FaPaintBrush,
  FaBrain,
  FaCloud,
  FaLock,
  FaBriefcase,
  FaRobot,
  FaChalkboardTeacher,
  FaComments,
  FaProjectDiagram,
  FaChartLine,
} from "react-icons/fa";

const interestOptions = [
  { label: "Programming", icon: <FaLaptopCode /> },
  { label: "Digital Marketing", icon: <FaBullhorn /> },
  { label: "UI/UX Design", icon: <FaPaintBrush /> },
  { label: "AI/ML", icon: <FaBrain /> },
  { label: "Data Science", icon: <FaChartLine /> },
  { label: "NLP", icon: <FaRobot /> },
 
  { label: "Communication", icon: <FaComments /> },
  { label: "Cloud Computing", icon: <FaCloud /> },
  { label: "Cybersecurity", icon: <FaLock /> },
  { label: "Project Management", icon: <FaProjectDiagram /> },
  { label: "Business", icon: <FaBriefcase /> },
];

const isValidEmail = (email) => {
  // Simple email regex pattern
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    educationLevel: "",
    domainOfEducation: "",
    profession: "",
    country: "",
    interests: [],
  });

  // State for real-time error messages
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    dob: "", // For DOB errors
  });

  const handleInterestChange = (interest) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  // Validate email on change
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    setErrors((prev) => ({
      ...prev,
      email: email && !isValidEmail(email) ? "Please enter a valid email address." : "",
    }));
  };

  // Validate password on change
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setErrors((prev) => ({
      ...prev,
      password: password && password.length < 6 ? "Password should be at least 6 characters." : "",
      confirmPassword:
        formData.confirmPassword && password !== formData.confirmPassword
          ? "Passwords do not match."
          : "",
    }));
  };

  // Validate confirm password on change
  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });
    setErrors((prev) => ({
      ...prev,
      confirmPassword:
        confirmPassword && formData.password !== confirmPassword ? "Passwords do not match." : "",
    }));
  };

  // NEW: Validate DOB on change or blur
  const handleDobChange = (e) => {
    const dob = e.target.value;
    console.log("DOB changed to:", dob); // Debug: Check if onChange fires
    setFormData({ ...formData, dob });
    validateDob(dob);
  };

  const handleDobBlur = () => {
    console.log("DOB input blurred"); // Debug: Check if onBlur fires
    validateDob(formData.dob);
  };

  const validateDob = (dob) => {
    let ageError = "";

    if (dob) {
      const [year, month, day] = dob.split("-").map(Number);

      // Check if date is valid
      const isValidDate = () => {
        if (month < 1 || month > 12 || day < 1 || day > 31) return false;
        const maxDaysInMonth = new Date(year, month, 0).getDate(); // Get last day of month
        if (day > maxDaysInMonth) return false;
        // Leap year check for February
        if (month === 2 && day === 29) {
          if (!(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))) return false;
        }
        return true;
      };

      if (!isValidDate()) {
        ageError = "Please select a valid date.";
      } else {
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        if (birthDate > today) {
          ageError = "Please select a valid past date.";
        } else {
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          console.log("Calculated age:", age); // Debug: Check calculated age
          if (age < 10) {
            ageError = "You must be at least 10 years old to sign up.";
          }
        }
      }
    }

    console.log("DOB Error set to:", ageError); // Debug: Confirm error is set
    setErrors((prev) => ({ ...prev, dob: ageError }));
  };

  // Step validation functions (for button disabling)
  const isStep1Valid = () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    )
      return false;
    if (!isValidEmail(formData.email)) return false;
    if (formData.password.length < 6) return false;
    if (formData.password !== formData.confirmPassword) return false;
    return true;
  };

  const isStep2Valid = () => {
    if (
      !formData.dob ||
      !formData.gender ||
      !formData.educationLevel ||
      !formData.profession ||
      !formData.country ||
      errors.dob // Check for DOB error
    )
      return false;
    if (
      formData.educationLevel === "Higher Studies" &&
      !formData.domainOfEducation.trim()
    )
      return false;
    return true;
  };

  const isStep3Valid = () => {
    return formData.interests.length > 0;
  };

  // Next button handler (step validation still helpful for alerts)
  const handleNext = () => {
    if (step === 1 && !isStep1Valid()) {
      alert("Please fill all Step 1 fields correctly.");
      return;
    }
    if (step === 2 && !isStep2Valid()) {
      alert("Please fill all Step 2 fields correctly.");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      dob,
      gender,
      educationLevel,
      domainOfEducation,
      profession,
      country,
      interests,
    } = formData;

    // Required checks (your existing validation)
    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !dob ||
      !gender ||
      !educationLevel ||
      !profession ||
      !country ||
      interests.length === 0
    ) {
      alert("Please fill out all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      alert("Password should be at least 6 characters.");
      return;
    }
    if (errors.dob) {
      alert(errors.dob);
      return;
    }

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare profile data (exclude passwords)
      const profileData = {
        fullName,
        email,
        dob,
        gender,
        educationLevel,
        domainOfEducation: educationLevel === "Higher Studies" ? domainOfEducation : "",
        profession,
        country,
        interests,
        createdAt: new Date(),
      };

      // Store in Firestore using user's UID as document ID
      await setDoc(doc(db, "users", user.uid), profileData);
      console.log("User profile stored successfully with UID: ", user.uid);

      // Navigate to login or home
      navigate("/");
    } catch (error) {
      console.error("Error during signup:", error);  // Log full error for debugging
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please log in instead.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format.");
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak. Please choose a stronger one.");
      } else {
        alert(`Signup failed: ${error.message}`);  // Show full message for better debugging
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="w-full max-w-2xl bg-[#0f172a] text-white p-6 rounded-xl shadow-2xl border border-blue-800 overflow-y-auto max-h-[90vh]">
        <div className="w-full bg-gray-700 h-2 rounded-full mb-4">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              step === 1
                ? "w-1/3 bg-blue-500"
                : step === 2
                ? "w-2/3 bg-yellow-400"
                : "w-full bg-green-400"
            }`}
          />
        </div>

        <div className="text-lg font-bold mb-4 text-blue-300">
          Step {step} of 3
        </div>

        {/* Step 1: Account Info */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <div className="font-semibold text-blue-300 text-xl text-center mb-4">
              CREATE ACCOUNT
            </div>
            <input
              placeholder="Full Name"
              className="w-full p-2 rounded bg-slate-800 text-white placeholder-gray-400 shadow hover:shadow-blue-400 focus:shadow-blue-500 focus:outline-none"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            <div className="flex flex-col gap-1">
              <input
                placeholder="Email"
                type="email"
                className="w-full p-2 rounded bg-slate-800 text-white placeholder-gray-400 shadow hover:shadow-blue-400 focus:shadow-blue-500 focus:outline-none"
                value={formData.email}
                onChange={handleEmailChange}
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <div className="relative">
                <input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 rounded bg-slate-800 text-white placeholder-gray-400 pr-10 shadow hover:shadow-blue-400 focus:shadow-blue-500 focus:outline-none"
                  value={formData.password}
                  onChange={handlePasswordChange}
                />
                <span
                  onClick={() => setShowPassword((show) => !show)}
                  className="absolute top-2 right-3 cursor-pointer text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <input
                placeholder="Confirm Password"
                type="password"
                className="w-full p-2 rounded bg-slate-800 text-white placeholder-gray-400 shadow hover:shadow-blue-400 focus:shadow-blue-500 focus:outline-none"
                value={formData.confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <div className="flex flex-col gap-3">
            <div className="font-semibold text-blue-300 text-xl text-center mb-4">
              👤 PERSONAL INFORMATION
            </div>
            <label className="font-semibold text-blue-300">DOB</label>
            <div className="flex flex-col gap-1">
              <input
                type="date"
                className="w-full p-2 rounded bg-slate-800 text-white placeholder-gray-400 shadow hover:shadow-blue-400 focus:shadow-blue-500 focus:outline-none"
                value={formData.dob}
                onChange={handleDobChange}
                onBlur={handleDobBlur} // Validate on blur as well
                onKeyDown={(e) => e.preventDefault()} // Disable typing to force calendar picker only
                max={new Date().toISOString().split("T")[0]} // No future dates
                min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split("T")[0]} // Max 100 years ago
              />
              {errors.dob && <p className="text-red-500 text-sm p-1 bg-red-100 rounded">{errors.dob}</p>} 
            </div>
            <select
              className="w-full p-2 rounded bg-slate-800 text-white shadow hover:shadow-blue-400 focus:shadow-blue-500 focus:outline-none"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-blue-300">
                Education Level
              </label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="edu"
                    value="School"
                    checked={formData.educationLevel === "School"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        educationLevel: e.target.value,
                        domainOfEducation: "",
                      })
                    }
                  />{" "}
                  School
                </label>
                <label>
                  <input
                    type="radio"
                    name="edu"
                    value="Higher Studies"
                    checked={formData.educationLevel === "Higher Studies"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        educationLevel: e.target.value,
                      })
                    }
                  />{" "}
                  Higher Studies
                </label>
              </div>
              {formData.educationLevel === "Higher Studies" && (
                <input
                  placeholder="Domain of Education"
                  className="w-full p-2 rounded bg-slate-800 text-white shadow hover:shadow-blue-400 focus:shadow-blue-500 focus:outline-none"
                  value={formData.domainOfEducation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      domainOfEducation: e.target.value,
                    })
                  }
                />
              )}
            </div>

            <select
              className="w-full p-2 rounded bg-slate-800 text-white shadow hover:shadow-blue-400 focus:shadow-blue-500 focus:outline-none"
              value={formData.profession}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  profession: e.target.value,
                })
              }
            >
              <option value="">Select Profession</option>
              <option value="Student">Student</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="Teacher">Teacher</option>
              <option value="Accountant">Accountant</option>
              <option value="Administrative Assistant">
                Administrative Assistant
              </option>
              <option value="Architect">Architect</option>
              <option value="Customer Service Representative">
                Customer Service Representative
              </option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Doctor">Doctor</option>
              <option value="Digital Marketer">Digital Marketer</option>
          
              <option value="Engineer">Engineer</option>
              <option value="Financial Analyst">Financial Analyst</option>
              <option value="Graphic Designer">Graphic Designer</option>
              <option value="HR Manager">HR Manager</option>
              <option value="Lawyer">Lawyer</option>
              <option value="Marketing Manager">Marketing Manager</option>
              <option value="Medical Assistant">Medical Assistant</option>
              <option value="Nurse">Nurse</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Sales Representative">Sales Representative</option>
              <option value="Software Developer">Software Developer</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="UX Designer">UX Designer</option>
              <option value="Web Developer">Web Developer</option>
              <option value="Web Designer">Web Designer</option>
              <option value="Looking for Opportunities">
                Looking for Opportunities
              </option>
              <option value="Other">Other</option>
            </select>

            <input
              placeholder="Country"
              className="w-full p-2 rounded bg-slate-800 text-white shadow hover:shadow-blue-400 focus:shadow-blue-500 focus:outline-none"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
            />
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-blue-300 text-xl text-center mb-4">
              DOMAIN OF INTEREST
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {interestOptions.map(({ label, icon }) => {
                const isSelected = formData.interests.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleInterestChange(label)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 transition-all duration-300 font-semibold text-gray-900
                    ${
                      isSelected
                        ? "bg-blue-300 border-blue-400 shadow-[0_0_15px_#3b82f6]"
                        : "bg-blue-100 border-blue-200 hover:shadow-[0_0_10px_#60a5fa]"
                    }`}
                  >
                    {icon}
                    <span className="text-gray-900">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 bg-slate-600 rounded shadow text-black hover:shadow-blue-500 transition"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !isStep1Valid()) ||
                (step === 2 && !isStep2Valid())
              }
              className={`ml-auto px-4 py-2 rounded text-black shadow hover:shadow-blue-500 transition
              ${
                (step === 1 && !isStep1Valid()) ||
                (step === 2 && !isStep2Valid())
                  ? "bg-blue-300 opacity-60 cursor-not-allowed"
                  : "bg-blue-600"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStep3Valid()}
              className={`ml-auto px-4 py-2 rounded shadow text-black hover:shadow-blue-500 transition
              ${
                !isStep3Valid()
                  ? "bg-green-300 opacity-60 cursor-not-allowed"
                  : "bg-green-600"
              }`}
            >
              Create Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;

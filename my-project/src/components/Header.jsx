// Header.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaHeart,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGraduationCap,
  FaBriefcase,
  FaUser as FaUserIcon,
} from "react-icons/fa";
import { SavedCoursesContext } from "../context/SavedCoursesContext";
import CoursesDropdown from "./CoursesDropdown";

const mockWishlist = [
  { id: 1, title: "React Development", instructor: "John Doe", price: "$99" },
  { id: 2, title: "Machine Learning Basics", instructor: "Jane Smith", price: "$149" },
  { id: 3, title: "UI/UX Design", instructor: "Mike Johnson", price: "$79" },
];

export default function Header() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef(null);
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false);
  const wishlistRef = useRef(null);
  const { savedCourses } = useContext(SavedCoursesContext) || { savedCourses: [] };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
      if (!user) {
        setUserInfo(null);
        setLoading(false);
        return;
      }
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        setUserInfo(userDoc.exists() ? userDoc.data() : { fullName: user.email || "User" });
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [auth]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (wishlistRef.current && !wishlistRef.current.contains(event.target)) {
        setShowWishlistDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch(() => alert("Logout failed"));
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-xs font-bold text-gray-900">CourseXpert</h1>
          </div>
<div className="max-w-7xl mx-auto px-4">
  <nav className="flex items-center justify-start space-x-6 w-full">
    <CoursesDropdown />
  </nav>
</div>


          <div className="flex items-center space-x-3 relative">
            <button className="text-gray-500 hover:text-blue-600"><FaBell /></button>

            <div ref={wishlistRef} className="relative">
              <button onClick={() => setShowWishlistDropdown(!showWishlistDropdown)} className="text-gray-500 hover:text-red-600 relative">
                <FaHeart className="text-xl" />
                {mockWishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{mockWishlist.length}</span>
                )}
              </button>
              {showWishlistDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg w-80 z-50 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                  <h3 className="font-bold p-4 border-b">Wishlist ({mockWishlist.length})</h3>
                  {mockWishlist.length > 0 ? (
                    mockWishlist.map((item) => (
                      <div key={item.id} className="flex justify-between p-4 border-b">
                        <div>
                          <h4 className="text-sm font-medium">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.instructor}</p>
                        </div>
                        <span className="text-sm font-semibold text-blue-500">{item.price}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 p-4">No items in wishlist</p>
                  )}
                </div>
              )}
            </div>

            <div ref={profileRef} className="relative">
              <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="text-gray-500 hover:text-blue-600"><FaUser /></button>
              {showProfileDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg w-80 z-50 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                  {loading ? (
                    <p className="text-center p-4">Loading...</p>
                  ) : userInfo ? (
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center"><FaUserIcon className="text-2xl" /></div>
                        <div>
                          <h3 className="font-semibold">{userInfo.fullName || "User"}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1"><FaEnvelope className="text-xs" /> {userInfo.email}</p>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span className="flex items-center gap-2 text-gray-500"><FaCalendarAlt /> Birth Date</span><span>{userInfo.dob ? new Date(userInfo.dob).toLocaleDateString() : "N/A"}</span></div>
                        <div className="flex justify-between"><span className="flex items-center gap-2 text-gray-500"><FaMapMarkerAlt /> Location</span><span>{userInfo.country || "N/A"}</span></div>
                        <div className="flex justify-between"><span className="flex items-center gap-2 text-gray-500"><FaGraduationCap /> Education</span><span>{userInfo.educationLevel || "N/A"}</span></div>
                        <div className="flex justify-between"><span className="flex items-center gap-2 text-gray-500"><FaBriefcase /> Profession</span><span>{userInfo.profession || "N/A"}</span></div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 p-4">No profile data available.</p>
                  )}
                </div>
              )}
            </div>

            <button onClick={handleLogout} className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-700 flex items-center"><FaSignOutAlt className="mr-1" /> Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}

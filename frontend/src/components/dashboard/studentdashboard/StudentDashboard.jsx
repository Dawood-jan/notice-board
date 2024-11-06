import React, { useState, useEffect, useContext } from "react";
import {
  Link,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { CircleUserRound, LogOut, FileText, Bell } from "lucide-react";
import UpdateProfile from "../common/UpdateProfile";
import GetNotice from "../studentdashboard/GetNotice";
import GetSemesterNotices from "../common/GetSemesterNotices";
import "../common/admin-style.css";
import { AuthContext } from "../../AuthContext";
import { FaUserCircle } from "react-icons/fa";
import ProfilePhoto from "../common/ProfilePhoto";
import axios from "axios";
import Profile from "../common/Profile";

const StudentDashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}users/profile-photo`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        console.log("Response:", response.data);

        if (
          response.data.success &&
          response.data.photoUrl &&
          response.data.photoUrl !== "undefined"
        ) {
          const fullPhotoUrl = `${import.meta.env.VITE_BASE_URL}${
            response.data.photoUrl
          }`;
          setProfilePhoto(fullPhotoUrl);
        } else {
          console.error(
            "Failed to fetch profile photo:",
            response.data.message
          );
          setProfilePhoto(null);
        }
      } catch (error) {
        console.error("Error fetching profile photo:", error);
        setProfilePhoto(null);
      }
    };

    fetchProfilePhoto();
  }, [auth.token]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpload = (photoUrl) => {
    const baseUrl = import.meta.env.VITE_BASE_URL.endsWith("/")
      ? import.meta.env.VITE_BASE_URL.slice(0, -1)
      : import.meta.env.VITE_BASE_URL;
    const cleanedPhotoUrl = photoUrl.startsWith("/")
      ? photoUrl.slice(1)
      : photoUrl;
    const fullPhotoUrl = `${baseUrl}/${cleanedPhotoUrl}`;

    console.log(fullPhotoUrl);

    setProfilePhoto(fullPhotoUrl);
    closeModal();
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={`wrapper ${sidebarVisible ? "" : "sidebar-hidden"}`}>
      {/* Sidebar */}
      <div className="sidebar" data-background-color="dark">
        <div className="sidebar-logo">
          <div className="logo-header" data-background-color="dark">
            <Link to="/student-dashboard" className="logo">
              <img
                src="/Notice Board.png"
                alt="Notice Board Icon"
                className="h-12 w-12"
              />
            </Link>
            <div className="nav-toggle">
              <button className="btn btn-toggle toggle-sidebar">
                <i className="gg-menu-right"></i>
              </button>
              <button className="btn btn-toggle sidenav-toggler">
                <i className="gg-menu-left"></i>
              </button>
            </div>
            <button className="topbar-toggler more">
              <i className="gg-more-vertical-alt"></i>
            </button>
          </div>
        </div>
        <div className="sidebar-wrapper scrollbar scrollbar-inner">
          <div className="sidebar-content">
            <div className="profile-photo text-center my-3" onClick={openModal}>
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="img-fluid img-fluid w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="placeholder-profile-photo rounded-circle">
                  <FaUserCircle size={50} />
                </div>
              )}
            </div>

            {/* Welcome Message */}
            <div className="welcome-message text-center my-3">
              <h4>Welcome, {auth.fullname}!</h4>
            </div>

            <ul className="nav nav-secondary">
              <li
                className={`nav-item ${
                  location.pathname === "/student-dashboard/notifications"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/student-dashboard/notifications">
                  <FileText className="mr-4 size-6" />
                  <p>Department Notifications</p>
                </Link>
              </li>

              <li
                className={`nav-item ${
                  location.pathname ===
                  "/student-dashboard/semester-notifications"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/student-dashboard/semester-notifications">
                  <FileText className="mr-4 size-6" />
                  <p>Semester Notifications</p>
                </Link>
              </li>
              <li
                className={`nav-item ${
                  location.pathname === "/student-dashboard/update-profile"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/student-dashboard/update-profile">
                  <CircleUserRound className="mr-4 size-6" />
                  <p>Update Profile</p>
                </Link>
              </li>
              <li className={`nav-item`}>
                <Link to="#" onClick={handleLogout} className="nav-link">
                  <LogOut className="mr-4 size-6" />
                  <p>Logout</p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* End Sidebar */}

      <div className="main-panel">
        <div className="main-header">
          <div className="main-header-logo">
            <div className="logo-header" data-background-color="dark">
              <div className="nav-toggle">
                <button
                  className="btn btn-toggle toggle-sidebar"
                  onClick={toggleSidebar}
                >
                  <i className="gg-menu-right"></i>
                </button>
                <button
                  className="btn btn-toggle sidenav-toggler"
                  onClick={toggleSidebar}
                >
                  <i className="gg-menu-left"></i>
                </button>
              </div>
              <button className="topbar-toggler more">
                <i className="gg-more-vertical-alt"></i>
              </button>
            </div>
          </div>

          <nav className="navbar navbar-header navbar-expand-lg border-bottom bg-gradient-to-br from-gray-900 to-emerald-900 bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl">
            <div className="container-fluid">
              <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <button type="submit" className="btn btn-search pe-1">
                      <i className="fa fa-search search-icon"></i>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search ..."
                    className="form-control"
                  />
                </div>
              </nav>

              <ul className="navbar-nav topbar-nav ms-md-auto align-items-center">
                <li className="nav-item topbar-icon dropdown hidden-caret d-flex d-lg-none">
                  <a
                    className="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                    href="#"
                    role="button"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <i className="fa fa-search"></i>
                  </a>
                  <ul className="dropdown-menu dropdown-search animated fadeIn">
                    <form className="navbar-left navbar-form nav-search">
                      <div className="input-group">
                        <input
                          type="text"
                          placeholder="Search ..."
                          className="form-control"
                        />
                      </div>
                    </form>
                  </ul>
                </li>

                <li className="nav-item topbar-user dropdown hidden-caret">
                  <Link
                    className="dropdown-toggle profile-pic"
                    data-bs-toggle="dropdown"
                    href="#"
                    aria-expanded="false"
                  >
                    <div className="avatar-sm">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile"
                          className="avatar-img rounded-circle"
                        />
                      ) : (
                        <FaUserCircle size={30} className="text-white" />
                      )}
                    </div>
                    <span className="profile-username">
                      <span className="text-white fw-bold">Hi,</span>
                      <span className="fw-bold text-white">
                        {auth.fullname}
                      </span>
                    </span>
                  </Link>
                  <ul className="dropdown-menu dropdown-user animated fadeIn">
                    <div className="dropdown-user-scroll scrollbar-outer">
                      <li>
                        <div className="user-box flex-col items-center text-center">
                          <div className="avatar-lg ">
                            {profilePhoto ? (
                              <img
                                src={profilePhoto}
                                alt="Profile"
                                className="avatar-img rounded"
                              />
                            ) : (
                              <FaUserCircle size={50} />
                            )}
                          </div>
                          <div className="u-text">
                            <h4>{auth.fullname}</h4>
                            <p className="text-muted">{auth.email}</p>
                            <Link
                              to="/student-dashboard/profile"
                              className="btn btn-xs btn-secondary btn-sm"
                            >
                              View Profile
                            </Link>
                          </div>
                          <div className="mt-2">
                            <Link
                              to="#"
                              onClick={handleLogout}
                              className="btn btn-xs btn-primary btn-sm "
                            >
                              Logout
                            </Link>
                          </div>
                        </div>
                      </li>
                    </div>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="container">
          <div className="page-inner p-0 ">
            <div className="page-category m-0">
              <Routes>
                <Route path="notifications" element={<GetNotice />} />
                <Route
                  path="semester-notifications"
                  element={<GetSemesterNotices />}
                />
                <Route path="update-profile" element={<UpdateProfile />} />
                <Route
                  path="profile"
                  element={<Profile profilePhoto={profilePhoto} />}
                />
                <Route path="/" element={<Navigate to="notifications" />} />{" "}
                {/* Default route */}
              </Routes>
            </div>
          </div>
        </div>

        {/* <footer className="footer">
          <div className="container-fluid">
            <div className="copyright">
              2024, made by{" "}
              <i className="fa fa-heart heart text-danger"> Dawood jan</i>
            </div>
          </div>
        </footer> */}
      </div>

      {isModalOpen && (
        <ProfilePhoto onClose={closeModal} onUpload={handleUpload} />
      )}
    </div>
  );
};

export default StudentDashboard;

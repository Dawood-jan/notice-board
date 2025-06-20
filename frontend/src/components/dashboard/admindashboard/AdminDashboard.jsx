import React, { useState, useEffect, useContext } from "react";
import {
  Link,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  CircleUserRound,
  LogOut,
  FileText,
  Bell,
  Users,
  Loader,
  Layers,
  Mail,
  UserCircle,
  Ban,
} from "lucide-react";
import UpdateProfile from "../common/UpdateProfile";
import Notice from "../admindashboard/AddNotice";
import GetNoticeByDepartment from "../admindashboard/GetNoticeByDepartment";
import "../common/admin-style.css";
import { AuthContext } from "../../AuthContext";
import { FaUserCircle } from "react-icons/fa";
import ProfilePhoto from "../common/ProfilePhoto";
import Profile from "../common/Profile";
import axios from "axios";
import EditNotice from "../admindashboard/EditNotice";
import AllStudents from "../admindashboard/AllStudents";
import AllFaculty from "../admindashboard/AllFaculty";
import AddFaculty from "../admindashboard/AddFaculty";
import CreateSemesterNotice from "../admindashboard/CreateSemesterNotice";
import GetSemesterNotices from "../common/GetSemesterNotices";
import StudentNotice from "../admindashboard/StudentNotice";
import EditSemesterNotice from "../admindashboard/EditSemesterNotice";
import GetAllStudentsNotice from "./GetAllStudentsNotice";
import EditStudentNotice from "./EditStudentNotice";
import AdminPendingUsers from "./AdminPendingUsers";
import CreatePrincipalNotice from "../principal/CreatePrincipalNotice";
import GetPrincipalNotices from "../principal/GetPrincipalNotices";
import EditPrincipalNotice from "../principal/EditPrincipalNotice";
import GetRejectedUsers from "./GetRejectedUsers";
import UpdateStudentRecord from "./UpdateStudentRecord";

const AdminDashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null); // State for profile photo URL

  useEffect(() => {
    // Fetch the user's profile photo URL
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

        console.log(response.data);

        if (response.data.success && response.data.photoUrl) {
          const fullPhotoUrl = `${import.meta.env.VITE_BASE_URL}${
            response.data.photoUrl
          }`;

          console.log(fullPhotoUrl);

          setProfilePhoto(fullPhotoUrl);
        } else {
          console.error(
            "Failed to fetch profile photo:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching profile photo:", error);
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

    setProfilePhoto(fullPhotoUrl); // Update state with new photo URL
    closeModal();
  };

  const handleLogout = async () => {
    try {
      // Call the logout function from AuthContext to clear auth data
      logout();

      // Redirect the user to the login page
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
            <Link to="/admin-dashboard" className="logo">
              <img
                src="/notice-board.png"
                alt="Notice Board Icon"
                className="h-18 w-20"
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
                  className="img-fluid w-32 h-32 rounded-full object-cover"
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
              {/*  Only visible to principal */}
              {auth.role === "principal" && (
                <>
                  <li
                    className={`nav-item ${
                      location.pathname ===
                      "/admin-dashboard/add-principal-notice"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link to="/admin-dashboard/add-principal-notice">
                      <Bell className="mr-4 size-6" />
                      <p>Add Principal Notice</p>
                    </Link>
                  </li>

                  <li
                    className={`nav-item ${
                      location.pathname ===
                      "/admin-dashboard/get-principal-notice"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link to="/admin-dashboard/get-principal-notice">
                      <FileText className="mr-4 size-6" />
                      <p>Get Principal Notices</p>
                    </Link>
                  </li>
                </>
              )}

              {/* Add Notice - Only visible to admins */}
              {auth.role === "admin" && (
                <>
                  <li
                    className={`nav-item ${
                      location.pathname === "/admin-dashboard/notifications"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link to="/admin-dashboard/notifications">
                      <Bell className="mr-4 size-6" />
                      <p>Add Department Notice</p>
                    </Link>
                  </li>

                  <li
                    className={`nav-item ${
                      location.pathname === "/admin-dashboard/student-notice"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link to="/admin-dashboard/student-notice">
                      <Mail className="mr-4 size-6" />
                      <p>Add Student Notice</p>
                    </Link>
                  </li>
                </>
              )}

              {/* Add Notice - Only visible to teachers */}
              {auth.role === "teacher" && (
                <li
                  className={`nav-item ${
                    location.pathname === "/admin-dashboard/add-semester-notice"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/admin-dashboard/add-semester-notice">
                    <Bell className="mr-4 size-6" />
                    <p>Add Semester Notice</p>
                  </Link>
                </li>
              )}

              {/* Add Faculty - Only visible to admins */}
              {auth.role === "admin" && (
                <li
                  className={`nav-item ${
                    location.pathname === "/admin-dashboard/add-faculty"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/admin-dashboard/add-faculty">
                    <UserCircle className="mr-4 size-6" />
                    <p>Add Faculty</p>
                  </Link>
                </li>
              )}

              {auth.role === "admin" && (
                <li
                  className={`nav-item ${
                    location.pathname === "/admin-dashboard/all-student-notice"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/admin-dashboard/all-student-notice">
                    <FileText className="mr-4 size-6" />
                    <p>All Student Notices</p>
                  </Link>
                </li>
              )}

              {/* All Semester Notices - Only visible to teachers */}
              {auth.role === "teacher" && (
                <li
                  className={`nav-item ${
                    location.pathname ===
                    "/admin-dashboard/semester-notifications"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/admin-dashboard/semester-notifications">
                    <Layers className="mr-4 size-6" />
                    <p>All Semester Notices</p>
                  </Link>
                </li>
              )}

              {/* All Notices - Visible to both admins and teachers */}
              {(auth.role === "teacher" || auth.role === "admin") && (
                <>
                  <li
                    className={`nav-item ${
                      location.pathname === "/admin-dashboard/all-notices"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link to="/admin-dashboard/all-notices">
                      <FileText className="mr-4 size-6" />
                      <p>All Department Notices</p>
                    </Link>
                  </li>

                  {/* All faculty - Visible to both admins and teachers */}
                  <li
                    className={`nav-item ${
                      location.pathname === "/admin-dashboard/all-faculty"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link to="/admin-dashboard/all-faculty">
                      <Users className="mr-4 size-6" />
                      <p>All Faculty</p>
                    </Link>
                  </li>
                </>
              )}

              {/* Add Faculty - Only visible to admins */}
              {auth.role === "admin" && (
                <>
                  <li
                    className={`nav-item ${
                      location.pathname === "/admin-dashboard/all-students"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link to="/admin-dashboard/all-students">
                      <Users className="mr-4 size-6" />
                      <p>All Students</p>
                    </Link>
                  </li>
                  <li
                    className={`nav-item ${
                      location.pathname === "/admin-dashboard/pending-users"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link to="/admin-dashboard/pending-users">
                      <Loader className="mr-4 size-6" />
                      <p>Pending Users</p>
                    </Link>
                  </li>

                  <li
                    className={`nav-item ${
                      location.pathname === "/admin-dashboard/rejected-user"
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link to="/admin-dashboard/rejected-user">
                      <Ban className="mr-4 size-6" />
                      <p>Rejected Users</p>
                    </Link>
                  </li>
                </>
              )}

              {/* All Students - Visible to both admins */}
              {/* {auth.role === "admin" && (
                
              )} */}

              {/* Update Profile - Visible to both admins and teachers */}
              <li
                className={`nav-item ${
                  location.pathname === "/admin-dashboard/update-profile"
                    ? "active"
                    : ""
                }`}
              >
                <Link to="/admin-dashboard/update-profile">
                  <CircleUserRound className="mr-4 size-6" />
                  <p>Update Profile</p>
                </Link>
              </li>

              {/* Logout - Visible to both admins and teachers */}
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

      <div className="main-panel bg-gray-100">
        <div className="main-header bg-dark-200">
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

          <nav className="navbar navbar-header navbar-expand-lg border-bottom ">
            <div className="container-fluid">
              <nav className="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex"></nav>

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
                    <div className="avatar-sm text-center">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile"
                          className="avatar-img rounded-circle"
                        />
                      ) : (
                        <FaUserCircle size={30} className="text-dark" />
                      )}
                    </div>
                    <span className="profile-username">
                      <span className=" text-dark fw-bold ">Hi,</span>
                      <span className="fw-bold text-dark">{auth.fullname}</span>
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
                              to="/admin-dashboard/profile"
                              className="btn btn-xs btn-secondary btn-sm"
                            >
                              View Profile
                            </Link>
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
                        </div>
                      </li>
                    </div>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="container ">
          <div className="page-inner p-0">
            <div className="page-category  p-0 m-0">
              <Routes>
                {/* Admin-specific routes */}
                {auth.role === "admin" && (
                  <Route path="notifications" element={<Notice />} />
                )}

                {/* Admin-specific routes */}
                {auth.role === "admin" && (
                  <Route path="pending-users" element={<AdminPendingUsers />} />
                )}

                {/* Admin-specific routes */}
                {auth.role === "admin" && (
                  <Route path="rejected-user" element={<GetRejectedUsers />} />
                )}

                <Route path="all-notices" element={<GetNoticeByDepartment />} />

                {/* Teacher-specific routes */}
                {auth.role === "teacher" && (
                  <Route
                    path="add-semester-notice"
                    element={<CreateSemesterNotice />}
                  />
                )}

                {auth.role === "principal" && (
                  <Route
                    path="add-principal-notice"
                    element={<CreatePrincipalNotice />}
                  />
                )}

                <Route
                  path="semester-notifications"
                  element={<GetSemesterNotices />}
                />
                <Route path="add-faculty" element={<AddFaculty />} />
                <Route
                  path="profile"
                  element={<Profile profilePhoto={profilePhoto} />}
                />
                <Route path="update-profile" element={<UpdateProfile />} />
                <Route path="edit-notice/:id" element={<EditNotice />} />
                <Route
                  path="edit-semester-notice/:id"
                  element={<EditSemesterNotice />}
                />
                <Route path="student-notice" element={<StudentNotice />} />
                <Route path="all-students" element={<AllStudents />} />
                <Route
                  path="all-student-notice"
                  element={<GetAllStudentsNotice />}
                />
                <Route
                  path="student-notice/:id"
                  element={<EditStudentNotice />}
                />

                {auth.role === "admin" && (
                  <Route
                    path="get-student/:id"
                    element={<UpdateStudentRecord />}
                  />
                )}

                <Route path="all-faculty" element={<AllFaculty />} />

                {/* Default redirects based on role */}
                {auth.role === "admin" && (
                  <Route
                    path="/"
                    element={<Navigate to="/admin-dashboard/notifications" />}
                  />
                )}

                {auth.role === "teacher" && (
                  <Route
                    path="/"
                    element={
                      <Navigate to="/admin-dashboard/add-semester-notice" />
                    }
                  />
                )}

                {auth.role === "principal" && (
                  <Route
                    path="/"
                    element={
                      <Navigate to="/admin-dashboard/add-principal-notice" />
                    }
                  />
                )}

                {auth.role === "principal" && (
                  <>
                    <Route
                      path="get-principal-notice"
                      element={<GetPrincipalNotices />}
                    />

                    <Route
                      path="get-principal-notice/:id"
                      element={<EditPrincipalNotice />}
                    />
                  </>
                )}

                {auth.role === "admin" && (
                  <Route
                    path="/"
                    element={<Navigate to="/admin-dashboard/notifications" />}
                  />
                )}
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

export default AdminDashboard;

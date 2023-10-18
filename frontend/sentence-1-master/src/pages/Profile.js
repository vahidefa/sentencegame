import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CustomAppbar } from "../components/AppBar";
import EditProfile from "../components/EditProfile";
import { toastFire } from "../components/SweetAlert";
import { useAuth } from "../context/AuthContext";
import { profile, upload } from "../api/user";
import { convertNumber } from "../utility";

const Profile = () => {
  const [show, setShow] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { user } = useAuth();

  const linkUserList = profileData.type === 2 ? "/main/user-list" : null;
  const handleClickUser = () => setShowMessage(true);

  const linkProfileEvalution =
    profileData.type === 2 ? "/main/evaluation-sentence" : null;
  const handleClickEvalution = () => setShowMessage(true);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setUploadedImage(file);
  };

  const handleImageUpload = async () => {
    try {
      if (uploadedImage) {
        const formData = new FormData();
        formData.append("file", uploadedImage);
        const response = await upload(formData);
        if (response.data.status !== 1) {
          return toastFire("error", "خطایی رخ داده است !");
        }
        toastFire("success", "عکس آپلود شد");
        getProfile();
      }
    } catch (error) {}
  };

  const getProfile = async () => {
    try {
      const response = await profile();
      if (response.data.status !== 1) {
        return toastFire("error", "خطایی رخ داده است !");
      }

      setProfileData(response.data.User);
    } catch (error) {}
  };

  useEffect(() => {
    handleImageUpload();
  }, [uploadedImage]);

  useEffect(() => {
    if (showMessage) {
      toastFire("error", "دسترسی به این بخش را ندارید!");
      setShowMessage(false);
      return;
    }
  }, [showMessage]);

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="background profile_page">
      <div className="">
        <CustomAppbar handleShow={handleShow} user={user} />
        <div className="d-flex justify-content-center align-items-center flex-column">
          <div className="personal-image">
            <label className="label">
              <input type="file" onChange={handleImageChange} />
              <figure className="personal-figure">
                <img
                  src={
                    profileData.profile
                      ? profileData.profile
                      : `${process.env.PUBLIC_URL}/image/person-circle.svg`
                  }
                  class="personal-avatar"
                  alt="avatar"
                />
                <figcaption class="personal-figcaption">
                  <img src="https://raw.githubusercontent.com/ThiagoLuizNunes/angular-boilerplate/master/src/assets/imgs/camera-white.png" />
                </figcaption>
              </figure>
            </label>
          </div>
          <h3 className="title" style={{ paddingRight: "1em" }}>
            {profileData.username}
          </h3>
          <div
            className="d-flex w-100 justify-content-around align-items-center  mt-3"
            style={{ paddingLeft: "2em" }}
          >
            <div className="user_info">
              <p>دفعات مشارکت</p>

              <p>
                {profileData.Participation
                  ? convertNumber(profileData.Participation)
                  : 0}
              </p>
            </div>
            <div className="user_info">
              <p> جملات تایید شده</p>
              <p>
                {profileData.AcceptedSentences
                  ? convertNumber(profileData.AcceptedSentences)
                  : 0}{" "}
              </p>
            </div>
            <div className="user_info">
              <p> امتیاز</p>
              <p>{profileData.Score ? convertNumber(profileData.Score) : 0}</p>
            </div>
          </div>
          <hr className="line" />
        </div>
        <div className="row p-3">
          <div className="col-6 d-flex justify-content-center align-items-center flex-column my-1">
            <i className="bi bi-person-circle  fs-3 item_icon"></i>
            <Link to={linkUserList} onClick={handleClickUser} className="link">
              <span>لیست کاربران</span>
            </Link>
          </div>

          <div className="col-6 d-flex justify-content-center align-items-center flex-column my-1">
            <i className="bi bi-list  fs-3 item_icon"></i>
            <Link
              to={{
                pathname: "/main/sentence-list",
                state: { data: profileData.type },
              }}
              className="link"
            >
              <span>لیست جملات</span>
            </Link>
          </div>
        </div>
        <div className="row px-3">
          <div className="col-6 d-flex justify-content-center align-items-center flex-column my-1">
            <i className="bi bi-star-fill item_icon fs-3"></i>
            <Link to={"/main/score-board"} className="link">
              <span> جدول امتیازات</span>
            </Link>
          </div>
          <div className="col-6 d-flex justify-content-center align-items-center flex-column my-1">
            <i className="bi bi-check-lg item_icon fs-3"></i>
            <Link to={"/main/final-sentence"} className="link">
              <span> لیست جملات تایید شده</span>
            </Link>
          </div>
        </div>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ marginTop: "6rem", marginBottom: "3em" }}
        >
          <Link
            to={"/main/game"}
            state={{ data: profileData }}
            className="button mx-3"
          >
            شروع بازی{" "}
          </Link>

          <Link
            to={linkProfileEvalution}
            onClick={handleClickEvalution}
            className="button mx-3"
          >
            شروع ارزیابی{" "}
          </Link>
        </div>
      </div>
      <EditProfile show={show} handleClose={handleClose} user={profileData} />
    </div>
  );
};

export default Profile;

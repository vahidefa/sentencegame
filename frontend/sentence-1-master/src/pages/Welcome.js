import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="background welcome_page">
      <div className="welcome_container">
        <img
          src={`${process.env.PUBLIC_URL}/image/welcom.png`}
          alt="My Image"
        />
        <Link className="btn btn-welcome" to={"/login"}>
          <span>ورود</span>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;

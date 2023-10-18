import { Link } from "react-router-dom";
const Home = ({ homeContainer }) => {
  return (
    <div className={`${homeContainer ? "home_container" : "icon_container"} `}>
      <Link to={"/main/profile"}>
        <i className="bi bi-house-fill home_icon"></i>
      </Link>
    </div>
  );
};

export default Home;

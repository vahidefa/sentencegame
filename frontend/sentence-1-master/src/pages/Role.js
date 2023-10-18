import { Link } from "react-router-dom";

const Roles = () => {
  return (
    <div className="background role_page">
      <div className="mt-0">
        <div className="d-flex justify-content-center img_container">
          {" "}
          <img
            src={`${process.env.PUBLIC_URL}/image/role.jpg`}
            alt="My Image"
          />
        </div>
        <div className="p-4">
          <p className="p-role">سلام به همگی ، به بازی جمله سازی خوش آمدید. </p>
          <p className="p-role">
            {" "}
            قوانین بازی : این بازی شامل دو نقش ، شرکت کننده و ارزیاب است.
          </p>
          <p className="p-role">
            روش بازی: شما در هر دور بازی ۱ دقیقه زمان دارید تا هر چه میتوانید با
            کلمات بهم ریخته جمله بسازید و امتیاز کسب کنید. حالا اگه امتیاز شما
            به میزان کافی زیاد شد و دقت توی ساخت جمله ها داشتید ، میتونید به
            عنوان ارزیاب وارد بشید و صحت جملات بقیه رو تایید یا رد کنید.{" "}
          </p>
        </div>
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Link className="btn btn-role" to={"/main/profile"}>
            <i className="bi bi-arrow-right fs-2 text-white"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Roles;

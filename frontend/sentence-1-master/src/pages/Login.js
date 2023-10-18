import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { toastFire } from "../components/SweetAlert";
const editUserSchema = Yup.object().shape({
  username: Yup.string().required("نام کاربری خود را وارد کنید"),
  password: Yup.string().required("پسورد خود را وارد کنید"),
});
const Login = () => {
  const history = useNavigate();
  const { loginUser } = useAuth();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: editUserSchema,
    onSubmit: async (values, actions) => {
      try {
        const response = await login(values);
        if (response.data.status !== 1) {
          return toastFire("error", "خطایی رخ داده است !");
        }
        const userData = {
          token: response.data.token,
        };
        loginUser(userData.token);
        history("/main");
        toastFire("success", "خوش آمدید!");
        actions.resetForm({
          values: {
            username: "",
            password: "",
          },
        });
      } catch (error) {}
    },
  });

  return (
    <section className="h-100 gradient-form">
      <div className=" py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div>
            <div className="card border-0  text-black">
              <div className="row">
                <div className="col-12">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img
                        src={`${process.env.PUBLIC_URL}/image/login.png`}
                        style={{ width: "180px" }}
                      />
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                      <p>لطفا با حساب کاربری خود وارد شوید</p>

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          placeholder="نام کاربری"
                          onChange={formik.handleChange}
                          value={formik.values.username}
                        />
                        {formik.touched.username && formik.errors.username && (
                          <div className="fv-help-block my-2 text-danger">
                            <span role="alert">{formik.errors.username}</span>
                          </div>
                        )}
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="رمز عبور"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                        />
                        {formik.touched.password && formik.errors.password && (
                          <div className="fv-help-block  my-2 text-danger">
                            <span role="alert">{formik.errors.password}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <button
                          className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3 w-100 m-0 login-btn"
                          type="submit"
                        >
                          ورود
                        </button>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <Link
                          className="btn btn-register mb-0"
                          to={"/register"}
                        >
                          ثبت نام
                        </Link>
                        <p className="mb-0 me-2">ساخت حساب کاربری جدید</p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;

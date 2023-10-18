import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { register } from "../api/auth";
import { toastFire } from "../components/SweetAlert";

const editUserSchema = Yup.object().shape({
  userName: Yup.string().required("نام کاربری خود را وارد کنید"),
  phone: Yup.string()
    .matches(/^\d{11}$/, "شماره تلفن را درست وارد کنید")
    .required("شماره تلفن خود را وارد کنید "),
  password: Yup.string().required("رمز عبور خود را وارد کنید"),
  repeatPassword: Yup.string()
    .required('تکرار رمز را وارد کنید"')
    .test(
      "password-match",
      "تکرار رمز عبور باید هماهنگ باشد",
      function (value) {
        return this.parent.password === value;
      }
    ),
});

const Register = () => {
  const history = useNavigate();
  const formik = useFormik({
    initialValues: {
      userName: "",
      phone: "",
      password: "",
      repeatPassword: "",
    },
    validationSchema: editUserSchema,
    onSubmit: async (values, actions) => {
      try {
        const registerValue = {
          username: values.userName,
          password: values.password,
          phone: values.phone,
        };
        const response = await register(registerValue);
        if (response.data.status !== 1) {
          return toastFire("error", "خطایی رخ داده است !");
        }

        history("/login");
        actions.resetForm({
          values: {
            userName: "",
            phone: "",
            password: "",
            RepeatPassword: "",
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
            <div className="card border-0 text-black">
              <div className="row">
                <div className="col-12">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img
                        src={`${process.env.PUBLIC_URL}/image/singup.png`}
                        style={{ width: "180px" }}
                      />
                    </div>

                    <form onSubmit={formik.handleSubmit}>
                      <p> لطفا اطلاعات خود را جهت ثبت نام وارد کنید: </p>

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          name="userName"
                          className="form-control"
                          placeholder="نام کاربری"
                          onChange={formik.handleChange}
                          value={formik.values.userName}
                        />
                        {formik.touched.userName && formik.errors.userName && (
                          <div className="fv-help-block  my-2 text-danger">
                            <span role="alert">{formik.errors.userName}</span>
                          </div>
                        )}
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          placeholder="شماره تلفن همراه"
                          onChange={formik.handleChange}
                          value={formik.values.phone}
                        />
                        {formik.touched.phone && formik.errors.phone && (
                          <div className="fv-help-block  my-2 text-danger">
                            <span role="alert">{formik.errors.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
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
                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          name="repeatPassword"
                          className="form-control"
                          placeholder="تکرار رمز عبور"
                          onChange={formik.handleChange}
                          value={formik.values.repeatPassword}
                        />
                        {formik.touched.repeatPassword &&
                          formik.errors.repeatPassword && (
                            <div className="fv-help-block  my-2 text-danger">
                              <span role="alert">
                                {formik.errors.repeatPassword}
                              </span>
                            </div>
                          )}
                      </div>

                      <div>
                        <button
                          className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3 w-100 m-0 login-btn"
                          type="submit"
                        >
                          ثبت نام
                        </button>
                      </div>

                      <div className="d-flex align-items-center justify-content-center pb-4">
                        <p className="mb-0 me-2">ورود به حساب کاربری</p>
                        <Link className="btn btn-register  mb-0" to={"/login"}>
                          ورود
                        </Link>
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

export default Register;

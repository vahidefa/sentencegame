import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
import { ErrorMessage, Formik, Field, Form } from "formik";
import { updateUser } from "../api/user";
import { toastFire } from "./SweetAlert";

const editUserSchema = Yup.object().shape({
  phone: Yup.string().matches(/^\d{11}$/, "شماره تلفن را درست وارد کنید"),
  password: Yup.string().min(6, "رمز عبور باید حداقل 6 کاراکتر داشته باشد"),
  repeatPassword: Yup.string().test(
    "password-match",
    "تکرار رمز عبور باید هماهنگ باشد",
    function (value) {
      return this.parent.password === value;
    }
  ),
});
const EditProfile = ({ show, handleClose, user }) => {
  const initialValues = {
    phone: user?.phone,
    password: "",
    repeatPassword: "",
  };

  const onSubmit = async (values, actions) => {
    try {
      const updateValue = {
        phone: values.phone,
        password: values.password,
      };
      const response = await updateUser(updateValue);
      if (response.data.status !== 1) {
        return toastFire("error", "خطایی رخ داده است !");
      }
      toastFire("success", "پروفایل ویرایش شد !");
      actions.resetForm({
        values: {
          phone: "",
          password: "",
          RepeatPassword: "",
        },
      });
      handleClose();
    } catch (error) {}
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>ویرایش پروفایل</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {" "}
        <Formik
          validationSchema={editUserSchema}
          initialValues={initialValues}
          onSubmit={onSubmit}
        >
          {({ resetForm }) => (
            <Form noValidate>
              <div className="form-outline mb-4">
                <Field
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="شماره تلفن همراه"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="fv-help-block my-2 text-danger"
                />
              </div>
              <div className="form-outline mb-4">
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="رمز عبور"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="fv-help-block my-2 text-danger"
                />
              </div>
              <div className="form-outline mb-4">
                <Field
                  type="password"
                  name="repeatPassword"
                  className="form-control"
                  placeholder="تکرار رمز عبور"
                />
                <ErrorMessage
                  name="repeatPassword"
                  component="div"
                  className="fv-help-block my-2 text-danger"
                />
              </div>

              <div className="d-flex justify-content-center align-items-center">
                <button
                  className="btn btn-secondary btn-block gradient-custom-2 mb-3 p-2 w-25 text-white mx-3 m-0 "
                  type="button"
                  onClick={() => {
                    resetForm();
                    handleClose();
                  }}
                >
                  لغو
                </button>
                <button
                  className="btn btn-primary btn-block gradient-custom-2 mb-3 mx-3 m-0 w-25 p-2"
                  type="submit"
                >
                  ویرایش
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfile;

import React, { useEffect, useState } from "react";
import Home from "../components/Home";
import CustomPagination from "../components/Pagination";
import { toastFire } from "../components/SweetAlert";
import { getUsers } from "../api/user";
import { convertNumber } from "../utility";
const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getUserList = async () => {
    try {
      const data = {
        from: (currentPage - 1) * 5,
        to: 5,
      };
      const response = await getUsers(data);
      if (response.data.status !== 1) {
        return toastFire("error", "خطایی رخ داده است !");
      }
      const responseData = response.data;
      const users = responseData?.Users?.map(({ ...sentence }, index) => ({
        ...sentence,
        id: convertNumber(index + 1),
      }));
      setUserList(users);
      setTotalPage(responseData?.Count);
    } catch (error) {}
  };

  useEffect(() => {
    getUserList();
  }, [currentPage]);

  const headers = ["", "کاربران", "مشارکت در بازی", "مشارکت در ارزیابی"];

  return (
    <div className="background userList_page">
      {userList.length ? (
        <div>
          <h2 className="title">لیست کاربران</h2>
          <div className="p-4 mt-5">
            <table className="table responsive">
              <thead>
                <tr style={{ backgroundColor: "transparent", color: "#ffff" }}>
                  {headers.map((header, index) => (
                    <th key={index} className="text-center">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {userList.map((user, index) => (
                  <>
                    <tr key={index} style={{ background: "#ffff" }}>
                      <td>{user.id}</td>
                      <td className="text-center">{user.username}</td>
                      <td className="text-center">{user.score}</td>
                      <td className="text-center">{user.assessor_score}</td>
                    </tr>
                    <tr className="spacer"></tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <CustomPagination
              totalPages={totalPage}
              currentPag={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <div className="show_message">
          <p>داده ایی موجود نیست !</p>
        </div>
      )}

      <Home homeContainer />
    </div>
  );
};

export default UserList;

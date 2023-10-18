import React, { useEffect, useState } from "react";
import Home from "../components/Home";
import CustomPagination from "../components/Pagination";
import { toastFire } from "../components/SweetAlert";
import { getScore } from "../api/game";
import { convertNumber } from "../utility";
const Scoreboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [scoreList, setScoreList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  const headers = ["", "نام کاربر", " امتیاز بازی", "مشارکت در ارزیابی"];
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getSentenceList = async () => {
    try {
      const data = {
        from: (currentPage - 1) * 5,
        to: 5,
      };
      const response = await getScore(data);
      if (response.data.status !== 1) {
        return toastFire("error", "خطایی رخ داده است !");
      }
      const responseData = response.data;
      const users = responseData?.Users?.map(({ ...sentence }, index) => ({
        ...sentence,
        id: convertNumber(index + 1),
      }));
      setScoreList(users);
      setTotalPage(responseData?.Count);
    } catch (error) {}
  };

  useEffect(() => {
    getSentenceList();
  }, [currentPage]);
  return (
    <div className="background scoreboard_page">
      <h2 className="title my-5"> جدول امتیازات</h2>
      {scoreList.length ? (
        <div>
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
                {scoreList.map((score, index) => (
                  <>
                    <tr key={index} style={{ background: "#ffff" }}>
                      <td>{score.id}</td>
                      <td className="text-center">{score.username}</td>
                      <td className="text-center">{score.score}</td>
                      <td className="text-center">{score.assessor_score}</td>
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

export default Scoreboard;

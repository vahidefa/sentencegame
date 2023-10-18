import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toastFire } from "../components/SweetAlert";
import { sentence, sentenceAssessor } from "../api/sentence";
const EvaluationSentence = () => {
  const stars = [1, 2, 3, 4, 5];
  const [sentenceList, setSentenceList] = useState([]);
  const [count, setCount] = useState();

  const setScore = async () => {
    try {
      const scoreList = sentenceList.map((sentence) => ({
        id: sentence.id,
        score: sentence.score,
      }));

      const response = await sentence(scoreList);
      if (response.data.status !== 1) {
        return toastFire("error", "خطایی رخ داده است !");
      }
      if (count !== 0) {
        getSentence();
      }
      toastFire("success", "ثبت شد");
    } catch (error) {}
  };
  const getSentence = async () => {
    try {
      const response = await sentenceAssessor();
      if (response.data.status !== 1) {
        return toastFire("error", "خطایی رخ داده است !");
      }
      const responseData = response?.data;
      const sentences = responseData?.Sentences.map((sententce) => ({
        ...sententce,
        score: 0,
      }));
      setSentenceList(sentences);
      setCount(response?.data?.Count);
    } catch (error) {}
  };

  const handleRatingChange = (newRating, id) => {
    const updatedSentences = sentenceList.map((sentence) => {
      if (sentence.id === id) {
        return { ...sentence, score: newRating };
      }
      return sentence;
    });
    setSentenceList(updatedSentences);
  };

  useEffect(() => {
    getSentence();
  }, []);
  return (
    <div className="background background_page">
      <h2 className="title">ارزیابی جملات</h2>
      {sentenceList.length ? (
        <div className="p-4 mt-4">
          <div className="row">
            <div className=" p-2">
              <div className="d-flex justify-content-between align-items-center">
                {" "}
                <div style={{ width: "60%" }}>
                  <h4 className="text-white px-3">جملات</h4>
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ width: "35%" }}
                >
                  {" "}
                  <h4 className="text-white pr-3">امتیاز</h4>
                </div>
              </div>

              <ul class="list-group p-2">
                {sentenceList?.map((sentence) => {
                  return (
                    <div
                      className="d-flex flex-row justify-content-evenly align-items-center"
                      key={sentence.id}
                    >
                      <li class="list-group-item my-1 w-100 h-25">
                        {sentence.content}
                      </li>
                      <div className="d-flex justify-content-center align-items-center p-3">
                        {stars.map((star) => (
                          <span
                            key={star}
                            className={`fs-4 bi bi-star${
                              star <= (sentence?.score || 0)
                                ? "-fill text-white"
                                : ""
                            }`}
                            onClick={() =>
                              handleRatingChange(star, sentence?.id)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="show_message">
          <p>جمله ایی در دسترس نیست ...</p>
        </div>
      )}

      <div
        style={{ position: "absolute", top: "90%", left: "22%" }}
        className="d-flex"
      >
        <Link
          className="btn mx-2"
          to={"/main/profile"}
          style={{
            backgroundColor: "#2664b9",
            color: "#fff",
            minWidth: "100px",
          }}
        >
          بازگشت
        </Link>
        <button
          className="btn mx-2"
          style={{
            backgroundColor: "#795fcc",
            color: "#fff",
            minWidth: "100px",
          }}
          onClick={setScore}
        >
          تایید
        </button>
      </div>
    </div>
  );
};

export default EvaluationSentence;

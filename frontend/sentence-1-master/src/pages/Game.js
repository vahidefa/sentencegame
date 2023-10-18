import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { game } from "../api/game";
import { toastFire } from "../components/SweetAlert";
import { ListGroupItem } from "react-bootstrap";

const Game = (props) => {
  const location = useLocation();
  const data = location.state?.data;
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [currentSentence, setCurrentSentence] = useState("");
  const [finished, setFinished] = useState(false);
  const [list, setList] = useState(data.words);
  const [selectedItems, setSelectedItems] = useState([]);
  const [listofSentence, setListofSentence] = useState([]);
  const history = useNavigate();

  const sendSentence = async () => {
    try {
      const response = await game(listofSentence); // Assuming the function game() exists
      if (response.data.status !== 1) {
        return toastFire("error", "خطایی رخ داده است !");
      }
      setListofSentence([]);
    } catch (error) {}
  };

  const createListWord = () => {
    const randomCount = Math.floor(Math.random() * 7) + 3; // Random count between 3 and 9
    const randomItems = [];

    while (randomItems.length < randomCount) {
      const randomIndex = Math.floor(Math.random() * list.length);
      const selectedItem = list[randomIndex];
      const findItem = randomItems.find((item) => item === selectedItem);
      if (!findItem) {
        randomItems.push(selectedItem);
      }
    }

    // const newList = list.filter((item) => !randomItems.includes(item));
    // setList(newList);
    setCurrentSentence("");
    return randomItems;
  };

  const handleClick = () => {
    listofSentence.push(currentSentence);
    const words = createListWord();
    setSelectedItems(words);
  };

  useEffect(() => {
    const wordList = createListWord();
    setSelectedItems(wordList);
  }, []);

  useEffect(() => {
    let timer;

    if (minutes <= 0 && seconds <= 0) {
      setFinished(true);
      return () => {
        clearInterval(timer);
      };
    }

    timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if (minutes === 0) {
          clearInterval(timer);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [minutes, seconds]);

  useEffect(() => {
    if (finished === true) {
      sendSentence();
      Swal.fire({
        title: `اتمام بازی
         تعداد جملات ساخته شده :${listofSentence.length}
         امتیاز کاربر : ${listofSentence.length}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "بازگشت",
      }).then((result) => {
        if (result.isConfirmed) {
          history("/main/profile");
        }
      });
    }
  }, [finished]);

  const backHome = () => {
    Swal.fire({
      title: "قصد خروج از بازی را دارید ؟",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "بله",
      cancelButtonText: "خیر",
    }).then((result) => {
      if (result.isConfirmed) {
        history("/main/profile");
      }
    });
  };

  return (
    <div className="background game_page">
      <div>
        <div className="d-flex align-items-center mx-3 my-4 justify-content-between ">
          <div className="icon_container">
            <button onClick={backHome} className="border-0 bg-transparent">
              <i className="bi bi-house-fill home_icon"></i>
            </button>
          </div>
          <div className="d-flex w-100 align-items-center justify-content-evenly">
            <div className="d-flex justify-content-center align-items-center">
              <div className="counter_container">
                <span>
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>
              <div className="icon_container counter_icon">
                <i className="bi bi-clock-history style_icon"></i>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <div className="counter_container">
                <span>{data.Score}</span>
              </div>

              <div
                className="icon_container counter_icon"
                style={{ right: "74%" }}
              >
                <i className="bi bi-gem style_icon"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <p className="text-white fs-3 p-2 ">مثال ......</p>
          <div className="row">
            {selectedItems.map((word) => {
              return (
                <div className="col-4">
                  <span className="btn btn-3 hover-border-3 btn-word ">
                    <span className="word-span">{word} </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-white px-3">جمله را بساز:</p>
        <div className="p-3 mr-3 d-flex justify-content-center align-items-center">
          <input
            placeholder="..."
            value={currentSentence}
            onChange={(e) => setCurrentSentence(e.target.value)}
            className="input_game w-75 p-3 "
          />
          <button
            onClick={handleClick}
            disabled={finished}
            style={{ backgroundColor: "none", border: "none" }}
            className="button_game"
          >
            <i className="bi bi-arrow-left fs-2 d-flex justify-content-center align-items-center"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;

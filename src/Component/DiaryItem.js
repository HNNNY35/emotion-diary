import React from "react";
import { useNavigate } from "react-router-dom";
import MyButton from "./MyButton";

const DiaryItem = ({ id, emotion, content, date }) => {
  // 전달받은 date prop을 기준으로 시간 객체 생성
  // date가 문자열로 들어올 수 있으니 parseInt
  // toLocaleDateString 메소드로 우리가 알아볼 수 있는 시간으로 변환
  const strDate = new Date(parseInt(date)).toLocaleDateString();

  const navigate = useNavigate();

  // 일기 상세보기로 이동하는 함수(일기 id를 받음)
  const goDetail = () => {
    navigate(`/diary/${id}`);
  };

  // 일기 수정하기로 이동하는 함수
  const goEdit = () => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="DiaryItem">
      <div
        onClick={goDetail}
        className={[
          "emotion_img_wrapper",
          `emotion_img_wrapper_${emotion}`,
        ].join(" ")}
      >
        <img src={process.env.PUBLIC_URL + `assets/emotion${emotion}.png`} />
      </div>

      <div onClick={goDetail} className="info_wrapper">
        <div className="diary_date">{strDate}</div>
        <div className="diary_content_preview">{content.slice(0, 25)}</div>
      </div>

      <div className="btn_wrapper">
        <MyButton onClick={goEdit} text={"수정하기"} />
      </div>
    </div>
  );
};

export default React.memo(DiaryItem);

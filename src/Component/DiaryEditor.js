import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import MyButton from "./MyButton";
import MyHeader from "./MyHeader";
import EmotionItem from "./EmotionItem";
import { DiaryDispatchContext } from "../App";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

const DiaryEditor = ({ isEdit, originData }) => {
  const [content, setContent] = useState("");
  const contentRef = useRef();

  const [emotion, setEmotion] = useState(3);

  // input에 입력되는 날짜 state로 받기 + 오늘 날짜로 초기화
  const [date, setDate] = useState(getStringDate(new Date()));
  const navigate = useNavigate();

  // emotion을 선택하면 state 바꾸는 함수
  const handleClickEmote = useCallback((emotion) => {
    setEmotion(emotion);
  }, []);

  // App.js로부터 DiaryDispatchContext 받음
  const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);
  // 작성완료 기능
  const handleSubmit = () => {
    if (content.length < 1) {
      // 내용이 1자를 넘지 않으면  focus
      contentRef.current.focus();
      return;
    }

    if (
      window.confirm(
        isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?"
      )
    ) {
      if (!isEdit) {
        // onCreate함수
        onCreate(date, content, emotion);
      } else {
        onEdit(originData.id, date, content, emotion);
      }
    }

    // 작성 완료시 홈으로 이동, 옵션 : 일기 작성하는 페이지를 뒤로가기로 못 오게
    navigate("/", { replace: true });
  };

  // remove 이벤트
  const handleRemove = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onRemove(originData.id);
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    // edit 페이지에서 렌더하는 DiaryEditor 에서만 동작하는 로직
    if (isEdit) {
      // originData 내용 렌더
      setDate(getStringDate(new Date(parseInt(originData.date))));
      setEmotion(originData.emotion);
      setContent(originData.content);
    }
  }, [isEdit, originData]);

  return (
    <div className="DiaryEditor">
      <MyHeader
        headText={isEdit ? "일기 수정하기" : "새 일기쓰기"}
        leftChild={
          <MyButton onClick={() => navigate(-1)} text={"< 뒤로가기"} />
        }
        rightChild={
          isEdit && (
            <MyButton
              text={"삭제하기"}
              type={"negative"}
              onClick={handleRemove}
            />
          )
        }
      />
      <div>
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input_box">
            <input
              className="input_date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
            />
          </div>
        </section>
        <section>
          <h4>오늘의 감정</h4>
          <div className="input_box emotion_list_wrapper">
            {emotionList.map((it) => (
              <EmotionItem
                key={it.emotion_id}
                {...it}
                onClick={handleClickEmote}
                isSelected={it.emotion_id === emotion}
              />
            ))}
          </div>
        </section>
        <section>
          <h4>오늘의 일기</h4>
          <div className="input_box text_wrapper">
            <textarea
              placeholder="오늘은 어땠나요?"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>
        <section>
          <div className="control_box">
            <MyButton text={"취소하기"} onClick={() => navigate(-1)} />
            <MyButton
              text={"작성완료"}
              type={"positive"}
              onClick={handleSubmit}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiaryEditor;

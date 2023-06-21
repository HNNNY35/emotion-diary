import React, { useEffect, useReducer, useRef } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Diary from "./pages/Diary";

const reducer = (state, action) => {
  let newState = [];

  // action.type에 따라 분기하는 switch문
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      newState = [action.data, ...state];
      // case에서 리턴하지 않으면 default까지 수행하기 때문에 break
      break;
    }
    case "REMOVE": {
      newState = state.filter((it) => it.id !== action.targetId);
      break;
    }
    case "EDIT": {
      newState = state.map((it) =>
        // 수정 시 내용만이 아니라 전체를 다 수정할 것이기 때문에 content가 아니라 data
        it.id === action.data.id ? { ...action.data } : it
      );
      break;
    }
    default:
      return state;
  }
  localStorage.setItem("diary", JSON.stringify(newState));
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  // 일기 데이터 state
  const [data, dispatch] = useReducer(reducer, []);

  // 로컬스토리지의 데이터 가져오기
  useEffect(() => {
    const localData = localStorage.getItem("diary");

    // localData가 있을 때만 로직 수행하기
    if (localData) {
      // JSON.parse로 배열화 및 id 기준 내림차순 정렬 수행
      const diaryList = JSON.parse(localData).sort(
        (a, b) => parseInt(b.id) - parseInt(a.id)
      );

      // dataId가 0이 초기값이므로 중복을 방지하기 위해 localData의 가장 큰 값 +1로 맞춰주기
      dataId.current = parseInt(diaryList[0].id) + 1;

      // 초기값으로 설정하기
      dispatch({ type: "INIT", data: diaryList });
    }
  }, []);

  // useRef 데이터의 id로 사용
  const dataId = useRef(0);

  // CREATE
  // 일기 작성 폼에서 date까지 받을 예정
  const onCreate = (date, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: {
        id: dataId.current,
        // 파라미터로 받은 날짜인 date 시간 객체로 만들어서 getTime으로 ms로 바꿈
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
    // id 1씩 증가
    dataId.current += 1;
  };

  // REMOVE
  // 지울 일기의 id를 받아옴
  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId });
  };

  // EDIT
  // 수정할 일기의 id, date, content, emotiotn 받아옴
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotion,
      },
    });
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onRemove, onEdit }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/diary/:id" element={<Diary />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;

import { useState } from "react";

const sortOptionList = [
  { value: "latest", name: "최신순" },
  { value: "oldest", name: "오래된순" },
];

const filterOptionList = [
  { value: "all", name: "전부다" },
  { value: "good", name: "좋은 감정만" },
  { value: "bad", name: "안좋은 감정만" },
];

// value : select에서 어떤 값을 선택했는지
// onChange : select가 선택하는게 변화했을때 바꿀 함수
// optionList : 셀렉트 안에 들어갈 옵션
const ControlMenu = ({ value, onChange, optionList }) => {
  return (
    // onChange이벤트가 일어나면 e객체의 target.value를 전달해서 prop으로 받은 onChange메소드 실행
    // prop으로 받은 onChange 메소드는 setSortType
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {optionList.map((it, idx) => (
        <option value={it.value} key={idx}>
          {it.name}
        </option>
      ))}
    </select>
  );
};

const DiaryList = ({ diaryList }) => {
  // 정렬 기준을 저장할 state
  const [sortType, setSortType] = useState("latest");
  const [filter, setFilter] = useState("all");

  // 최신순/오래된순 필터 선택에 따라 데이터 정렬
  const getProcessedDiaryList = () => {
    // 필터링 함수
    const filterCallback = (item) => {
      if (filter === "good") {
        return parseInt(item.emotion) <= 3;
      } else {
        return parseInt(item.emotion) > 3;
      }
    };

    // 비교함수
    const compare = (a, b) => {
      if (sortType === "latest") {
        // 문자열로 들어올 수 있기 때문에 parseInt
        return parseInt(b.date) - parseInt(a.date);
      } else {
        return parseInt(a.date) - parseInt(b.date);
      }
    };

    // 배열 깊은 복사하기
    // JSON.stringify : 전달된 배열을 json화 시켜서 문자열로 바꿈
    // JSON.parse : 다시 배열로 복호화
    const copyList = JSON.parse(JSON.stringify(diaryList));

    // copyList를 filster state의 값에 따라 filter
    const filterdList =
      filter === "all" ? copyList : copyList.filter((it) => filterCallback(it));

    const sortedList = filterdList.sort(compare);

    return sortedList;
  };

  return (
    <div>
      <ControlMenu
        value={sortType}
        onChange={setSortType}
        optionList={sortOptionList}
      />
      <ControlMenu
        value={filter}
        onChange={setFilter}
        optionList={filterOptionList}
      />
      {getProcessedDiaryList().map((it) => (
        <div key={it.id}>
          {it.content} {it.emotion}
        </div>
      ))}
    </div>
  );
};

DiaryList.defaultProps = {
  diaryList: [],
};
export default DiaryList;

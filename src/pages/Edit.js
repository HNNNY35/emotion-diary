import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";
import DiaryEditor from "../Component/DiaryEditor";

const Edit = () => {
  const navigate = useNavigate();

  // param으로 받은 id
  const { id } = useParams();

  // targetDiary 데이터 저장할 state
  const [originData, setOriginData] = useState();

  // app에서 원본 데이터 리스트 받아오기
  const diaryList = useContext(DiaryStateContext);

  // edit 컴포넌트 마운트 시 diaryList에서 id가 일치하는 일기 가져오기
  // + id나 diaryList가 변할때도 리렌더
  useEffect(() => {
    // 일기데이터가 하나라도 있어야 edit 가능
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.id) === parseInt(id)
      );
      console.log(targetDiary);

      // 없는 id로는 edit이 불가능하도록 막기
      if (targetDiary) {
        // 객체의 값이 들어오면 truthy
        setOriginData(targetDiary);
      } else {
        // undefined이면 falsy로 else로 옴
        // 홈으로 보내고 뒤로가기로 못오게 만들기
        alert("없는 일기입니다.");
        navigate("/", { replace: true });
      }
    }
  }, [id, diaryList]);

  return (
    <div>
      {originData && <DiaryEditor isEdit={true} originData={originData} />}
    </div>
  );
};
export default Edit;

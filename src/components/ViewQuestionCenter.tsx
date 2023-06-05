import { useState } from 'react';
import './ViewQuestionCenter.css';

function ViewQuestionCenter({text,next,additional}) {
  const [reveal,setReveal] = useState(false)
  const handleClick = (e) => {
    // console.log(e)
    console.log(additional)
    if (reveal) {
      next()
      setReveal(false)
    } else {
      setReveal(true)
    }
  }
  return (
    <div className="container" onDoubleClick={handleClick}>
      {
        reveal ?
        <>
          <h1>{text}</h1>
          {
            additional !== "" ? <>{additional}</>:<>快速點兩下隱藏題目，並傳給下一位玩家</>
          }
        </>
        :<>快速點兩下來看題目</>
      }
    </div>
  );
}

export default ViewQuestionCenter;

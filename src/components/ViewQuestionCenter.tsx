import { useEffect, useState } from 'react';
import './ViewQuestionCenter.css';
import { useLocation } from 'react-router';
import { IonRippleEffect } from '@ionic/react';

function ViewQuestionCenter({text,next,additional}) {
  const [reveal,setReveal] = useState(false)
  const location = useLocation();
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
  useEffect(() => {
    setReveal(false)
  },[location])
  return (
    <div className="qcontainer ion-activatable ripple-parent" onDoubleClick={handleClick}>
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
      <IonRippleEffect className='customripple'></IonRippleEffect>
    </div>
  );
}

export default ViewQuestionCenter;

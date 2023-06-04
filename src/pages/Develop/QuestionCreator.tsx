import { useEffect, useState } from "react";
import question from "../../question/question";
import GeneralPage from "../Layout/GeneralPage";
import { IonButton } from "@ionic/react";

export default function QuestionCreator() {
  const allQuestion = question()
  const [questions,setQuestions] = useState(allQuestion)
  useEffect(() => {
    window.onbeforeunload = function() {
      return "Dude, are you sure you want to leave? Think of the kittens!";
    }
  },[])
  const changeList = (type,index,value) => {
    if (type === "id"){
      setQuestions((oldarr) => {
        let newarr = [...oldarr]
        newarr[index][type] = value
        return newarr
      })
    } else {
      let numtype = parseInt(type)
      setQuestions((oldarr) => {
        let newarr = [...oldarr]
        newarr[index]["word"][numtype] = value
        return newarr
      })
    }
  }
  const changeAdditional = (type,index,value) => {
    let numtype = parseInt(type)
    setQuestions((oldarr) => {
      let newarr = [...oldarr]
      console.log(newarr[index]["additional"])
      if (newarr[index]["additional"] === undefined){
        newarr[index]["additional"] = ["",""]
      }
      newarr[index]["additional"][numtype] = value
      return newarr
    })
  }
  const addQuestion = () => {
    setQuestions((oldarr) => {
      let newarr = [...oldarr]
      newarr.push({
        id: (newarr.length+1).toString(),
        word: ["字詞","字詞"]
      })
      return newarr
    })
  }
  const exportQuestion = () => {
    console.log(JSON.stringify(questions))
  }
  return (
    <GeneralPage title="編輯題目">
      <div style={{position: "sticky", top: "0px"}}>
        <IonButton onClick={() => {
          addQuestion()
        }}>
          新增題目
        </IonButton>
        <IonButton onClick={() => {
          exportQuestion()
        }}>
          匯出題目
        </IonButton>
      </div>
      {(() => {
        let rows = []
        questions.forEach((e,i) => {
          let additional = ["",""]
          if (e.additional) {
            additional = e.additional
          }
          rows.push(
            <div key={"edit_"+i} style={{display: "flex",flexDirection:"column"}}>
              <input type="text" onChange={(e:any) => {
                changeList("id",i,e.target.value)
              }} value={e.id} />
              <div style={{display:"flex"}}>
                <input type="text" onChange={(e:any) => {
                  // console.log(e.target.value)
                  changeList("0",i,e.target.value)
                }} contentEditable={true} style={{flex: 1}} value={e.word[0]}/>
                <input type="text" onChange={(e:any) => {
                  changeList("1",i,e.target.value)
                }} contentEditable={true} style={{flex: 1}} value={e.word[1]}/>
              </div>
              <div style={{display:"flex"}}>
                <input type="text" onChange={(e:any) => {
                  // console.log(e.target.value)
                  changeAdditional("0",i,e.target.value)
                }} contentEditable={true} style={{flex: 1}} value={additional[0]}/>
                <input type="text" onChange={(e:any) => {
                  changeAdditional("1",i,e.target.value)
                }} contentEditable={true} style={{flex: 1}} value={additional[1]}/>
              </div>
              <hr style={{background: "black"}}/>
            </div>
          )
        })
        return rows
      })()}
      <div style={{height:"200px"}}></div>
    </GeneralPage>
  )
}

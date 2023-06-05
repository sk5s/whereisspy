import { useEffect, useState } from "react";
import question from "../../question/question";
import GeneralPage from "../Layout/GeneralPage";
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import "./QuestionCreator.css"

export default function QuestionCreator({mode}:{
  mode?: string;
}) {
  const [questions,setQuestions] = useState<any>([
    {
      id: new Date().getTime().toString(),
      word: ["字詞","字詞"]
    }
  ])
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [exported, setExported] = useState("")
  const [importText, setImportText] = useState("")
  useEffect(() => {
    window.onbeforeunload = function() {
      return "Dude, are you sure you want to leave? Think of the kittens!";
    }
    if (mode === "dev") {
      const allQuestion = question()
      setQuestions(allQuestion)
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
      if (newarr[index]["additional"] === undefined){
        newarr[index]["additional"] = ["",""]
      }
      newarr[index]["additional"][numtype] = value
      return newarr
    })
  }
  const addQuestion = () => {
    if (questions.length >= 100) return
    setQuestions((oldarr) => {
      let newarr = [...oldarr]
      newarr.push({
        id: (parseInt(newarr[newarr.length-1].id)+1).toString(),
        word: ["字詞","字詞"]
      })
      return newarr
    })
  }
  const exportQuestion = () => {
    let content = JSON.stringify(questions)
    console.log(content)
    setIsOpen(true)
    setExported(content)
    if (mode === "dev") {
      navigator.clipboard.writeText(content);
      alert("已經複製到剪貼簿了")
    }
  }
  const handleRemove = (index) => {
    if (questions.length === 1) return
    let answer = confirm("確定移除")
    if (!answer) return
    setQuestions((oldarr) => {
      let newarr = [...oldarr]
      newarr.splice(index,1)
      return newarr
    })
  }
  return (
    <GeneralPage title="編輯題目">
      題目必須使用繁體中文，且不得違反善良風俗。
      <IonButton onClick={() => {
        setIsOpen2(true)
      }}>
        匯入並覆蓋現有題目
      </IonButton>
      {(() => {
        let rows = []
        questions.forEach((e,i) => {
          let additional = ["",""]
          if (e.additional) {
            additional = e.additional
          }
          rows.push(
            <div key={"edit_"+i} style={{display: "flex",flexDirection:"column",border:"1px solid #000", padding:"5px"}}>
              <button type="button" onClick={() => handleRemove(i)}>移除</button>
              <input type="text" disabled={mode !== "dev"} onChange={(e:any) => {
                changeList("id",i,e.target.value)
              }} value={e.id} />
              <div style={{display:"flex",flexWrap:"wrap"}}>
                <div style={{flex: 1,display:"flex",flexDirection:"column"}}>
                  字詞1
                  <input type="text" onChange={(e:any) => {
                    // console.log(e.target.value)
                    changeList("0",i,e.target.value)
                  }} contentEditable={true} style={{flex: 1}} value={e.word[0]}/>
                </div>
                <div style={{flex: 1,display:"flex",flexDirection:"column"}}>
                  字詞2
                  <input type="text" onChange={(e:any) => {
                    changeList("1",i,e.target.value)
                  }} contentEditable={true} style={{flex: 1}} value={e.word[1]}/>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap"}}>
                <div style={{flex: 1,display:"flex",flexDirection:"column"}}>
                  字詞1說明
                  <input type="text" onChange={(e:any) => {
                  changeAdditional("0",i,e.target.value)
                }} contentEditable={true} style={{flex: 1}} value={additional[0]}/>
                </div>
                <div style={{flex: 1,display:"flex",flexDirection:"column"}}>
                  字詞2說明
                  <input type="text" onChange={(e:any) => {
                    changeAdditional("1",i,e.target.value)
                  }} contentEditable={true} style={{flex: 1}} value={additional[1]}/>
                </div>
              </div>
            </div>
          )
        })
        return rows
      })()}
      <div style={{height:"200px"}}></div>
      <div style={{position: "sticky", bottom: "0px", width:"100%", textAlign:"right"}}>
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
      <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>匯出題目</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>關閉</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonTextarea rows={10} label="匯出的題目" placeholder="" readonly={true} value={exported}></IonTextarea>
          複製題目文字並儲存，可以於下一次匯入編輯。<br/>
          <IonButton target="_blank" rel="noopener" href={`mailto:samko5sam@tutanota.com?subject=[wis] 題目建議 ${new Date().getTime()}&body=我想要建議一些題目：%0A${exported}`}>點擊將題目用 E-mail 寄給開發者</IonButton>
        </IonContent>
      </IonModal>
      <IonModal isOpen={isOpen2} onDidDismiss={() => setIsOpen2(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>匯入題目</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen2(false)}>關閉</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonTextarea rows={10} label="在此輸入題目文字" placeholder="" value={importText} onIonInput={(e) => {setImportText(e.detail.value)}}></IonTextarea>
          <IonButton onClick={() => {
            let content = JSON.parse(importText)
            try{
              console.log(content)
            } catch (e) {
              console.error(e)
              alert("字串不是完整的 JSON")
              return
            }
            setQuestions(content)
            setIsOpen2(false)
          }}>匯入</IonButton>
        </IonContent>
      </IonModal>
    </GeneralPage>
  )
}

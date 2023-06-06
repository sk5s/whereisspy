import { useEffect, useState } from "react";
import question,{partialquestion} from "../../question/question";
import GeneralPage from "../Layout/GeneralPage";
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import "./QuestionCreator.css"
import { useHistory } from "react-router";

export default function QuestionCreator({mode}:{
  mode?: string;
}) {
  const password = "whereisspy"
  const history = useHistory()
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
      let answer = prompt("輸入密碼")
      if (answer === password){
        const allQuestion = partialquestion()
        setQuestions(allQuestion)
      } else {
        history.push("/edit")
      }
    }
    if (mode === "all") {
      let answer = prompt("輸入密碼")
      if (answer === password){
        const allQuestion = question()
        setQuestions(allQuestion)
      } else {
        history.push("/edit")
      }
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
    if (questions.length >= 100 && mode !== "dev") return
    if (mode === "all") return
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
    if (mode === "dev") {
      navigator.clipboard.writeText(content);
      alert("已經複製到剪貼簿了")
    } else {
      setIsOpen(true)
      setExported(content)
    }
  }
  const handleRemove = (index) => {
    if (questions.length === 1 || mode === "all") return
    let answer = confirm("確定移除")
    if (!answer) return
    setQuestions((oldarr) => {
      let newarr = [...oldarr]
      newarr.splice(index,1)
      return newarr
    })
  }
  const checkDuplicates = () => {
    let array = [...questions]
    let stringArray = []
    array.forEach((e) => {
      stringArray.push(e.word[0],e.word[1])
    })
    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)
    return [...new Set(findDuplicates(stringArray))]
  }
  return (
    <GeneralPage title="編輯題目">
      {
        mode !== "all"?
        <>
        題目必須使用繁體中文，且不得違反善良風俗。<br/>
        <IonButton onClick={() => {
          setIsOpen2(true)
        }}>
          匯入並覆蓋現有題目
        </IonButton>
        </>
        :<></>
      }
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
                  <input disabled={mode === "all"} type="text" onChange={(e:any) => {
                    // console.log(e.target.value)
                    changeList("0",i,e.target.value)
                  }} contentEditable={true} style={{flex: 1}} value={e.word[0]}/>
                </div>
                <div style={{flex: 1,display:"flex",flexDirection:"column"}}>
                  字詞2
                  <input disabled={mode === "all"} type="text" onChange={(e:any) => {
                    changeList("1",i,e.target.value)
                  }} contentEditable={true} style={{flex: 1}} value={e.word[1]}/>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap"}}>
                <div style={{flex: 1,display:"flex",flexDirection:"column"}}>
                  字詞1說明
                  <input disabled={mode === "all"} type="text" onChange={(e:any) => {
                  changeAdditional("0",i,e.target.value)
                }} contentEditable={true} style={{flex: 1}} value={additional[0]}/>
                </div>
                <div style={{flex: 1,display:"flex",flexDirection:"column"}}>
                  字詞2說明
                  <input disabled={mode === "all"} type="text" onChange={(e:any) => {
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
      <div style={{position: "fixed",backgroundColor:"var(--background)", bottom: "0px", width:"100%", textAlign:"right", paddingRight:"25px"}}>
        {questions.length} {mode === undefined ? <>/ 100</> : <></>}
        {
          mode !== "all" ? 
          <>
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
          </>
          : <></>
        }
        {
          mode === "dev"?
          <IonButton onClick={() => {
            let result = checkDuplicates()
            console.log("檢查是否重複 結果")
            console.table(result)
          }}>
            檢查是否重複
          </IonButton>
          :<></>
        }
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
          <h2>請複製「匯出的題目」中所有文字內容，並點擊下面的連結，將所有文字內容貼上後用 E-mail 寄給開發者。</h2>
          複製題目文字並儲存，可以於下一次匯入編輯。<br/>
          <IonButton target="_blank" rel="noopener" href={`mailto:samko5sam@tutanota.com?subject=[wis] 題目建議 ${new Date().getTime()}&body=我想要建議一些題目：%0A請於此貼上要建議的題目文字`}>點擊將題目用 E-mail 寄給開發者</IonButton>
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

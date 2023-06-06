import { useContext, useEffect, useState } from "react";
import GeneralPage from "./Layout/GeneralPage";
import question from "../question/question";
import { SettingsContext } from "../SettingsContext";
import { IonBadge, IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonCol, IonGrid, IonItem, IonList, IonRow, useIonAlert, useIonToast, useIonViewWillEnter } from "@ionic/react";
import ViewQuestionCenter from "../components/ViewQuestionCenter";
import { useHistory, useLocation } from "react-router";

export default function MainGame() {
  const history = useHistory()
  const location = useLocation();
  const [title, setTitle] = useState("")
  const {settings, setSettings} = useContext(SettingsContext)
  const [view, setView] = useState(0)
  const [startFrom, setStartFrom] = useState(0)
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  const [presentToast1] = useIonToast();
  const [presentToast2] = useIonToast();
  const [presentToast3] = useIonToast();

  const changeQuestion = (type,value) => {
    setSettings((o) => {
      let n = {...o}
      n[type] = value
      return n
    })
  }
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  const nextPlayer = () => {
    // console.log("goto player " + (view+1))
    setView((o) => {
      if (o >= settings.playernum - 1) {
        return -1
      }else {
        return o += 1
      }
    })
  }
  const handleVote = (i) => {
    presentAlert({
      header: '確定投票？',
      subHeader: "玩家"+(i+1) ,
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '確定',
          role: 'confirm',
          handler: () => {
            let element = settings.players[i]
            console.log("玩家"+(i+1),element === -1 ? "臥底" : element === 0 ? "白板" : "平民",settings.playersAndQuestion[i])
            let newstate = [...settings.playersAndState]
            newstate[i] = 1
            changeQuestion("playersAndState", newstate)
            switch (element) {
              case -1:
                presentToast1({
                  message: "殺到臥底",
                  position: "bottom",
                  duration: 2500,
                  color: "danger",
                  buttons: [
                    {
                      text: '關閉',
                      role: 'cancel'
                    },
                  ]
                })
                break;
              case 1:
                presentToast2({
                  message: "殺到平民",
                  position: "bottom",
                  duration: 2500,
                  color: "success",
                  buttons: [
                    {
                      text: '關閉',
                      role: 'cancel'
                    },
                  ]
                })
                break;
              default:
                presentToast3({
                  message: "殺到白板",
                  position: "bottom",
                  duration: 2500,
                  color: "light",
                  buttons: [
                    {
                      text: '關閉',
                      role: 'cancel'
                    },
                  ]
                })
                break;
            }
          },
        },
      ]
    })
  }
  const startNew = () => {
    // 決定題目
    let allQuestion = question()
    let chosenQuestion = allQuestion[Math.floor(Math.random()*allQuestion.length)]
    // console.log(chosenQuestion)
    let chosenQuestionCopy = {...chosenQuestion}
    shuffleArray(chosenQuestion.word)
    changeQuestion("question",chosenQuestion)
    let changedAdditional = ["",""]
    if (chosenQuestionCopy.word[0] === chosenQuestion.word[0] && chosenQuestionCopy.additional !== undefined){
      changedAdditional[0] = chosenQuestionCopy.additional[0]
      changedAdditional[1] = chosenQuestionCopy.additional[1]
    } else if (chosenQuestionCopy.additional !== undefined) {
      changedAdditional[1] = chosenQuestionCopy.additional[1]
      changedAdditional[0] = chosenQuestionCopy.additional[0]
    }
    console.log(changedAdditional)
    let players = []
    for (let p = 0; p < settings.blanknum; p++) {
      players.push(0)
    }
    for (let p = 0; p < settings.spynum; p++) {
      players.push(-1)
    }
    console.log(settings.playernum)
    for (let p = 0; p < settings.playernum - (settings.blanknum+settings.spynum); p++) {
      players.push(1)
    }
    shuffleArray(players)
    console.log(players)
    changeQuestion("players",players)
    let playersAndQuestion = []
    let playersAndState = []
    let playersAndAdditional = []
    players.forEach((e,i) => {
      playersAndState.push(0)
      switch (e) {
        case 1:
          playersAndQuestion.push(chosenQuestion.word[0])
          playersAndAdditional.push(changedAdditional[0])
          break;
        case -1:
          playersAndQuestion.push(chosenQuestion.word[1])
          playersAndAdditional.push(changedAdditional[1])
          break;
        default:
          playersAndQuestion.push("白板")
          playersAndAdditional.push("")
          break;
      }
    })
    changeQuestion("playersAndQuestion",playersAndQuestion)
    changeQuestion("playersAndState",playersAndState)
    changeQuestion("playersAndAdditional",playersAndAdditional)
    console.log(playersAndAdditional)
    setTitle("看題目：玩家"+(view+1))
    let randomPlayerNumber = Math.floor(Math.random()*players.length)
    while(players[randomPlayerNumber] === 0){
      randomPlayerNumber = Math.floor(Math.random()*players.length)
    }
    setStartFrom(randomPlayerNumber)
    setView(0)
  }
  const viewAnswer = () => {
    presentAlert({
      header: '結束並看答案',
      buttons: [
        {
          text: '取消',
          role: 'cancel'
        },
        {
          text: '確定',
          role: 'confirm',
          handler: () => {
            setView(-2)
          },
        },
      ]
    })
  }
  useEffect(() => {
    if (view <= -1){
      setTitle("投票")
      if (view === -1){
        presentToast({
          message: '從玩家'+(startFrom+1)+"開始發言",
          position: "bottom",
          duration: 7000,
          buttons: [
            {
              text: '關閉',
              role: 'cancel'
            },
          ]
        })
      }
    } else {
      setTitle("看題目：玩家"+(view+1))
    }
  },[view])
  useEffect(() => {
    startNew()
  },[])
  useEffect(() => {
    startNew()
  },[location])
  
  return (
    <GeneralPage title={title}>
      {
        view <= -1 ?
        <>
        點擊玩家來投票
        <IonList>
        {(() => {
          let rows = []
          if (settings.players.length === 0) {
            rows = []
          } else {
            settings.players.forEach((element,i) => {
              rows.push(
                <IonItem key={`${settings.playernum} ${i}`} onClick={() => handleVote(i)} disabled={settings.playersAndState[i]}>
                  {settings.playersAndState[i] ? <s>玩家{i+1}</s> :<>玩家{i+1}</>}
                  {settings.playersAndState[i]? <IonBadge slot="end">{element === -1 ? "臥底" : element === 0 ? "白板" : "平民"}</IonBadge> : <></>}
                  {view === -2 ? <>{" "}{settings.playersAndQuestion[i]}</> : <></>}
                </IonItem>
              )
            })
          }
          return rows
        })()}
          {
            view === -2?
            <>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonCard style={{padding: "10px"}}>
                      <IonCardSubtitle>平民</IonCardSubtitle>
                      <IonCardTitle>{settings.question.word[0]}</IonCardTitle>
                    </IonCard>
                  </IonCol>
                  <IonCol>
                    <IonCard style={{padding: "10px"}}>
                      <IonCardSubtitle>臥底</IonCardSubtitle>
                      <IonCardTitle>{settings.question.word[1]}</IonCardTitle>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonGrid>
              <IonButton expand='full' onClick={() => startNew()}>再玩一次</IonButton>
              <IonButton expand='full' onClick={() => history.push("/home")}>回主頁</IonButton>
            </>
            :<>
              {
                settings.playersAndState.reduce((partialSum, a) => partialSum + a, 0) <1 ?<></>
                :<IonButton expand='full' onClick={() => viewAnswer()}>結束 看答案</IonButton>
              }
            </>
          }
          
        </IonList>
        </>
        :<ViewQuestionCenter text={settings.playersAndQuestion[view]} additional={settings.playersAndAdditional[view]} next={nextPlayer} />
      }

      {/* for developer */}
      <div style={{display:"none"}}>
        <IonList>
        {(() => {
          let rows = []
          if (settings.players.length === 0) {
            rows = []
          } else {
            // console.log(settings.players)
            settings.players.forEach((element,i) => {
              rows.push(
                <IonItem key={i}>
                  玩家{i+1} {element === -1 ? "臥底" : element === 0 ? "白板" : "平民"}
                  {" "}{settings.playersAndQuestion[i]}
                </IonItem>
              )
            })
          }
          return rows
        })()}
        </IonList>
      </div>
    </GeneralPage>
  )
}

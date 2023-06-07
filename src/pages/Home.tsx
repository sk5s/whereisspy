import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonList, IonModal, IonPopover, IonRow, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import GeneralPage from './Layout/GeneralPage';
import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../SettingsContext';
import { useHistory } from 'react-router';
import { addSharp, removeSharp } from 'ionicons/icons';

function Home() {
  const {settings, setSettings} = useContext(SettingsContext)
  const [maxSpy, setMaxSpy] = useState(1)
  const [maxBlank,setMaxBlank] = useState(0)
  const [howToPlayModal,setHowToPlayModal] = useState(false)
  const history = useHistory()
  const calculateMaxSpy = () => {
    let num = 0
    let cal = settings.playernum
    if (cal === "") return
    if (cal % 2 === 0) {
      cal -= 1
    }
    num = cal / 2
    num = Math.trunc(num)
    setMaxSpy(num)
    if (settings.spynum > num) {
      changeNum("spynum",num)
    }
  }
  const calculateMaxBlank = () => {
    if (settings.playernum === "") return
    setMaxBlank(settings.playernum - settings.spynum)
    if (settings.blanknum > settings.playernum - settings.spynum) changeNum("blanknum",settings.playernum - settings.spynum)
  }
  const changeNum = (type,value) => {
    let myvalue:any = parseInt(value)
    if (value === "") myvalue = ""
    setSettings((o) => {
      let n = {...o}
      n[type] = myvalue
      return n
    })
  }
  const PlayerNumberInput = () => {
    return (
      <IonItem>
        <IonInput onIonInput={(e) => {
          if (parseInt(e.detail.value) <= 16 && parseInt(e.detail.value) >= 4 || e.detail.value === ""){
            changeNum("playernum",e.detail.value)
          } else {
            changeNum("playernum","4")
          }
        }} label="玩家人數" type="number" placeholder="輸入玩家人數" min={4} max={16} value={settings.playernum}></IonInput>
        <IonButton onClick={() => {
          if (settings.playernum <= 4) return
          changeNum("playernum",settings.playernum -= 1)
        }} disabled={settings.playernum === 4} size='small' shape='round'>
          <IonIcon slot="icon-only" icon={removeSharp}></IonIcon>
        </IonButton>
        <IonButton onClick={() => {
          if (settings.playernum >= 16) return
          changeNum("playernum",settings.playernum += 1)
        }} disabled={settings.playernum === 16} size='small' shape='round'>
          <IonIcon slot="icon-only" icon={addSharp}></IonIcon>
        </IonButton>
      </IonItem>
    )
  }
  const SpyNumberInput = () => {
    return (
      <IonItem>
        <IonInput onIonInput={(e) => {
          if (parseInt(e.detail.value) <= maxSpy && parseInt(e.detail.value) >= 1 || e.detail.value === ""){
            changeNum("spynum",e.detail.value)
          } else {
            changeNum("spynum","1")
          }
        }} label="臥底人數" type="number" placeholder="輸入臥底人數" min={1} max={maxSpy} value={settings.spynum}></IonInput>
        <IonButton onClick={() => {
          if (settings.spynum <= 1) return
          changeNum("spynum",settings.spynum -= 1)
        }} disabled={settings.spynum === 1} size='small' shape='round'>
          <IonIcon slot="icon-only" icon={removeSharp}></IonIcon>
        </IonButton>
        <IonButton onClick={() => {
          if (settings.spynum >= maxSpy) return
          changeNum("spynum",settings.spynum += 1)
        }} disabled={settings.spynum === maxSpy} size='small' shape='round'>
          <IonIcon slot="icon-only" icon={addSharp}></IonIcon>
        </IonButton>
      </IonItem>
    )
  }
  const BlankNumberInput = () => {
    return (
      <IonItem>
        <IonInput onIonInput={(e) => {
          if (parseInt(e.detail.value) <= (settings.playernum - settings.spynum) && parseInt(e.detail.value) >= 0 || e.detail.value === ""){
            changeNum("blanknum",e.detail.value)
          } else {
            changeNum("blanknum","0")
          }
        }} label="白板人數" type="number" placeholder="輸入白板人數" min={0} max={maxBlank} value={settings.blanknum}></IonInput>
        <IonButton onClick={() => {
          if (settings.blanknum <= 0) return
          changeNum("blanknum",settings.blanknum -= 1)
        }} disabled={settings.blanknum === 0} size='small' shape='round'>
          <IonIcon slot="icon-only" icon={removeSharp}></IonIcon>
        </IonButton>
        <IonButton onClick={() => {
          if (settings.blanknum >= maxBlank) return
          changeNum("blanknum",settings.blanknum += 1)
        }} disabled={settings.blanknum === maxBlank} size='small' shape='round'>
          <IonIcon slot="icon-only" icon={addSharp}></IonIcon>
        </IonButton>
      </IonItem>
    )
  }
  const HowToPlayContent = () => {
    return (
      <ol>
        <li>玩家身份共有「平民」、「臥底」和「白板」三種</li>
        <li>遊戲開始前，每人輪流傳閱手機，看自己的題目</li>
        <li>遊戲開始，未被殺者須輪流用一段話，隱約地描述、暗示你看到的題目，不可說到題目上的字，也不可以說謊</li>
        <li>「臥底」的詞彙與大部分人不同，「臥底」需掩飾身份與找出隊友</li>
        <li>看到「白板」兩字者，需要觀察其他人的描述來唬爛</li>
        <li>若投票時得票相同，可用猜拳決定</li>
      </ol>
    )
  }
  const HowToPlay = () => {
    return (
      <>
        <IonButton color="light" expand='full' onClick={() => setHowToPlayModal(true)}>遊戲規則</IonButton>
        <IonModal isOpen={howToPlayModal} onDidDismiss={() => setHowToPlayModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>遊戲規則</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setHowToPlayModal(false)}>關閉</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <HowToPlayContent />
          </IonContent>
        </IonModal>
      </>
    )
  }
  useEffect(() => {
    calculateMaxSpy()
    calculateMaxBlank()
  },[settings.playernum])
  const GoButton = ({type}) => {
    return (
      <IonButton expand='full' color={type === "custom" ? "light" : "primary"} onClick={
        () => {
          console.log(settings)
          if (settings.playernum === "" || settings.playernum > 16 || settings.playernum < 4){
            changeNum("playernum","4")
          }
          if (settings.spynum === "" || settings.spynum > maxSpy || settings.spynum < 1){
            changeNum("spynum","1")
          }
          if (settings.blanknum === "" || settings.blanknum > (settings.playernum - settings.spynum) || settings.blanknum < 0){
            changeNum("blanknum","0")
          }
          if (type === "custom"){
            history.push("/custom")
          } else {
            history.push("/game")
          }
        }
      }>{type === "custom" ? <>自訂題目開始</> : <>開始遊戲</>}</IonButton>
    )
  }
  return (
    <GeneralPage title="找出臥底" home={false}>
      <IonList>
        <PlayerNumberInput />
        <SpyNumberInput />
        <BlankNumberInput />
      </IonList>
      <IonGrid>
        <IonRow>
          <IonCol><GoButton type="normal" /></IonCol>
        </IonRow>
        <IonRow>
          <IonCol><GoButton type="custom" /></IonCol>
        </IonRow>
        <IonRow>
          <IonCol><HowToPlay /></IonCol>
        </IonRow>
        <IonRow>
          <IonCol><IonButton expand='full' color="light" href='https://s.sk5s.cyou/wis' target='_blank' rel='noopener noreferer'>幫忙加大題庫</IonButton></IonCol>
        </IonRow>
      </IonGrid>
    </GeneralPage>
  );
}

export default Home;

import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonList, IonModal, IonPopover, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import GeneralPage from './Layout/GeneralPage';
import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../SettingsContext';
import { useHistory } from 'react-router';

function Home() {
  const {settings, setSettings} = useContext(SettingsContext)
  const [maxSpy, setMaxSpy] = useState(1)
  const [howToPlayModal,setHowToPlayModal] = useState(false)
  const history = useHistory()
  const calculateMaxSpy = () => {
    let num = 0
    let cal = settings.playernum
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
        <IonInput onIonChange={(e) => {
          if (parseInt(e.detail.value) <= 16 && parseInt(e.detail.value) >= 4){
            changeNum("playernum",e.detail.value)
          } else {
            changeNum("playernum","4")
          }
        }} label="玩家人數（4~16）" type="number" placeholder="輸入玩家人數" min={4} max={16} value={settings.playernum}></IonInput>
      </IonItem>
    )
  }
  const SpyNumberInput = () => {
    return (
      <IonItem>
        <IonInput onIonChange={(e) => {
          if (parseInt(e.detail.value) <= maxSpy && parseInt(e.detail.value) >= 1){
            changeNum("spynum",e.detail.value)
          } else {
            changeNum("spynum","1")
          }
        }} label="臥底人數" type="number" placeholder="輸入臥底人數" min={1} max={maxSpy} value={settings.spynum}></IonInput>
      </IonItem>
    )
  }
  const BlankNumberInput = () => {
    return (
      <IonItem>
        <IonInput onIonChange={(e) => {
          if (parseInt(e.detail.value) <= (settings.playernum - settings.spynum) && parseInt(e.detail.value) >= 0){
            changeNum("blanknum",e.detail.value)
          } else {
            changeNum("blanknum","0")
          }
        }} label="白板人數" type="number" placeholder="輸入白板人數" min={0} max={settings.playernum - settings.spynum} value={settings.blanknum}></IonInput>
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
        <IonButton expand='full' onClick={() => setHowToPlayModal(true)}>遊戲規則</IonButton>
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
    if (settings.blanknum > settings.playernum - settings.spynum) changeNum("blanknum",settings.playernum - settings.spynum)
  },[settings.playernum])
  const GoButton = () => {
    return (
      <IonButton expand='full' onClick={
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
          history.push("/game")
        }
      }>開始遊戲</IonButton>
    )
  }
  return (
    <GeneralPage title="找出臥底">
      <IonList>
        <PlayerNumberInput />
        <SpyNumberInput />
        <BlankNumberInput />
        <GoButton />
        <HowToPlay />
      </IonList>
    </GeneralPage>
  );
}

export default Home;

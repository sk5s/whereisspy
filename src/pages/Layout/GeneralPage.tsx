import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonAlert } from "@ionic/react";
import { useContext } from "react";
import { SettingsContext } from "../../SettingsContext";
import { useHistory } from "react-router";

export default function GeneralPage({ children, title, home }) {
  const {settings, setSettings} = useContext(SettingsContext)
  const history = useHistory()
  const [presentAlert] = useIonAlert();
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            {
              home === true ?
              <IonButtons slot="start">
                <IonButton onClick={() => {
                  presentAlert({
                    header: '返回主頁',
                    buttons: [
                      {
                        text: '取消',
                        role: 'cancel'
                      },
                      {
                        text: '確定',
                        role: 'confirm',
                        handler: () => {
                          history.push("/home")
                        },
                      },
                    ]
                  })
                }}>回主頁</IonButton>
              </IonButtons>
            :<></>
            }

            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
          {children}
        </IonContent>
      </IonPage>
    </>
  );
}
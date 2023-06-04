import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useContext } from "react";
import { SettingsContext } from "../../SettingsContext";

export default function GeneralPage({ children, title }) {
  const {settings, setSettings} = useContext(SettingsContext)
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
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
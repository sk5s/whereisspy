import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useState } from 'react';
import { SettingsContext } from './SettingsContext';
import MainGame from './pages/MainGame';
import QuestionCreator from './pages/Develop/QuestionCreator';

setupIonicReact();

function App() {
  const [settings, setSettings] = useState<any>({
    playernum: 4,
    spynum: 1,
    blanknum: 0,
    question: {
      id: 0,
      word: []
    },
    players: [],
    playersAndQuestion: [],
    playersAndAdditional: [],
    playersAndState: []
  })
  return (
    <IonApp>
      <IonReactRouter>
        <SettingsContext.Provider value={{settings,setSettings}}>
          <IonRouterOutlet>
            <Route exact path="/home">
              <Home />
            </Route>
            <Route exact path="/game">
              <MainGame type='general' />
            </Route>
            <Route exact path="/custom">
              <MainGame type="custom" />
            </Route>
            <Route exact path="/edit">
              <QuestionCreator />
            </Route>
            <Route exact path="/editDev">
              <QuestionCreator mode='dev' />
            </Route>
            <Route exact path="/viewAll">
              <QuestionCreator mode='all' />
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
        </SettingsContext.Provider>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;

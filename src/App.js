import classes from './App.module.css';
import { useEffect } from 'react';
import './variables.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
//components
import Header from './components/ui/header';
import TranslateBar from './components/translate/translateBar';
import HistoryList from './components/translate/historyList';
// learn
import Learn from './components/learn/learn';

//logic components
import { FetchToGoogle } from './components/logic/fetch';
import { readLocalStorage } from './store/localStorage';
// import { saveLocalStorage } from './store/localStorage';

//valtio
import { useSnapshot } from 'valtio';
import { state } from './store/state';
//redux
import { useSelector, useDispatch } from 'react-redux';
// import loginReducer from './reducers/loginReducer';
// import { login, logout } from './actions/actions';
import { historyListAdd } from './actions/actions';
import { startup } from './actions/actions';

function App() {
  const dispatch = useDispatch();
  const shortcuts = useSelector(state => state.appData.settings.shortcuts);

  // eslint-disable-next-line no-unused-vars
  const reduxState = useSelector(state => state.appData); // do not remove !!! needed to update state
  // console.log('✅', reduxState.history.list[0].fav); //debug BUG update fav state not consistent

  const languageArray = useSelector(
    state => state.appData.settings.languageArray
  );
  const [lang1, lang2] = useSelector(
    state => state.appData.settings.defaultLanguage
  );

  //valtio app state
  const snap = useSnapshot(state);
  //==================================================================
  // redux mainState
  // const stateRedux = useSelector(state => state);

  // read local data on startup
  useEffect(() => {
    const localData = readLocalStorage();
    if (localData) dispatch(startup(localData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //==================================================================
  const defaultLanguageObjects = (array, lang) => {
    return array.filter(el => el.name === lang);
  };

  const onSubmitSearch = async searchObj => {
    const res = await FetchToGoogle(searchObj);
    if (res) dispatch(historyListAdd({ type: 'ADD', payload: res }));
    return;
  };

  const onMenuButtonHandler = () => {
    console.log('❌ Menu Button');
  };

  return (
    <div className={classes.App}>
      <header className={classes.header_menu}>
        <Header></Header>
        <button className={classes.menuButton} onClick={onMenuButtonHandler}>
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className={classes.menuButtonIcon}
          />
        </button>
      </header>
      {snap.translate && (
        <div className={classes.divBox}>
          <TranslateBar
            loading={snap.loading}
            settings={shortcuts}
            defaultLanguage={[
              ...defaultLanguageObjects(languageArray, lang1),
              ...defaultLanguageObjects(languageArray, lang2),
            ]}
            languageArray={languageArray}
            onSubmitSearch={onSubmitSearch}
          ></TranslateBar>
          <HistoryList
            icon={'faHistory'}
            name={'history'}
            list={[]}
            mainLanguage={'de'}
          ></HistoryList>
        </div>
      )}
      {!snap.translate && <Learn></Learn>}
    </div>
  );
}

export default App;

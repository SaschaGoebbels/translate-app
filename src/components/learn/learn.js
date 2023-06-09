import React, { useState, useEffect } from 'react';
import classes from './Learn.module.css';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

//redux
import { useSelector, useDispatch } from 'react-redux';
import {
  currentList,
  intervalIncrease,
  intervalReset,
  deleteItemOfLearnList,
  editItemOfLearnList,
} from '../../redux/learnSlice';

//components
import QuestionBox from './QuestionBox';
import EditBox from './EditBox';
import CurrentStats from './CurrentStats';
import RenderObjectList from '../ui/RenderObjectList';
import ButtonText from '../ui/ButtonText';
// logic components
import { createNewRound } from '../logic/learnLogic';

//valtio
import { useSnapshot } from 'valtio';
import { state } from '../../store/state';

const Learn = props => {
  const snap = useSnapshot(state);
  const dispatch = useDispatch();
  const shortcuts = useSelector(state => state.settings.settings.shortcuts);
  const learn = useSelector(state => state.learn.learn);
  const redux = useSelector(state => state);

  const currentDefault = {
    list: learn.current.list || [],
    index: learn.current.index || 0,
  };
  const [currentQuestion, setCurrentQuestion] = useState(currentDefault);

  useEffect(() => {
    // on startUp check current is empty ? check learn empty : show div : else create new Round
    if (currentQuestion.list.length === 0 && learn.learn.list.length !== 0) {
      onNewRoundHandler();
    }
  }, []);

  useEffect(() => {
    setCurrentQuestion(currentDefault);
  }, [learn.list, learn.current.index, learn.current.list]);
  //==================================================================
  const [currentQuestionEmpty, setCurrentQuestionEmpty] = useState(true);
  useEffect(() => {
    if (currentQuestion.list.length === 0) {
      setCurrentQuestionEmpty(true);
      return;
    }
    setCurrentQuestionEmpty(false);
  }, [currentQuestion]);

  const currentObject = currentQuestion.list[currentQuestion.index];
  //==================================================================
  const [editMode, setEditMode] = useState(false);
  //==================================================================
  const handleIntervalTextOutput = obj => {
    // eslint-disable-next-line eqeqeq
    const oddOrEven = obj?.interval % 2 == 0 ? 'even' : 'odd';
    if (oddOrEven === 'even') {
      return [obj?.text1, obj?.text2];
    } else {
      return [obj?.text2, obj?.text1];
    }
  };
  const questionDefault = {
    text: handleIntervalTextOutput(
      currentQuestion.list[currentQuestion.index]
    ) || ['...', '...'],
    answer: '...',
    button: true,
  };
  const [question, setQuestion] = useState(questionDefault);
  useEffect(() => {
    setQuestion(questionDefault);
  }, [currentQuestion]);

  const onButtonBoxHandler = id => {
    if (editMode === false) {
      if (id === 'quest') {
        questButton();
      }
      if (id === 'check') {
        checkButton();
      }
      if (id === 'x') {
        xButton();
      }
      if (id === 'pen') {
        setEditMode(true);
      }
    }
  };

  const questButton = () => {
    // handleIntervalTextOutput(currentObject);
    setQuestion({
      text: handleIntervalTextOutput(currentObject),
      answer: handleIntervalTextOutput(currentObject)[1],
      button: false,
    });
  };
  const checkButton = () => {
    dispatch(intervalIncrease({ id: currentObject.id }));
  };
  const xButton = () => {
    dispatch(intervalReset({ id: currentObject.id }));
  };

  // delete or edit
  const onClickHandler = (buttonId, id) => {
    if (buttonId === 'pen') {
      console.log('✅ pen');
      return;
    }
    if (buttonId === 'trash') {
      console.log('❌ trash');
      dispatch(deleteItemOfLearnList({ id }));
      return;
    }
  };

  const onNewRoundHandler = () => {
    const newRound = createNewRound(learn.learn.list, learn.interval);
    dispatch(currentList({ list: newRound }));
  };

  const [editLearn, setEditLearn] = useState(false);
  const onEditLearnSwitch = () => {
    setEditLearn(prev => !prev);
  };
  //==================================================================
  // handle keyboard shortcuts
  document.onkeyup = function (e) {
    // console.log('✅', e.code);
    if (snap.translate === true) return;
    if (!shortcuts.learn) return;
    if (e.code === 'Enter') {
      if (question.button) {
        questButton();
      }
      if (!question.button) {
        checkButton();
      }
    }
    if (e.code === 'Escape') {
      if (!question.button) {
        xButton();
      }
    }
  };
  //==================================================================
  const editItem = el => {
    dispatch(
      editItemOfLearnList({
        id: currentQuestion.list[currentQuestion.index].id,
        ...el,
      })
    );
  };

  const onClickArchiv = () => {
    console.log('✅ archiv'); //TODO
  };

  //==================================================================
  return (
    <div className={classes.lernBox}>
      <div className={classes.editLearnSwitchBox}>
        <ButtonText
          name={editLearn ? 'learn' : 'edit list'}
          style={{ border: 'var(--clr_accent_blue) solid 2px' }}
          id={'editLearnSwitch'}
          onClickHandler={onEditLearnSwitch}
        ></ButtonText>
      </div>
      {learn.learn.list.length < 30 && (
        <div className={classes.emptyMessageBox}>
          <p>
            you should have at least 30-50 translations saved in you're list
            before you start learning ! we highly recommend to add more
            translations !
          </p>
        </div>
      )}
      {!editLearn && (
        <div>
          <CurrentStats
            onClickArchiv={onClickArchiv}
            currentRound={{
              length: learn.current.list?.length || 0,
              index: learn.current?.index || 0,
            }}
            total={{
              cards: learn.learn.list?.length,
              rounds: learn?.stats.totalRounds,
              archived: learn?.stats.archived.length,
            }}
          ></CurrentStats>
          {!currentQuestionEmpty && !editMode && (
            <QuestionBox
              onClickHandler={onButtonBoxHandler}
              text1={question.text[0]}
              text2={question.answer}
              hideXBtn={question.button}
              hideQuest={!question.button}
              hideCheck={question.button}
            ></QuestionBox>
          )}
          {editMode && (
            <EditBox
              disableEditMode={() => {
                setEditMode(false);
              }}
              currentObject={currentObject}
              deleteItem={() => {
                dispatch(deleteItemOfLearnList({ id: currentObject.id }));
              }}
              editItem={el => {
                editItem(el);
              }}

              // text1={question.text[0]}
              // text2={question.text[1]}
            ></EditBox>
          )}
          {currentQuestionEmpty && (
            <div className={classes.emptyMessageBox}>
              <p>
                The current Round is empty or there are no translations saved !
              </p>
            </div>
          )}
        </div>
      )}
      {editLearn && (
        <RenderObjectList
          icon={faLightbulb}
          name={'all translations'}
          array={learn.learn.list}
          mainLanguage={'de'}
          onClickHandler={onClickHandler}
          borderColor={'--clr_accent_blue'}
          gradientColor={{ left: '--secondClr', right: '--clr_accent_blue' }}
        ></RenderObjectList>
      )}
    </div>
  );
};

export default Learn;

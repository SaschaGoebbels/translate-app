import React from 'react';
import classes from './currentStats.module.css';

const CurrentStats = props => {
  const currentRound = props.currentRound || { count: 0, total: 0 };
  const total = props.total || { cards: 0, rounds: 0 };
  ///
  return (
    <div>
      <div className={classes.box}>
        <div className={classes.textBox}>
          <p>Current Round:</p>
          <p>
            {currentRound.count} / {currentRound.total}
          </p>
        </div>
        <div className={classes.textBox}>
          <p>Total</p>
          <p>Cards:</p>
          <p>{total.cards}</p>
          <p>Rounds:</p>
          <p>{total.rounds}</p>
        </div>
      </div>
      <button>weiter</button>
      <button>neue Runde</button>
    </div>
  );
};

export default CurrentStats;
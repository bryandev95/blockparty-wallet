import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import { ClipLoader } from 'react-spinners';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Balance from './components/Balance';

import getTokenInfo from 'contexts/getTokenInfo';

import style from './style.module.scss';

const ACTIONS = 1;
const BALANCE = 2;
const SEND = 3;
const RECEIVE = 4;

const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

const Main = ({ balances }) => {
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(ACTIONS);
  const [tokens, setTokens] = useState([]);
  const prevBalance = usePrevious(balances);

  useEffect(() => {
    if (!balances.tokens) return;

    if (!_.isEqual(balances, prevBalance)) {
      setLoading(true);
      getTokenInfo(balances.tokens)
        .then(response => {
          setLoading(false);
          setTokens(response);
        })
        .catch(e => {
          console.log('update token error ', e);
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [prevBalance]);

  return (
    <div className={style.container}>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={cx(style.menuItem, { [style.active]: activeTab === ACTIONS })}
            onClick={() => setActiveTab(ACTIONS)}
          >
            <span>ACTIONS</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={cx(style.menuItem, { [style.active]: activeTab === BALANCE })}
            onClick={() => setActiveTab(BALANCE)}
          >
            <span>BALANCE</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={cx(style.menuItem, { [style.active]: activeTab === SEND })}
            onClick={() => setActiveTab(SEND)}
          >
            <span>SEND</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={cx(style.menuItem, { [style.active]: activeTab === RECEIVE })}
            onClick={() => setActiveTab(RECEIVE)}
          >
            <span>RECEIVE</span>
          </NavLink>
        </NavItem>
      </Nav>

      <div className={style.tabContainer}>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={ACTIONS}>ACTIONS</TabPane>
          <TabPane tabId={BALANCE}>
            <Balance balances={balances} tokens={tokens} />
          </TabPane>
          <TabPane tabId={SEND}>SEND</TabPane>
          <TabPane tabId={RECEIVE}>RECEIVE</TabPane>
        </TabContent>

        {(isLoading || (_.isEmpty(balances) && activeTab === BALANCE)) && (
          <div className={style.loaderContainer}>
            <ClipLoader size="35px" />
          </div>
        )}
      </div>
    </div>
  );
};

Main.propTypes = {
  balances: PropTypes.object
};

export default Main;

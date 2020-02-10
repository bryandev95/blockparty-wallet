import React, { useState } from 'react';
import cx from 'classnames';

import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

import style from './style.module.scss';

const ACTIONS = 1;
const BALANCE = 3;
const SEND = 2;
const RECEIVE = 4;

const OnBoarding = () => {
  const [activeTab, setActiveTab] = useState(ACTIONS);

  return (
    <div>
      <Nav tabs className={style.container}>
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
      <TabContent activeTab={activeTab}>
        <TabPane tabId={ACTIONS}>ACTIONS</TabPane>
        <TabPane tabId={BALANCE}>BALANCE</TabPane>
        <TabPane tabId={SEND}>SEND</TabPane>
        <TabPane tabId={RECEIVE}>RECEIVE</TabPane>
      </TabContent>
    </div>
  );
};

export default OnBoarding;

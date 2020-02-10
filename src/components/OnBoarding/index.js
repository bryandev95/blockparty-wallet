import React, { useState } from 'react';
import cx from 'classnames';

import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

import style from './style.module.scss';

const GENERATE = 1;
const IMPORT = 2;

const OnBoarding = () => {
  const [activeTab, setActiveTab] = useState(GENERATE);

  return (
    <div>
      <Nav tabs className={style.container}>
        <NavItem>
          <NavLink
            className={cx(style.menuItem, { [style.active]: activeTab === GENERATE })}
            onClick={() => setActiveTab(GENERATE)}
          >
            <span>GENERATE</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={cx(style.menuItem, { [style.active]: activeTab === IMPORT })}
            onClick={() => setActiveTab(IMPORT)}
          >
            <span>IMPORT</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId={GENERATE}>GENERATE</TabPane>
        <TabPane tabId={IMPORT}>IMPORT</TabPane>
      </TabContent>
    </div>
  );
};

export default OnBoarding;

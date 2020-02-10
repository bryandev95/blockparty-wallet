import React, { useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Generate from '../Generate';
import WalletInfo from './components/WalletInfo';

import style from './style.module.scss';

const GENERATE = 1;
const IMPORT = 2;

const OnBoarding = ({ showInfo, onToggle }) => {
  const [activeTab, setActiveTab] = useState(GENERATE);

  return (
    <div className={style.container}>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={cx(style.menuItem, { [style.active]: activeTab === GENERATE })}
            onClick={() => setActiveTab(GENERATE)}
          >
            GENERATE
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            className={cx(style.menuItem, { [style.active]: activeTab === IMPORT })}
            onClick={() => setActiveTab(IMPORT)}
          >
            IMPORT
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId={GENERATE}>
          <Generate />
        </TabPane>

        <TabPane tabId={IMPORT}>IMPORT</TabPane>
      </TabContent>

      <WalletInfo showInfo={showInfo} onToggle={onToggle} />
    </div>
  );
};

OnBoarding.propTypes = {
  showInfo: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default OnBoarding;

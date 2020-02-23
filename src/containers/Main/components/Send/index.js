import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Notification from 'react-web-notification';

import Button from 'components/Button';
import DropdownSelect from 'components/DropdownSelect';
import Input from 'components/Input';

import { getTokenInfo, sendToken, sendBCH } from 'contexts/utils';

import style from './style.module.scss';

const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

const Send = ({ balances, wallet }) => {
  const [isLoading, setLoading] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [errors, setErrors] = useState(null);
  const [title, setTitle] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    address: '',
    amount: ''
  });
  const prevBalance = usePrevious(balances);

  useEffect(() => {
    if (!balances.tokens) return;

    getTokenInfo(balances.tokens).then(response => {
      setTokens(
        response.map(item => ({
          ...item,
          balance: balances.tokens.find(token => token.tokenId === item.id).balance
        }))
      );
    });
    // eslint-disable-next-line
  }, [prevBalance]);

  const getOptionList = () => {
    const options = [{ label: 'BCH', value: 0 }];

    if (!tokens) {
      return options;
    } else {
      tokens.forEach(token => {
        options.push({ label: token.name, value: token.id });
      });

      return options;
    }
  };

  const isValid = () => {
    const { type, address, amount } = formData;

    if (!address || !/^[0-9]+([,.][0-9]+)?$/g.test(amount)) return false;
    if (!type && balances.balance < amount) return false;
    if (type) {
      const token = tokens.find(token => token.id === type);
      if (token && token.balance < parseFloat(amount)) return false;
    }

    return true;
  };

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = () => {
    const { type, address, amount } = formData;

    if (type) {
      setLoading(true);
      sendToken(wallet, formData)
        .then(() => {
          setLoading(false);
          setTitle('Token successfully sent');
        })
        .catch(err => {
          setLoading(false);
          setErrors(err.message);
        });
    } else {
      sendBCH(wallet, address, amount, err => {
        if (err) {
          setLoading(false);
          setErrors(err.message || err);
        } else {
          setLoading(false);
          setTitle('Transaction successful.');
        }
      });
    }
  };

  return (
    <div className={style.container}>
      <div className={style.form}>
        <div className={style.formField}>
          <label>Select BCH or any other SLP token you'd like to send</label>
          <br />
          <DropdownSelect
            options={getOptionList()}
            defaultValue={getOptionList()[0]}
            onChange={({ value }) => handleChange({ target: { name: 'type', value } })}
          />
        </div>

        <div className={style.formField}>
          <label>BCH/SLP address</label>
          <br />
          <Input name="address" onChange={handleChange} />
        </div>

        <div className={style.formField}>
          <label>Label</label>
          {/* <a>Max</a> */}
          <br />
          <Input name="amount" onChange={handleChange} />
        </div>

        {errors && <p className={style.errorText}>Error: {errors}</p>}

        <div className={style.submit}>
          <Button color="success" disabled={!isValid() || isLoading} onClick={handleSubmit}>
            <span>Send</span>
          </Button>
        </div>
      </div>

      <Notification ignore={!title} timeout={5000} title={title} />
    </div>
  );
};

Send.propTypes = {
  tokens: PropTypes.array,
  balances: PropTypes.object,
  wallet: PropTypes.object
};

export default Send;

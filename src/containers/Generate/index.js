import React from 'react';

import { MdFileDownload } from 'react-icons/md';
import Button from 'components/Button';
import CopyToClipboard from 'components/CopyToClipboard';

import style from './style.module.scss';

const Generate = () => {
  const mnemonic = 'news blood output problem catalog area talk boil winner firm grunt surface';

  return (
    <div className={style.container}>
      <p>
        Ensure you save these words and keep them safe, they are the key to your new wallet. Without
        them, your money will be lost forever. Go to Import after saving.
      </p>

      <h6>
        <span>{mnemonic}</span>
        <CopyToClipboard text={mnemonic} />
      </h6>

      <Button color="success">
        <span>
          Download
          <MdFileDownload />
        </span>
      </Button>
    </div>
  );
};

export default Generate;

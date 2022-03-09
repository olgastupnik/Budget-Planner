import { useContext, ReactNode } from 'react';
import Modal from '@material-ui/core/Modal';
import { observer } from 'mobx-react';
import CloseIcon from '@material-ui/icons/Close';

import './modal.css';
import RootStore from 'store';

interface IModalProps {
  title: string;
  isShowCloseBtn: boolean;
  desc: string;
  children: ReactNode;
  isOpen: boolean;
}

export const MyModal = observer(
  ({ title = 'title', isShowCloseBtn = true, desc = '', children, isOpen }: IModalProps) => {
    const {
      modalStore: { closeModal },
    } = useContext(RootStore);

    return (
      <Modal open={isOpen} onClose={closeModal} className="modal">
        <>
          {isShowCloseBtn && (
            <button type="button" onClick={closeModal} className="closeBtn">
              <CloseIcon style={{ fontSize: 'medium' }} />
            </button>
          )}
          <h4 id="simple-modal-description" className="modalText">
            {title}
          </h4>
          <h5 className="modalText">{desc}</h5>
          {children && children}
        </>
      </Modal>
    );
  },
);

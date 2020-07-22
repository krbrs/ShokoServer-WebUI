import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { RootState } from '../../core/store';
import Events from '../../core/events';
import Header from '../../components/Layout/Header';
import Sidebar from '../../components/Layout/Sidebar';

import DasboardTab from './Tabs/DashboardTab';
import ImportFoldersTab from './Tabs/ImportFoldersTab';
import ActionsTab from './Tabs/ActionsTab';
import SettingsTab from './Tabs/SettingsTab';

import ImportFolderModal from '../../components/Dialogs/ImportFolderModal';
import ProfileModal from '../../components/Dialogs/ProfileModal';

class MainPage extends React.Component<Props> {
  componentDidMount() {
    const {
      load, getSettings, startPolling, getQueueStatus,
    } = this.props;
    getSettings();
    load();
    getQueueStatus();
    startPolling();
  }

  componentWillUnmount() {
    const { autoUpdate, stopPolling } = this.props;
    if (autoUpdate) {
      stopPolling();
    }
  }

  renderContent = () => {
    const { activeTab } = this.props;

    switch (activeTab) {
      case 'dashboard':
        return (<DasboardTab />);
      case 'import-folders':
        return (<ImportFoldersTab />);
      case 'actions':
        return (<ActionsTab />);
      case 'settings':
        return (<SettingsTab />);
      default:
        return (<DasboardTab />);
    }
  };

  render() {
    const { notifications, toastPosition } = this.props;

    return (
      <React.Fragment>
        {notifications && (
          <ToastContainer
            position={toastPosition}
            autoClose={4000}
            transition={Slide}
            bodyClassName="font-bold font-exo2"
            className="mt-20"
          />
        )}
        <div className="flex flex-grow h-full">
          <ImportFolderModal />
          <ProfileModal />
          <div className="flex h-screen sidebar-container">
            <Sidebar />
          </div>
          <div className="flex flex-col flex-grow h-full">
            <Header />
            <div className="overflow-y-auto">
              {this.renderContent()}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapState = (state: RootState) => ({
  activeTab: state.mainpage.activeTab,
  autoUpdate: state.autoUpdate,
  toastPosition: state.webuiSettings.v3.toastPosition,
  notifications: state.webuiSettings.v3.notifications,
});

const mapDispatch = {
  startPolling: () => ({ type: Events.START_API_POLLING, payload: { type: 'auto-refresh' } }),
  stopPolling: () => ({ type: Events.STOP_API_POLLING, payload: { type: 'auto-refresh' } }),
  getQueueStatus: () => ({ type: Events.MAINPAGE_QUEUE_STATUS }),
  getSettings: () => ({ type: Events.SETTINGS_GET_SERVER }),
  load: () => ({ type: Events.MAINPAGE_LOAD }),
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector>;

export default connector(MainPage);

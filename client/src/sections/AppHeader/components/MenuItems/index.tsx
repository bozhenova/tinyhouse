import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Menu } from 'antd';
import { Icon } from '@ant-design/compatible';
import { useMutation } from '@apollo/react-hooks';
import { LOG_OUT } from '../../../../lib/graphql/mutations';
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut';
import {
  displaySuccessNotification,
  displayErrorMessage,
} from '../../../../lib/utils';
import { Viewer } from '../../../../lib/types';
const { Item, SubMenu } = Menu;

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        displaySuccessNotification(`You've successfully logged out!`);
      }
    },
    onError: (data) => {
      displayErrorMessage(
        `Sorry! We were't able to log you out. Please try again later!`
      );
    },
  });

  const handleLogOut = () => {
    logOut();
  };

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />}>
        <Item key='/user'>
          <Link to={`/user/${viewer.id}`}>
            <Icon type='user' />
            Profile
          </Link>
        </Item>
        <Item key='/logout'>
          <div onClick={handleLogOut}>
            <Icon type='logout' />
            Log out
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item key='/login'>
        <Button type='primary'>Sign In</Button>
      </Item>
    );
  return (
    <Menu mode='horizontal' selectable={false} className='menu'>
      <Item key='/host'>
        <Link to='/host'>
          <Icon type='home' />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};

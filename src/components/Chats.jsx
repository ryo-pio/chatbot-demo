import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import {Chat} from './index'
import { Autorenew } from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    "chats" : {
      height: 400,
      padding: 0,
      overflow: "auto",
    }
  }),
);

const Chats = (props) => {
  const classes = useStyles();
  return (
    <List className={classes.chats}>
      {props.chats.map((chat, index)=>{
        return <Chat text={chat.text} type={chat.type} key={index.toString()} />
      })}
    </List>
  )
}

export default Chats;
/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';

import BoardList from './../../components/BoardList';
import NewListButton from './../../components/NewListButton';

import io from 'socket.io-client';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

const Board = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  overflow: auto;
`;

const ListWrapper = styled.div`
  width: 272px;
  min-width: 272px;
  margin: 0 4px;
  height: 100%;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  white-space: nowrap;
`;

export default class Sprintboard extends React.PureComponent {

 constructor(props) {
    super(props)

    this.state = {
      listData: {},
      loading: true
    };

    this.sendStory = this.sendStory.bind(this)
    this.addList = this.addList.bind(this)
  }

  getData = data => {
    this.setState({ listData: JSON.parse(data)});
  };

  changeData = () => this.props.socket.emit("initial_data");

  componentDidMount() {
    this.props.socket.on('connect', function(_socket) {
      console.log("connected")
      this.props.socket.emit('join', {username: 'andreas', group: 'Chads'});
      this.setState({loading: true});
    }.bind(this));
    this.props.socket.on('disconnect', function(){
      console.log("disconnected")
    });
    this.props.socket.emit('initial_data');
    this.props.socket.on('get_data', this.getData);
    this.props.socket.on('change_data', this.changeData);
  }

  componentWillUnmount() {
    this.props.socket.off("get_data");
    this.props.socket.off("change_data");
  }

  sendStory(data) {
    this.props.socket.emit('add_story', data);
  }

  addList(list) {
    console.log(list)
  }

  render() {
      return (
        <Wrapper>
          <Board>
            {
              "lists" in this.state.listData
              ?
              this.state.listData["lists"].map((item, index) => {
                return( 
                <ListWrapper>
                  <BoardList name={item.name} sendStory={this.sendStory} list={item.stories} key={index} />
                </ListWrapper>)
              })
              :
              this.state.loading ? <BoardList name="loading" list={[]} /> : null
            }
            <ListWrapper>
              <NewListButton addList={this.addList} />
            </ListWrapper>
          </Board>
        </Wrapper>
      );
  }
}
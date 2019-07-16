import React from 'react';
import { connect } from 'react-redux';

import BoardList from './../../sharedComponents/BoardList';
import NewListButton from './../../sharedComponents/NewListButton';

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

class Sprintboard extends React.PureComponent {

 constructor(props) {
    super(props)

    this.state = {
      listData: {},
      loading: true
    };
  }

  componentDidMount() {

  }

  sendStory(data) {
    /*
    this.props.socket.emit('add_story', data);
    */
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

function mapStateToProps(state) {
    const { teams } = state.authentication.user;
    const { selectedProduct } = state.product
    return {
        teams,
        selectedProduct
    };
}

const connectedSprintboard = connect(mapStateToProps)(Sprintboard);
export { connectedSprintboard as Sprintboard }; 
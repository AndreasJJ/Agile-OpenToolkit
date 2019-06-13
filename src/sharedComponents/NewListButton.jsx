import React from 'react';

import styled from 'styled-components';
import {Times} from 'styled-icons/fa-solid/Times';

const ButtonWrapper = styled.div`
  padding: 10px;
  background-color: #40B558;
  border-radius: 3px;
  color: white;

  &:hover {
    background-color: #2e8440;
  }

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
`

const ButtonInner = styled.div`

`

const AddStoryInputWrapper = styled.div`
  margin: 0 4px 4px;
  padding: 0 4px 4px;
`;

const AddStoryTextArea = styled.textarea`
  width: 100%;
  height: 50px;
  resize: vertical;
`;

const AddStoryControlsWrapper = styled.div`
  display: flex;
  flex-direction: horizontal;
  margin-top: 5px;
  justify-content: end;
  align-items: center;
`;

const AddStoryButton = styled.button`
    background-color: #5aac44;
    box-shadow: 0 1px 0 0 #3f6f21;
    border: none;
    color: #fff;
    width: 85px;
    height: 35px;
    margin-right: 5px;
`;

/* eslint-disable react/prefer-stateless-function */
export default class BoardList extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      showAddList: false,
      listName: ""
    };

    this.clickAddList = this.clickAddList.bind(this)
    this.clickShowAddList = this.clickShowAddList.bind(this)
    this.clickCloseAddList = this.clickCloseAddList.bind(this)
  }

  componentDidMount() {

  }

  clickShowAddList() {
    this.setState({
      showAddList: true
    });
  }

  clickAddList() {
    this.props.addList(this.state.listName)
    this.setState({
      listName: ""
    });
  }

  clickCloseAddList() {
    this.setState({
      showAddList: false
    });
  }

  changeInputValue(value) {
    this.setState({
      listName: value
    });
  }

  render() {
    return (
        this.state.showAddList
        ?
        <ButtonWrapper>
          <ButtonInner>
            <AddStoryInputWrapper>
              <AddStoryTextArea value={this.state.listName} onChange={e => this.changeInputValue(e.target.value)} />
              <AddStoryControlsWrapper>
                <AddStoryButton onClick={this.clickAddList}>Add List</AddStoryButton>
                <Times size="1.5em" onClick={this.clickCloseAddList} />
              </AddStoryControlsWrapper>
            </AddStoryInputWrapper>
          </ButtonInner>
        </ButtonWrapper>
        :
        <ButtonWrapper onClick={this.clickShowAddList}>
          <ButtonInner>
            + Add another list
          </ButtonInner>
        </ButtonWrapper>
    );
  }
}
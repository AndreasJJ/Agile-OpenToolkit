import React, {useState} from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import {Times} from 'styled-icons/fa-solid/Times';

const ButtonWrapper = styled.div`
  padding: 10px;
  background-color: #40B558;
  border-radius: 3px;
  color: white;
  height: fit-content;
  min-width: fit-content;

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
`;

const AddStoryInput = styled.input`
  width: 100%;
  height: 30px;
  box-sizing: border-box;
`;

const AddStoryControlsWrapper = styled.div`
  display: flex;
  flex-direction: horizontal;
  margin-top: 5px;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
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

const NewListButton = (props) => {
  // State
  const [showAddList, setShowAddList] = useState(false)
  const [listName, setListName] = useState("")

  // Show the form
  const clickShowAddList = () => {
    setShowAddList(true)
  }

  // Add the list and clear the input
  const clickAddList = () => {
    props.addList(listName)

    setListName("")
  }

  // Hide the form
  const clickCloseAddList = () => {
    setShowAddList(false)
  }

  // On change function
  const changeInputValue = (value) => {
    setListName(value)
  }

  return (
    showAddList
    ?
    <ButtonWrapper>
      <ButtonInner>
        <AddStoryInputWrapper>
          <AddStoryInput value={listName} onChange={e => changeInputValue(e.target.value)} />
          <AddStoryControlsWrapper>
            <AddStoryButton onClick={clickAddList}>Add List</AddStoryButton>
            <Times size="1.5em" onClick={clickCloseAddList} />
          </AddStoryControlsWrapper>
        </AddStoryInputWrapper>
      </ButtonInner>
    </ButtonWrapper>
    :
    <ButtonWrapper onClick={clickShowAddList}>
      <ButtonInner>
        + Add another list
      </ButtonInner>
    </ButtonWrapper>
  )
}

NewListButton.proptypes = {
  addList: PropTypes.func.isRequired
}

export default NewListButton
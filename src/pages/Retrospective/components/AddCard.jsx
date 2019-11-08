import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import {TrashAlt} from 'styled-icons/fa-solid/TrashAlt';

const Wrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 5px;
`

const Input = styled.textarea`
  flex-grow: 1;
  min-height: 40px;
  resize: none;
`

const Controls = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const AddButton = styled.button`
  background-color: #5aac44;
  box-shadow: 0 1px 0 0 #3f6f21;
  border: none;
  color: #fff;
  width: 50px;
  height: 25px;
  margin: 5px 5px 5px 0px;
`

const RemoveButton = styled(TrashAlt)`
  margin: 5px 0px 5px 5px;
  border: none;
  padding: 0px;
  background-color: transparent;
`

const Retrospective = (props) => {
  const handleKeyDown = (e) => {
    // Reset field height
    e.target.style.height = 'inherit';
    // Get the computed styles for the element
    const computed = window.getComputedStyle(e.target);
    // Calculate the height
    const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                 + parseInt(computed.getPropertyValue('padding-top'), 10)
                 + e.target.scrollHeight
                 + parseInt(computed.getPropertyValue('padding-bottom'), 10)
                 + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    e.target.style.height = `${height}px`;
  }

  return (
    <Wrapper>
      <Input onKeyDown={handleKeyDown} />
      <Controls> 
        <AddButton> Add </AddButton>
        <RemoveButton size="1.5em" />
      </Controls>
    </Wrapper>
  );
}

Retrospective.proptypes = {

}

export default Retrospective
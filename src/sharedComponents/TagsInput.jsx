import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Pill from './Pill';

import styled from 'styled-components';

const Input = styled.input`
  font-size: 16px;
  color: #fff;
  line-height: 1.2;
  display: block;
  width: 100%;
  height: 45px;
  background: #F4F4F4;
  outline: none;
  position: relative;
  border-style: none;
  border: 1px solid #dddfe6;
  border-radius: 4px;
  padding: 0px 10px 0px 10px;
  margin-bottom: 5px;
  color: #000000;
`

const ValuesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const TagsInput = (props) => {
  const [tagsInputValue, setTagsInputValue] = useState("")
  const [tags, setTags] = useState([])
  
  // Adds tag to state
  const addTag = (tag) => {
    // If tag is empty then end
    if (tag == '') return;

    // Remove whitespace
    tag = tag.trim();

    // If it the tag doesnt already exist then concat it with the existing tags and add it
    if(!(tags.indexOf(tag) > -1)) {
      let _tags = tags.concat([tag]);
      setTags(_tags);
    }

    updateTagValue('');
  }

  // Updates current input tag value
  const updateTagValue = (value) => {
    if(value == ' ') {
      return;
    }

    setTagsInputValue(value)
  }

  // Removes tag from state
  const removeTag = (removeTag) => {
    let tags = tags.filter((tag) => tag !== removeTag);
    setTags(tags);
  }

  // Handles space keypress
  // Adds member tag to state
  const handleKeyPress = (e) => {
    if(e.key === ' '){
      addTag(e.target.value)
    }
  }

  return (
    <div>
     <Input value={tagsInputValue} 
                onChange={(e) => {updateTagValue(e.target.value);}} 
                onKeyPress={handleKeyPress} 
                type="text" placeholder="Members seperated by space"
      />
     <ValuesContainer>
      {tags && tags.map((tag, index) => <Pill key={index} onClear={() => removeTag(tag)} text={tag} />)}
     </ValuesContainer>
    </div>
  )
}

TagsInput.proptypes = {
  
}

export default TagsInput
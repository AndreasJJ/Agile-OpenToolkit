import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import BoardList from './../../sharedComponents/BoardList';
import NewListButton from './../../sharedComponents/NewListButton';

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

const Sprintboard = ({finishLoading}) => {
  // State
  const [listData, setListData] = useState({})
  const [loading, setLoading] = useState(true)
  const counter = useSelector(state => state.counter)

  // Constructor
  useEffect(() => {
    finishLoading()
  }, [])

  // Function to add list to board
  const addList = (list) => {
    console.log(list)
  }

  return (
    <Wrapper>
      <Board>
        {
          "lists" in listData
          ?
          listData["lists"].map((item, index) => {
            return( 
              <ListWrapper>
                <BoardList name={item.name} 
                           list={item.stories} 
                           key={index} 
                />
              </ListWrapper>
            )
          })
          :
            loading 
            ? <ListWrapper>
                <BoardList name="loading" list={[]} /> 
              </ListWrapper>
            : 
              null
        }
        <ListWrapper>
          <NewListButton addList={addList} />
        </ListWrapper>
      </Board>
    </Wrapper>
  );
}

Sprintboard.propTypes = {
  finishLoading: PropTypes.func.isRequired
}

export { 
  Sprintboard 
} 
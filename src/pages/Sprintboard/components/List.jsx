import React from 'react';
import PropTypes from 'prop-types';

import { StoryCard } from './StoryCard';

import { Draggable, Droppable } from 'react-beautiful-dnd';

import styled from 'styled-components';
import {Times} from 'styled-icons/fa-solid/Times';

const Container = styled.div`
    margin-right: 20px;
    display: flex;
    flex-direction: column;

    outline: ${props => props.isDragging ? "none" : null};
    border-color: ${props => props.isDragging ? "#9ecaed" : null};
    box-shadow: ${props => props.isDragging ? "0 0 10px #9ecaed" : null};
`

const ListBody = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${props => props.isDragging ? "#9ecaed" : "#ffffff"};
    -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    border-radius: 0px 0px 5px 5px;
    width: 300px;
    padding: 5px;
    flex: 1;
`

const ListHeader = styled.div`
    background-color: ${props => props.isDragging ? "#9ecaed" : "#ffffff"};
    -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    border-radius: 5px 5px 0px 0px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 5px;
`

const ListHeaderTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
`

const ListHeaderTitle = styled.h3`
    margin: 0px;
`

const RemoveButton = styled(Times)`
    cursor: default;
`

const List = ({listId, title, stories, storiesInList, index, deleteList}) => {
    const removeList = () => {
        deleteList(listId)
    }

    return (
        <Draggable draggableId={listId + ";" + index} index={index}>
            {(provided, snapshot) => (
                <Container
                           {...provided.draggableProps} 
                           ref={provided.innerRef} 
                           isDragging={snapshot.isDragging}
                >
                    <ListHeader isDragging={snapshot.isDragging} {...provided.dragHandleProps} >
                        <ListHeaderTitleWrapper>
                            <ListHeaderTitle>{title}</ListHeaderTitle>
                        </ListHeaderTitleWrapper>
                        {
                            title.toUpperCase() !== "OPEN" && title.toUpperCase() !== "CLOSED"
                            ?
                                <RemoveButton size="1.5em" onClick={removeList} />
                            :
                                null
                        }
                    </ListHeader>
                    <Droppable droppableId={listId + ";" + title}>
                        {provided => (
                            <ListBody isDragging={snapshot.isDragging} ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    stories && stories.filter(story => storiesInList.includes(story.id)).map((story, index) => 
                                        <StoryCard draggableId={story.id}
                                                index={index}
                                                key={story.id} 
                                                title={story.title} 
                                                description={story.description}
                                                labels={story.labels}
                                                creator={story.creator}
                                        />
                                    )
                                }
                                {provided.placeholder}
                            </ListBody>
                        )}
                    </Droppable>
                </Container>
            )}
        </Draggable>
    );
}

List.propTypes = {
    listId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    stories: PropTypes.array.isRequired,
    storiesInList: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    deleteList: PropTypes.func.isRequired
}

export { 
    List 
} 
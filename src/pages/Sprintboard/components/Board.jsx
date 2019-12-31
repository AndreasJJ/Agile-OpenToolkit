import React, {useState, useEffect, useContext} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { FirebaseContext, ListenToDocuments, UpdateDocument, AddDocument, DeleteDocument, BatchWrite, BatchUpdate } from '../../../sharedComponents/Firebase';

import NewListButton from './NewListButton';
import { List } from './List';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    padding: 20px;
    display: flex;
    overflow: auto;
    position: relative;
`

const Container = styled.div`
    display: flex;
`

const BackToInfoPage = styled.div`
    position: absolute;
    top: 5px;
    left: 5px;
    padding: 5px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
    box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);

    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Safari */
    -khtml-user-select: none;    /* Konqueror HTML */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;  /* Non-prefixed version, currently supported by Chrome and Opera */

    &:hover {
        background-color: #2ECEFE;
        color: #ffffff;
    }
`

const Board = ({productId, sprintId, toggleInfoPage}) => {
    // Firebase
    const firebase = useContext(FirebaseContext)

    // State
    const [loading, setLoading] = useState(true)
    const [lists, setLists] = useState(null)
    const [stories, setStories] = useState(null)

    // Redux state
    const uid = useSelector(state => state.authentication.user.uid)
    const firstname = useSelector(state => state.authentication.user.firstname)
    const lastname = useSelector(state => state.authentication.user.lastname)

    // Constructor
    // Set up listeners to get stories and lists /w updates
    useEffect(() => {
        const init = async () => {
            await getStories()
            await getLists()
        }
        init()
    }, [])

    useEffect(() => {
        if(lists) {
            setLoading(false)
        }
    }, [lists])

    // Function to get lists
    const getLists = async () => {
        // Function called on init and updates
        const onSnapshot = (snapshot) => {
            // Get lists from snapshot
            let _lists = snapshot.docs.map((document) => {
                let obj = document.data()
                obj.id = document.id
                return obj
            })

            // Get the "OPEN" and "CLOSED" lists and remove them from the list of lists
            let openIndex = _lists.findIndex(list => list.title.toUpperCase() === "OPEN")
            let open = _lists[openIndex]
            _lists.splice(openIndex, 1)
            let closedIndex = _lists.findIndex(list => list.title.toUpperCase() === "CLOSED")
            let closed = _lists[closedIndex]
            _lists.splice(closedIndex, 1)

            // Sort the remaining lists
            _lists.sort((list1, list2) => list1.position - list2.position)

            // Add the "OPEN" list to the start and the "CLOSED" list to the end
            _lists.splice(0, 0, open)
            _lists.push(closed)

            // Update the state
            setLists(_lists)
        }
        // Gets the lists and calls update dunction onSnapshot on updates
        // TODO MAKE FUNCTION RETURN LISTENER SO THAT IT CAN BE UNMOUNTED ON UNMOUNT
        await ListenToDocuments(firebase, onSnapshot, "/products/" + productId + "/sprints/" + sprintId + "/lists")
    }

    // Function to add a new list to the database
    const addList = async (listName) => {
        // List data
        let list = {
            title: listName.toUpperCase(),
            stories: [],
            position: lists.length - 1
        }

        await AddDocument(firebase, "/products/" + productId + "/sprints/" + sprintId + "/lists", list)
    }

    // Function to delete a list from the database
    const deleteList = async (listId) => {
        await DeleteDocument(firebase, "/products/" + productId + "/sprints/" + sprintId + "/lists/" + listId)
    }

    // Function to get stories from the database
    const getStories = async () => {
        // Function called on init and updates
        const onSnapshot = (snapshot) => {
            // Get stories from snapshot
            let _stories = snapshot.docs.map((document) => {
                let obj = document.data()
                obj.id = document.id
                return obj
            })
            // Update teh state
            setStories(_stories)
        }
        // Gets the stories and calls update dunction onSnapshot on updates
        await ListenToDocuments(firebase, onSnapshot, "/products/" + productId + "/sprints/" + sprintId + "/stories")
    }

    const onDragEnd = (result) => {
        // Destruct result 
        const {destination, source, draggableId, type} = result
        
        // If the destionation doesnt exist (dragged outside context) then exit
        if(!destination) {
          return
        }
    
        // if the container and position in container is the same then exit
        if(
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ) {
          return
        }

        // If a list is moved
        if(type === "column") {
            // If a list is moved to the start or end, then end
            if(source.index === 0 || destination.index === 0 || source.index === lists.length-1 || destination.index === lists.length-1) {
                return
            }

            // Changed the index of the dragged list into the correct index in the list of lists
            let newLists = Array.from(lists)
            let movedList = newLists[source.index]
            newLists.splice(source.index, 1)
            newLists.splice(destination.index, 0, movedList)

            // Make batch with path and position to update all lists except the "OPEN" and "CLOSED" lists
            let batch = []
            for (let i = 1; i < newLists.length-1; i++) {
                batch.push(["/products/" + productId + "/sprints/" + sprintId + "/lists/" + newLists[i].id, {position: i}])
            }

            // Batch update the positions of the lists
            BatchUpdate(firebase, batch)
            // Update state
            return setLists(newLists)
        }
        
        // If a list element is moved to a different list
        if (destination.droppableId !== source.droppableId) {
            let batch = []

            // List element (story) update data
            let update = {
                lastUpdateTimestamp: firebase.db.app.firebase_.firestore.FieldValue.serverTimestamp(),
                lastEditer: {
                  uid: uid,
                  firstname: firstname,
                  lastname: lastname
                }
            }

            // List name
            let listName = (destination.droppableId.toUpperCase()).split(";")[1]
            // Story index in list
            let index = stories.findIndex(story => story.id == draggableId)
            // Set the status of the moved story to "OPEN" and it to the batch update
            // This happens if it is moved to any list, but the "CLOSED" list
            if(stories[index].status.toUpperCase() === "CLOSED" && listName !== "CLOSED") {
                update.status = "OPEN"
                batch.push(["products/" + productId + "/stories/" + draggableId, update])
            // Set the status of the moved story to "CLOSED" and it to the batch update
            // This happens if it is moved to the "CLOSED" list
            } else if (stories[index].status.toUpperCase() === "OPEN" && listName === "CLOSED") {
                update.status = "CLOSED"
                batch.push(["products/" + productId + "/stories/" + draggableId, update])
            }
            // Remove and add the story to the corresponding lists
            batch.push(["products/" + productId + "/sprints/" + sprintId + "/lists/" + destination.droppableId.split(";")[0], {stories: firebase.db.app.firebase_.firestore.FieldValue.arrayUnion(draggableId)}])
            batch.push(["products/" + productId + "/sprints/" + sprintId + "/lists/" + source.droppableId.split(";")[0], {stories: firebase.db.app.firebase_.firestore.FieldValue.arrayRemove(draggableId)}])
            
            // Update the database
            BatchUpdate(firebase, batch)
        }
        /* 
         * Update the local version of the story to reflex the change in firebase before the updates happen
         * to allow the list to not revert back to its original order as firebase dont update fast enough
         */
        
        // Copy of lists
        let _lists = Array.from(lists)

        //**************** Add the story to the new list it got dropped into ****************
        // Index of the list it got dropped into
        let newListIndex = _lists.findIndex(list => list.id === (destination.droppableId).split(";")[0])
        // Add the story to the list that it got dropped into
        _lists[newListIndex].stories.push(draggableId)

        //**************** Remove the story from the last it got dragged from ****************
        let oldListIndex = _lists.findIndex(list => list.id === (source.droppableId).split(";")[0])
        let oldStoryIndex = _lists[oldListIndex].stories.findIndex(storyId => storyId === draggableId)
        _lists[oldListIndex].stories.splice(oldStoryIndex, 1)

        // Update state
        setLists(_lists)
    }

    return (
        !loading
        ?
            <Wrapper>
                <BackToInfoPage onClick={toggleInfoPage}>
                    Back
                </BackToInfoPage>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="listWrapper" direction="horizontal" type="column">
                        {provided => (
                            <Container ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    lists && lists.map((list, index) => 
                                        <List title={list.title}
                                            stories={stories}
                                            storiesInList={list.stories}
                                            listId={list.id}
                                            sprintId={sprintId}
                                            productId={productId}
                                            index={index}
                                            deleteList={deleteList}
                                            key={index} />
                                    )
                                }
                                {provided.placeholder}
                            </Container>
                        )}
                    </Droppable>
                    <NewListButton addList={addList} />
                </DragDropContext>
            </Wrapper>
        :
            null
    );
}

Board.propTypes = {
    productId: PropTypes.string.isRequired,
    sprintId: PropTypes.string.isRequired,
    toggleInfoPage: PropTypes.func.isRequired
}

export { 
    Board 
} 
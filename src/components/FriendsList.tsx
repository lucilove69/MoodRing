import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';

interface FriendsListProps {
  friends: string[];
  title: string;
  isEditMode: boolean;
  onFriendsReorder?: (newOrder: string[]) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ 
  friends, 
  title, 
  isEditMode, 
  onFriendsReorder 
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !isEditMode || !onFriendsReorder) {
      return;
    }
    
    const items = Array.from(friends);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onFriendsReorder(items);
  };
  
  return (
    <div className="border-2 border-gray-400 p-4 mb-6 bg-gray-100">
      <h2 className="text-xl font-bold mb-4 text-[var(--myspace-blue)]">{title}</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="friends-list">
          {(provided) => (
            <div
              className="grid grid-cols-2 gap-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {friends.map((friendId, index) => (
                <Draggable
                  key={friendId}
                  draggableId={friendId}
                  index={index}
                  isDragDisabled={!isEditMode}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-2 text-center ${isEditMode ? 'cursor-move border-2 border-dashed border-gray-400' : ''}`}
                    >
                      <Link to={`/profile/${friendId}`}>
                        <img 
                          src={`/images/user-avatars/${friendId}.jpg`}
                          alt={friendId}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/default-avatars/avatar1.jpg';
                          }}
                          className="w-16 h-16 mx-auto border border-gray-500 mb-1"
                        />
                        <p className="text-xs">{friendId}</p>
                      </Link>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {isEditMode && (
        <p className="text-xs text-center mt-4 italic">
          Drag & drop to reorder your Top 8 friends
        </p>
      )}
      
      <div className="text-center mt-4">
        <Link to="/friends" className="text-sm text-blue-600 hover:underline">
          View All Friends
        </Link>
      </div>
    </div>
  );
};

export default FriendsList;
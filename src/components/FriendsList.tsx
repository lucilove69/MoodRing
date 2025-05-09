import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
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
    <div className="border border-[#7FB3D5] rounded-lg p-6 mb-6 bg-gradient-to-b from-[#E8F4F8] to-[#F5F9FC] shadow-[0_2px_8px_rgba(127,179,213,0.2)]">
      <h2 className="text-xl font-light mb-4 text-[#2C5F8A]">{title}</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="friends-list">
          {(provided) => (
            <div
              className="grid grid-cols-2 gap-4"
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
                      className={`p-3 text-center rounded-lg transition-all duration-200 ${
                        isEditMode 
                          ? 'cursor-move border border-dashed border-[#7FB3D5] hover:bg-[#F0F7FC]' 
                          : 'hover:bg-[#F0F7FC]'
                      }`}
                    >
                      <Link to={`/profile/${friendId}`}>
                        <div className="relative group">
                          <img 
                            src={`/images/user-avatars/${friendId}.jpg`}
                            alt={friendId}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/default-avatars/avatar1.jpg';
                            }}
                            className="w-20 h-20 mx-auto rounded-full border-2 border-[#7FB3D5] mb-2 transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-[#2C5F8A]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                        <p className="text-sm text-[#2C5F8A] font-light">{friendId}</p>
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
        <p className="text-xs text-center mt-4 text-[#2C5F8A]/70 font-light">
          Drag & drop to reorder your friends
        </p>
      )}
      
      <div className="text-center mt-6">
        <Link 
          to="/friends" 
          className="inline-block px-4 py-2 text-sm text-[#2C5F8A] hover:text-[#1A4B7A] font-light transition-colors duration-200"
        >
          View All Friends
        </Link>
      </div>
    </div>
  );
};

export default FriendsList;
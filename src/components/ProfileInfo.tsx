import React from 'react';
import { User } from '../types';

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  return (
    <div className="border-2 border-gray-400 p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 text-[var(--myspace-blue)]">
        {user.firstName}'s Details
      </h2>
      
      <div className="mb-4">
        <h3 className="font-bold mb-2">About Me:</h3>
        <div className="text-sm border-l-4 border-gray-300 pl-4">
          {user.about || "This user hasn't written anything here yet."}
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-bold mb-2">Who I'd Like to Meet:</h3>
        <div className="text-sm border-l-4 border-gray-300 pl-4">
          {"This user hasn't added this information yet."}
        </div>
      </div>
      
      <div>
        <h3 className="font-bold mb-2">Interests:</h3>
        <div className="text-sm border-l-4 border-gray-300 pl-4">
          {user.interests || "This user hasn't listed any interests yet."}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
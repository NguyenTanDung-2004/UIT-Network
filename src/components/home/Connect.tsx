import React from "react";
import Image from "next/image";

// Types
export enum ConnectionStatus {
  NONE = "none",
  PENDING = "pending",
  CONNECTED = "connected",
}

interface PersonToConnectProps {
  person: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
    status: ConnectionStatus;
  };
  onConnect: (id: string) => void;
}

interface GroupToJoinProps {
  group: {
    id: string;
    name: string;
    avatar?: string;
    years?: string;
    joined: boolean;
  };
  onJoin: (id: string) => void;
}

// Component for displaying a person to connect with
export const PersonToConnect: React.FC<PersonToConnectProps> = ({
  person,
  onConnect,
}) => {
  const renderButton = () => {
    switch (person.status) {
      case ConnectionStatus.NONE:
        return (
          <button
            onClick={() => onConnect(person.id)}
            className="w-8 h-8 bg-pink-100 rounded-full text-primary hover:bg-pink-200 flex items-center justify-center "
          >
            <i className="fas fa-plus text-xs"></i>
          </button>
        );
      case ConnectionStatus.CONNECTED:
        return (
          <button className="w-8 h-8 bg-primary rounded-full text-white flex items-center justify-center ">
            <i className="fas fa-user-check text-xs"></i>
          </button>
        );
      case ConnectionStatus.PENDING:
        return (
          <button className="w-8 h-8 bg-primary rounded-full text-white flex items-center justify-center ">
            <i className="fas fa-check text-xs"></i>
          </button>
        );
    }
  };

  return (
    <div className="flex justify-between items-center py-2 dark:text-gray-300">
      <div className="flex items-center">
        <div className="w-8 h-8 relative rounded-full overflow-hidden border dark:border-gray-700">
          <Image
            src={person.avatar}
            alt={person.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="ml-2">
          <p className="font-medium text-sm dark:text-gray-300">
            {person.name}
          </p>
          {person.role && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {person.role}
            </p>
          )}
        </div>
      </div>
      {renderButton()}
    </div>
  );
};

// Component for displaying a group to join
export const GroupToJoin: React.FC<GroupToJoinProps> = ({ group, onJoin }) => {
  return (
    <div className="flex justify-between items-center py-2 dark:text-gray-300">
      <div className="flex items-center">
        <div className="w-8 h-8 relative rounded-full overflow-hidden bg-blue-100 flex items-center justify-center dark:bg-gray-700 dark:border-gray-600">
          {group.avatar ? (
            <Image
              src={group.avatar}
              alt={group.name}
              fill
              className="object-cover"
            />
          ) : (
            <i className="fas fa-users text-blue-500 text-xs dark:text-gray-400"></i>
          )}
        </div>
        <div className="ml-2">
          <p className="font-medium text-sm dark:text-gray-300">{group.name}</p>
          {group.years && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {group.years}
            </p>
          )}
        </div>
      </div>
      {group.joined ? (
        <button className="w-8 h-8 bg-primary  rounded-full text-white flex items-center justify-center ">
          <i className="fas fa-check text-xs"></i>
        </button>
      ) : (
        <button
          onClick={() => onJoin(group.id)}
          className="w-8 h-8 bg-pink-100 rounded-full text-primary hover:bg-pink-200 flex items-center justify-center "
        >
          <i className="fas fa-plus text-xs"></i>
        </button>
      )}
    </div>
  );
};

// Container component for people to connect with
export const PeopleToConnectWidget: React.FC<{
  title: string;
  people: PersonToConnectProps["person"][];
  onConnect: (id: string) => void;
}> = ({ title, people, onConnect }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 dark:bg-gray-800 dark:shadow-gray-700">
      <h3 className="font-semibold text-base mb-2 dark:text-gray-200">
        {title}
      </h3>
      <div className="space-y-3">
        {people.map((person) => (
          <PersonToConnect
            key={person.id}
            person={person}
            onConnect={onConnect}
          />
        ))}
      </div>
    </div>
  );
};

// Container component for groups to join
export const GroupsToJoinWidget: React.FC<{
  title: string;
  groups: GroupToJoinProps["group"][];
  onJoin: (id: string) => void;
}> = ({ title, groups, onJoin }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4 dark:bg-gray-800 dark:shadow-gray-700">
      <h3 className="font-semibold text-base mb-2 dark:text-gray-200">
        {title}
      </h3>
      <div className="space-y-3">
        {groups.map((group) => (
          <GroupToJoin key={group.id} group={group} onJoin={onJoin} />
        ))}
      </div>
    </div>
  );
};
